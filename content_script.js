"use strict";

// 팝업에서 제어한 데이터 전달받는 함수
// let isChecked;
// chrome.extension.onMessage.addListener((request) => {
//   isChecked = request.isChecked;
// });

let posX;
let posY;

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

document.onkeydown = (e) => {
  e.ctrlKey && e.altKey && reqMessage(e);
};

document.onmouseup = (e) => {
  posX = e.clientX;
  posY = e.clientY;
};
