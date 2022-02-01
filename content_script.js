"use strict";

// 팝업에서 제어한 데이터 전달받는 함수
// let isChecked;
// chrome.extension.onMessage.addListener((request) => {
//   isChecked = request.isChecked;
// });

const reqMessage = (e) => {
  const msg = window.getSelection().toString();

  if (!msg.trim() || !chrome.runtime) return;

  chrome.storage.local.get(["isDict"], (result) => {
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

        div.style.zIndex = "999";
        div.style.position = "absolute";
        div.style.backgroundColor = "#eee";
        div.style.padding = "5px";

        div.style.top = `${
          parseInt(e.clientY + window.scrollY + e.target.style.height) + 15
        }px`;
        div.style.left = `${e.clientX}px`;

        div.onmouseleave = () => {
          div.parentNode.removeChild(div);
        };

        div.appendChild(ul);
        document.body.appendChild(div);

        // 일정 시간 경과시 삭제
        setTimeout(() => {
          div.parentNode && div.parentNode.removeChild(div);
        }, 5 * 1000);
      }
    });
  });
};

document.onmouseup = (e) => {
  reqMessage(e);
};
