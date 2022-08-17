// background js: 브라우져가 살아있는 상태에 외부에서 유저가 보고 있는 페이지를 간접적으로 조작하는 스크립트

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
          const daumDocument = parser.parseFromString(text, "text/html");
          const searchResults = daumDocument.querySelector(".search_box");

          if (searchResults) {
            const searchLi = searchResults.getElementsByTagName("li");

            const results = [...searchLi].map((li) =>
              [...li.getElementsByClassName("txt_search")]
                .map((txt) => txt.innerHTML.replace(/(<([^>]+)>)/gi, ""))
                .join(""),
            );

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
