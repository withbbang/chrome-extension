// content script js: 유저가 보고 있는 페이지에서 동작하는 스크립트

"use strict";

// 팝업에서 제어한 데이터 전달받는 함수
// let isChecked;
// chrome.extension.onMessage.addListener((request) => {
//   isChecked = request.isChecked;
// });

let posX;
let posY;

// 구문 혹은 단어 드래그 이후 onkeydown 콜백 이벤트
const reqMessage = (e) => {
  const msg = window.getSelection().toString();

  if (!msg.trim() || !chrome.runtime) return;

  // 확장자 팝업에서 갖고 있는 로컬 스토리지 값 가져오기
  chrome.storage.local.get(["isDict"], (result) => {
    /**
     * background js의 chrome.runtime.onMessage에 인자값 전달 후 응답값 처리
     * 첫번째 인자: background js의 chrome.runtime.onMessage에 전달할 인자
     * 두번째 인자: background js에서 처리한 값을 받는 콜백 함수
     */
    chrome.runtime.sendMessage({ msg, isDict: result.isDict }, async (res) => {
      if (res.status === 200) {
        const prevDiv =
          document.getElementById("dict") ?? document.getElementById("dict");

        prevDiv && prevDiv.parentNode.removeChild(prevDiv);

        const div = document.createElement("div");
        div.classList.add("dict");
        div.setAttribute("id", "dict");

        const ul = document.createElement("ul");

        if (Array.isArray(res.body))
          res.body.forEach((word) => {
            const li = document.createElement("li");
            li.textContent = word;
            ul.appendChild(li);
          });
        else {
          const li = document.createElement("li");
          li.textContent = res.body;
          ul.appendChild(li);
        }

        div.style.zIndex = "9999999999999999999";
        div.style.position = "absolute";
        div.style.backgroundColor = "#eee";
        div.style.padding = "5px";

        div.style.top = `${
          parseInt(posY + window.scrollY + e.target.style.height) + 15
        }px`;
        div.style.left = `${posX}px`;

        div.appendChild(ul);
        document.body.appendChild(div);

        document.onkeyup = (e) => {
          e.key === "Escape" &&
            div.parentNode &&
            div.parentNode.removeChild(div);
        };

        document.onclick = () =>
          div.parentNode && div.parentNode.removeChild(div);
      }
    });
  });
};

// ctrl + alt 키 눌렀을 때 이벤트 요청
document.onkeydown = (e) => {
  e.ctrlKey && e.altKey && reqMessage(e);
};

// 사전 혹은 번역 팝업 생성할 위치 받아오기
document.onmouseup = (e) => {
  posX = e.clientX;
  posY = e.clientY;
};
