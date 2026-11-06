# 면접로그 (Myeonlog)

취업 담당자 전용 면접·채용 관리 웹앱 프로토타입.

- 배포: https://idealworld920.github.io/myeonlog/
- 스택: React 19 + Vite, react-router (HashRouter), localStorage 상태 저장
- 데이터: 사람인 크롤링 결과(회사 273곳) + 면접 기록 442건 + 수강생(가명) 292명 — 프로토타입용 정적 JSON
- 예정: Firebase(Auth/Firestore/Storage) 연결, GitHub Actions 일일 크롤링

## 주요 화면
로그인/회원가입 · 회사 목록·상세(공고, 면접 수강생, 메모) · 수강생 검색·상세(취업 여부, 이력서, 면접 이력) · 면접 기록(질문/결과/후기) · 프로젝트(기획서/배포자료/시연영상 상세) · 엑셀 업로드 · 환경설정(테마/글자크기/알림)

## 개발
```bash
npm install
npm run dev
npm run build
```

작성: 이유정
