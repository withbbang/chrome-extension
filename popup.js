// popup js: 확장자 팝업 페이지 제어 스크립트

"use strict";

// 확장자 팝업 페이지 토글 초기화
(function init() {
  // 확장자 팝업에서 갖고 있는 로컬 스토리지 값 가져오기 (비동기이므로 콜백 처리해야함)
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

// 토글 제어 이벤트
toggle.addEventListener("change", () => {
  const isChecked = toggle.checked;

  if (isChecked) {
    document.getElementById("dict").style.display = "";
    document.getElementById("translation").style.display = "none";
  } else {
    document.getElementById("dict").style.display = "none";
    document.getElementById("translation").style.display = "";
  }

  // 확장자 팝업에서 갖고 있는 로컬 스토리지 값 세팅하기
  chrome.storage.local.set({ isDict: isChecked });

  //   팝업에서 제어한 데이터 전달하기
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     chrome.tabs.sendMessage(tabs[0].id, { isDict });
  //   });
});
