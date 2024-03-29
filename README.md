# 단어 사전 & 구문 번역 크롬 확장 프로그램

### 프로젝트 목적

> 브라우저 확장 프로그램을 이해하기 위한 프로젝트<br/>
> 개인 편의를 위한 프로젝트<br/>
> 심심풀이용

---

### 프로젝트 구조

```
CHROME-EXTENSION
├─ icons
│  └─ earth.png
├─ background.js
├─ content_script.js
├─ popup.js
├─ env.js
├─ manifest.json
├─ popup.html
├─ content_script.css
└─ popup.css
```

---

### 파일 설명

- background.js: 브라우저가 살아있는 상태에서만 백그라운드에서 유저가 보고 있는 페이지를 간접적으로 조작하는 스크립트
- content_script.js: 유저가 보고 있는 페이지에서 동작하는 스크립트
- popup.js: 확장 프로그램 팝업 페이지 제어 스크립트
- env.js: 환경 변수
- popup.html: 확장 프로그램 팝업 페이지
- manifest.json: 확장 프로그램 구성 정보를 담고있는 파일

---

### 사용한 API

#### 1) 파파고 네이버 번역 API

- https://openapi.naver.com/v1/papago/n2mt

#### 2) 다음 사전 API

- https://dic.daum.net/search.do?q=word

---

### 구현화면
