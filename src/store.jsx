import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import companiesSeed from './data/companies.json'
import interviewsSeed from './data/interviews.json'
import studentsSeed from './data/students.json'
import projectsSeed from './data/projects.json'
import { FB_ENABLED, auth, db } from './firebase'

const KEY = 'myeonlog.v1'
const Ctx = createContext(null)

function load() {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null } catch { return null }
}
function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

const defaults = () => ({
  user: null,
  theme: 'light',
  fontSize: 'normal',
  alerts: { newPosting: true, dueSoon: true, weekly: false },
  students: studentsSeed,
  interviews: interviewsSeed,
  projects: projectsSeed,
  memos: {},
  ready: !FB_ENABLED,
})

const ORG = 'OO직업전문학교'
const nameFromEmail = (email = '') => (email.split('@')[0] === 'hojun' ? '이호준' : email.split('@')[0])
const ERR = {
  'auth/invalid-credential': '이메일 또는 비밀번호가 맞지 않아요',
  'auth/wrong-password': '비밀번호가 맞지 않아요',
  'auth/user-not-found': '가입되지 않은 이메일이에요',
  'auth/email-already-in-use': '이미 가입된 이메일이에요',
  'auth/invalid-email': '이메일 형식을 확인해 주세요',
  'auth/weak-password': '비밀번호가 너무 짧아요',
  'auth/too-many-requests': '잠시 후 다시 시도해 주세요',
}
const errMsg = (e) => ERR[e?.code] || `오류: ${e?.code || e?.message || e}`

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => ({ ...defaults(), ...(load() || {}), ready: !FB_ENABLED, ...(FB_ENABLED ? { user: null } : {}) }))
  const [toast, setToast] = useState('')
  const fbRef = useRef(null) // lazily loaded firebase modules

  useEffect(() => { save({ ...state, ready: undefined }) }, [state])
  useEffect(() => {
    const t = state.theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : state.theme
    document.documentElement.dataset.theme = t
    document.body.classList.toggle('fs-small', state.fontSize === 'small')
    document.body.classList.toggle('fs-large', state.fontSize === 'large')
  }, [state.theme, state.fontSize])

  const notify = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(''), 2200) }, [])
  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), [])

  // ---------- Firebase: auth + realtime sync ----------
  useEffect(() => {
    if (!FB_ENABLED) return
    let unsubs = []
    let cancelled = false
    ;(async () => {
      const [A, F] = await Promise.all([import('firebase/auth'), import('firebase/firestore')])
      if (cancelled) return
      fbRef.current = { A, F }
      unsubs.push(A.onAuthStateChanged(auth, async (u) => {
        unsubs.slice(1).forEach((f) => f()); unsubs = unsubs.slice(0, 1)
        if (!u) { patch(() => ({ user: null, ready: true })); return }
        patch(() => ({ user: { uid: u.uid, name: u.displayName || nameFromEmail(u.email), email: u.email, org: ORG } }))
        // 첫 실행이면 시드 데이터를 Firestore에 올림
        const meta = await F.getDoc(F.doc(db, 'meta', 'seed'))
        if (!meta.exists()) {
          const chunks = (arr, n = 400) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))
          for (const [col, rows] of [['students', studentsSeed], ['interviews', interviewsSeed], ['projects', projectsSeed]]) {
            for (const ch of chunks(rows)) { const b = F.writeBatch(db); ch.forEach((r) => b.set(F.doc(db, col, r.id), r)); await b.commit() }
          }
          await F.setDoc(F.doc(db, 'meta', 'seed'), { at: new Date().toISOString(), by: u.email })
        }
        const listen = (col, key, order) => unsubs.push(F.onSnapshot(F.collection(db, col), (snap) => {
          const rows = snap.docs.map((d) => d.data())
          if (order) rows.sort(order)
          patch(() => ({ [key]: rows, ready: true }))
        }, (e) => notify('동기화 오류: ' + e.code)))
        listen('students', 'students', (a, b) => a.name.localeCompare(b.name, 'ko'))
        listen('interviews', 'interviews', (a, b) => (b.when || '').localeCompare(a.when || ''))
        listen('projects', 'projects')
        unsubs.push(F.onSnapshot(F.collection(db, 'memos'), (snap) => {
          const memos = {}; snap.docs.forEach((d) => { memos[d.id] = d.data().text })
          patch(() => ({ memos }))
        }))
      }))
    })()
    return () => { cancelled = true; unsubs.forEach((f) => f()) }
  }, [patch, notify])

  const fbSet = useCallback(async (col, id, data) => {
    if (!FB_ENABLED || !fbRef.current) return
    const { F } = fbRef.current
    try { await F.setDoc(F.doc(db, col, id), data, { merge: true }) } catch (e) { notify('저장 실패: ' + e.code) }
  }, [notify])

  const api = useMemo(() => ({
    state, patch, notify,
    fbEnabled: FB_ENABLED,
    companies: companiesSeed,
    login: async (email, pw) => {
      if (!FB_ENABLED) { patch(() => ({ user: { name: nameFromEmail(email), email, org: ORG } })); return true }
      try { await fbRef.current.A.signInWithEmailAndPassword(auth, email, pw); return true } catch (e) { notify(errMsg(e)); return false }
    },
    signup: async (name, email, pw) => {
      if (!FB_ENABLED) { patch(() => ({ user: { name, email, org: ORG } })); return true }
      try {
        const { A } = fbRef.current
        const cred = await A.createUserWithEmailAndPassword(auth, email, pw)
        await A.updateProfile(cred.user, { displayName: name })
        patch((s) => ({ user: { ...(s.user || {}), name } }))
        return true
      } catch (e) { notify(errMsg(e)); return false }
    },
    resetPassword: async (email) => {
      if (!FB_ENABLED) { notify('프로토타입(로컬 모드)에서는 비밀번호가 없어요'); return }
      try { await fbRef.current.A.sendPasswordResetEmail(auth, email); notify('재설정 메일을 보냈어요') } catch (e) { notify(errMsg(e)) }
    },
    changePassword: async (pw) => {
      if (!FB_ENABLED) { notify('프로토타입(로컬 모드)에서는 비밀번호가 없어요'); return false }
      try { await fbRef.current.A.updatePassword(auth.currentUser, pw); notify('비밀번호를 바꿨어요'); return true }
      catch (e) { notify(e.code === 'auth/requires-recent-login' ? '보안을 위해 다시 로그인한 뒤 바꿔 주세요' : errMsg(e)); return false }
    },
    logout: async () => { if (FB_ENABLED) await fbRef.current.A.signOut(auth); patch(() => ({ user: null })) },
    deleteAccount: async () => {
      if (FB_ENABLED) { try { await fbRef.current.A.deleteUser(auth.currentUser) } catch (e) { notify(e.code === 'auth/requires-recent-login' ? '보안을 위해 다시 로그인한 뒤 탈퇴해 주세요' : errMsg(e)); return false } }
      localStorage.removeItem(KEY); setState(defaults()); return true
    },
    setStudentStatus: (id, status) => {
      patch((s) => ({ students: s.students.map((x) => x.id === id ? { ...x, status } : x) }))
      fbSet('students', id, { status })
    },
    setInterview: (id, data) => {
      patch((s) => ({ interviews: s.interviews.map((x) => x.id === id ? { ...x, ...data } : x) }))
      fbSet('interviews', id, data)
    },
    addQuestion: (id, q) => {
      let next
      patch((s) => ({ interviews: s.interviews.map((x) => { if (x.id !== id) return x; next = [...(x.questions || []), q]; return { ...x, questions: next } }) }))
      if (next) fbSet('interviews', id, { questions: next })
    },
    addProject: (p) => { patch((s) => ({ projects: [p, ...s.projects] })); fbSet('projects', p.id, p) },
    addAsset: (pid, kind, item) => {
      let next
      patch((s) => ({ projects: s.projects.map((p) => { if (p.id !== pid) return p; next = [item, ...(p[kind] || [])]; return { ...p, [kind]: next } }) }))
      if (next) fbSet('projects', pid, { [kind]: next })
    },
    setMemo: (key, text) => { patch((s) => ({ memos: { ...s.memos, [key]: text } })); fbSet('memos', key, { text }) },
    reset: () => { localStorage.removeItem(KEY); setState(defaults()) },
  }), [state, patch, notify, fbSet])

  return (
    <Ctx.Provider value={api}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </Ctx.Provider>
  )
}
export const useStore = () => useContext(Ctx)

export const resultBadge = (r) => ({
  '합격': 'b-green', '최종합격': 'b-green', '불합격': 'b-gray', '서류탈락': 'b-amber', '취소': 'b-gray', '대기': 'b-sky', '예정': 'b-sky',
}[r] || 'b-gray')
export const initial = (name = '') => name.trim().charAt(0) || '?'
