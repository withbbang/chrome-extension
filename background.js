// background js: 브라우저가 살아있는 상태에서만 백그라운드에서 유저가 보고 있는 페이지를 간접적으로 조작하는 스크립트

"use strict";

// manifest json에서 정의한 command 제어 이벤트
chrome.commands.onCommand.addListener((command) => {
  chrome.storage.local.get(["isDict"], (result) => {
    if (result.isDict === false) chrome.storage.local.set({ isDict: true });
    else chrome.storage.local.set({ isDict: false });
  });
});

/**
 * content script js의 chrome.runtime.sendMessage에서 온 인자 전달 받은 후 API 혹은 데이터 처리
 * request: chrome.runtime.sendMessage의 첫번째 인자
 * sender: 요청을 보낸 script context js에 대한 정보를 포함한 객체
 * sendResponse: chrome.runtime.sendMessage에 전달할 콜백 함수
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { msg, isDict } = request;
  const dict = {
    한국어사전: 1,
    영어사전: 2,
    영영사전: 3,
  };

  // 토글이 번역일 경우 -> 파파고 번역 API
  if (isDict === false)
    fetch("https://openapi.naver.com/v1/papago/n2mt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
      body: JSON.stringify({
        source: "en",
        target: "ko",
        text: msg,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.text().then((text) => {
          const obj = JSON.parse(text);

          sendResponse({
            status: res.status,
            body: obj.message.result.translatedText,
          });
        });
      } else {
        sendResponse({
          status: res.status,
        });
      }
    });
  // 토글이 사전일 경우 -> 다음 사전 API
  else
    fetch(`https://dic.daum.net/search.do?q=${msg}`).then((res) => {
      if (res.status === 200) {
        res.text().then((text) => {
          const parser = new DOMParser();
          const searchResults = [
            ...parser
              .parseFromString(text, "text/html")
              .querySelectorAll(".tit_word"),
          ] // 돔 파싱 후, 언어 사전 타이틀 읽어오기
            .filter(
              (titleWordTag) =>
                titleWordTag.innerText === "한국어사전" ||
                titleWordTag.innerText === "영어사전" ||
                titleWordTag.innerText === "영영사전"
            ) // 특정 언어 사전만 걸러내기
            .sort((a, b) => {
              if (dict[a.innerText] < dict[b.innerText]) return -1;
              else return 1;
            }) // 순서 설정 -> 한국어, 영어, 영영
            .map((tag) => tag.parentElement)
            .map((tag) => tag.nextElementSibling); // 뜻 담고있는 부모 태그 리스트 접근

          if (
            searchResults &&
            Array.isArray(searchResults) &&
            searchResults.length > 0
          ) {
            let searchLi = [];

            searchResults.forEach((result) => {
              searchLi = [...searchLi, ...result.getElementsByTagName("li")];
            });

            const results = [...searchLi].map((li) =>
              [...li.getElementsByClassName("txt_search")]
                .map((txt) => txt.innerHTML.replace(/(<([^>]+)>)/gi, ""))
                .join("")
            ); // 뜻만 추출하여 리스트업

            sendResponse({
              status: res.status,
              body: results,
            });
          }
        });
      } else {
        sendResponse({
          status: res.status,
        });
      }
    });

  return true;
});
