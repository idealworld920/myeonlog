// Firebase 설정 — 라라의 Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹)에서 복사한 값을 넣으면 활성화됩니다.
// apiKey 등은 공개되어도 되는 값입니다(보안은 Firestore 규칙으로 관리).
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

export const FB_ENABLED = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
let app = null, auth = null, db = null
if (FB_ENABLED) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
}
export { app, auth, db }
