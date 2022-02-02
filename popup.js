"use strict";

(function init() {
  chrome.storage.local.get(["isDict"], (result) => {
    if (result.isDict === false) {
      document.getElementById("dict").style.display = "none";
      document.getElementById("translation").style.display = "";
      document.getElementById("toggle").checked = false;
    } else {
      document.getElementById("dict").style.display = "";
      document.getElementById("translation").style.display = "none";
      document.getElementById("toggle").checked = true;
    }
  });
})();

const toggle = document.getElementById("toggle");

toggle.addEventListener("change", () => {
  const isChecked = toggle.checked;

  if (isChecked) {
    document.getElementById("dict").style.display = "";
    document.getElementById("translation").style.display = "none";
  } else {
    document.getElementById("dict").style.display = "none";
    document.getElementById("translation").style.display = "";
  }

  chrome.storage.local.set({ isDict: isChecked });

  //   팝업에서 제어한 데이터 전달하기
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     chrome.tabs.sendMessage(tabs[0].id, { isDict });
  //   });
});
