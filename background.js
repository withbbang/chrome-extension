"use strict";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { msg, isDict } = request;

  if (isDict === false) {
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
  } else
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
