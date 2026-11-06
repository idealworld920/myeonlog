import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import companiesSeed from './data/companies.json'
import interviewsSeed from './data/interviews.json'
import studentsSeed from './data/students.json'
import projectsSeed from './data/projects.json'

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
})

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => ({ ...defaults(), ...(load() || {}) }))
  const [toast, setToast] = useState('')

  useEffect(() => { save(state) }, [state])
  useEffect(() => {
    const t = state.theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : state.theme
    document.documentElement.dataset.theme = t
    document.body.classList.toggle('fs-small', state.fontSize === 'small')
    document.body.classList.toggle('fs-large', state.fontSize === 'large')
  }, [state.theme, state.fontSize])

  const notify = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(''), 1800) }, [])
  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), [])

  const api = useMemo(() => ({
    state, patch, notify,
    companies: companiesSeed,
    login: (email) => patch(() => ({ user: { name: email.split('@')[0] === 'hojun' ? '이호준' : email.split('@')[0], email, org: 'OO직업전문학교' } })),
    logout: () => patch(() => ({ user: null })),
    setStudentStatus: (id, status) => patch((s) => ({ students: s.students.map((x) => x.id === id ? { ...x, status } : x) })),
    setInterview: (id, data) => patch((s) => ({ interviews: s.interviews.map((x) => x.id === id ? { ...x, ...data } : x) })),
    addQuestion: (id, q) => patch((s) => ({ interviews: s.interviews.map((x) => x.id === id ? { ...x, questions: [...(x.questions || []), q] } : x) })),
    addProject: (p) => patch((s) => ({ projects: [p, ...s.projects] })),
    addAsset: (pid, kind, item) => patch((s) => ({ projects: s.projects.map((p) => p.id === pid ? { ...p, [kind]: [item, ...(p[kind] || [])] } : p) })),
    setMemo: (key, text) => patch((s) => ({ memos: { ...s.memos, [key]: text } })),
    reset: () => { localStorage.removeItem(KEY); setState(defaults()) },
  }), [state, patch, notify])

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
