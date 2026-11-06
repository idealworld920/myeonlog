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

## Firebase 연결
1. `src/firebase.js`의 `firebaseConfig`에 Firebase 콘솔(프로젝트 설정 > 내 앱 > 웹)의 값을 넣는다.
2. Authentication > 이메일/비밀번호 사용 설정, 승인된 도메인에 `idealworld920.github.io` 추가.
3. Firestore Database 생성(asia-northeast3) 후 규칙에 `firestore.rules` 내용 적용.
4. 첫 로그인 시 시드 데이터(수강생/면접/프로젝트)가 자동으로 Firestore에 올라간다.

config가 비어 있으면 자동으로 로컬 모드(브라우저 저장)로 동작한다.
