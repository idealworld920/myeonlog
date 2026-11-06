import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore, resultBadge, initial } from '../store'
import { TopBar } from '../Layout'
import { Search, Doc, Building, Download, Chevron, Check, Plus } from '../icons'

const STATUS = ['구직중', '취업', '보류']

export function Students() {
  const { state, companies } = useStore()
  const [q, setQ] = useState('')
  const cById = Object.fromEntries(companies.map((c) => [c.id, c]))
  const list = useMemo(() => {
    const l = q ? state.students.filter((s) => s.name.includes(q)) : state.students
    return l.slice(0, 40)
  }, [state.students, q])
  const count = (sid) => state.interviews.filter((i) => i.studentId === sid).length
  return (
    <div className="page">
      <div><div className="h-eyebrow">수강생</div><h1 className="h1">이름으로 찾기</h1></div>
      <label className="search" style={{ borderColor: 'var(--sky)', borderWidth: 1.5 }}><Search style={{ color: 'var(--sky-dark)' }} /><input autoFocus placeholder="수강생 이름" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      <div className="sec"><span className="t">{q ? '검색 결과' : '수강생'}</span><span className="r">{q ? list.length : state.students.length}명</span></div>
      <div className="list" style={{ background: 'var(--card-bg)' }}>
        {list.map((s) => (
          <Link key={s.id} to={`/student/${s.id}`} className="row" style={{ borderBottomColor: 'var(--line-2)' }}>
            <div className="avatar" style={{ background: 'var(--sky)', color: '#fff' }}>{initial(s.name)}</div>
            <div className="body"><div className="ttl">{s.name}</div><div className="sub">{s.cohort} · 면접 {count(s.id)}회{s.employedAt ? ` · ${cById[s.employedAt]?.name}` : ''}</div></div>
            <span className={'badge ' + (s.status === '취업' ? 'b-green' : s.status === '보류' ? 'b-amber' : 'b-gray')}>{s.status}</span>
            <Chevron className="chev" />
          </Link>
        ))}
        {list.length === 0 && <div className="empty">"{q}" 이름의 수강생이 없어요</div>}
      </div>
    </div>
  )
}

export function Student() {
  const { id } = useParams()
  const { state, companies, setStudentStatus, notify } = useStore()
  const s = state.students.find((x) => x.id === id)
  if (!s) return <div className="page"><TopBar title="수강생" /><div className="empty">수강생을 찾을 수 없어요</div></div>
  const cById = Object.fromEntries(companies.map((c) => [c.id, c]))
  const ivs = state.interviews.filter((i) => i.studentId === s.id)
  const passed = ivs.filter((i) => i.result === '합격').length
  const employed = ivs.find((i) => i.result === '합격')
  const projects = state.projects.filter((p) => p.members.some((m) => m.studentId === s.id))
  return (
    <div className="page">
      <TopBar title="수강생" back="/students" />
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="avatar" style={{ width: 48, height: 48, fontSize: 18, background: 'var(--sky)', color: '#fff' }}>{initial(s.name)}</div>
          <div><div style={{ fontSize: 18, fontWeight: 700 }}>{s.name}</div><div style={{ fontSize: 13, color: 'var(--mute)' }}>{s.cohort} · 면접 {ivs.length}회 · 합격 {passed}</div></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid var(--line-2)' }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, color: 'var(--mute)' }}>취업 여부</div><div style={{ fontSize: 12, color: 'var(--mute-2)' }}>{s.status === '취업' && employed ? `${cById[employed.companyId]?.name} · ${employed.when}` : '담당자가 직접 바꿀 수 있어요'}</div></div>
          <div className="seg" role="group" aria-label="취업 여부">
            {STATUS.map((st) => <button key={st} className={s.status === st ? (st === '취업' ? 'on-green' : 'on') : ''} onClick={() => { setStudentStatus(s.id, st); notify(`${s.name} · ${st}`) }}>{st}</button>)}
          </div>
        </div>
      </div>
      <div className="pc-cols">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sec"><span className="t">이력서</span><button className="btn sm tint" style={{ color: 'var(--pink-ink)', borderColor: 'var(--pink-line)' }} onClick={() => notify('프로토타입: 파일 업로드는 Firebase 연결 후')}>+ 업로드</button></div>
          <div className="list" style={{ background: 'var(--pink)' }}>
            {(s.resumes.length ? s.resumes : [{ name: `${s.name}_이력서_v1.pdf`, date: '등록 예정', latest: true }]).map((r, i) => (
              <a key={i} href="#resume" className="row">
                <div className="tile" style={{ background: i === 0 ? '#FEF9C3' : 'var(--line-2)' }}><Doc fill="#FFFFFF" /></div>
                <div className="body"><div className="ttl">{r.name}</div><div className="sub">{r.date}{i === 0 ? ' · 최신' : ''}</div></div>
                <Download width="18" height="18" color="var(--pink-ink)" />
              </a>
            ))}
          </div>
          {projects.length > 0 && <>
            <div className="sec"><span className="t">참여 프로젝트</span><span className="r">{projects.length}개</span></div>
            <div className="list" style={{ background: 'var(--blue)' }}>
              {projects.map((p) => (
                <Link key={p.id} to={`/project/${p.id}`} className="row">
                  <div className="body"><div className="ttl">{p.title}</div><div className="sub">{p.members.find((m) => m.studentId === s.id)?.role} · {p.period}</div></div>
                  <span className="badge" style={{ background: 'var(--card-bg)', color: p.type === 'team' ? 'var(--blue-ink)' : 'var(--pink-ink)', fontWeight: 700 }}>{p.type === 'team' ? '팀' : '개인'}</span>
                  <Chevron className="chev" />
                </Link>
              ))}
            </div>
          </>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sec"><span className="t">면접 이력</span><span className="r">최근순</span></div>
          <div className="list" style={{ background: 'var(--lav)' }}>
            {ivs.map((i) => { const c = cById[i.companyId]; return (
              <Link key={i.id} to={`/interview/${i.id}`} className="row">
                <div className="tile" style={{ background: c?.hiring ? 'var(--green-bg)' : 'var(--line-2)' }}><Building fill="#FFFFFF" /></div>
                <div className="body"><div className="ttl">{c?.name}</div><div className="sub">{i.when || '일시 미정'} · {i.questions?.length ? `질문 ${i.questions.length}개 기록` : '질문 없음'}</div></div>
                <span className={'badge ' + resultBadge(i.result)}>{i.result}</span>
              </Link>
            ) })}
            {ivs.length === 0 && <div className="empty">면접 기록이 없어요</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

const TAGS = ['인성', '기술', '프로젝트', '근무조건']
export function Interview() {
  const { id } = useParams()
  const { state, companies, setInterview, addQuestion, notify } = useStore()
  const nav = useNavigate()
  const iv = state.interviews.find((x) => x.id === id)
  const [q, setQ] = useState(''); const [tag, setTag] = useState('기술')
  if (!iv) return <div className="page"><TopBar title="면접 기록" /><div className="empty">기록을 찾을 수 없어요</div></div>
  const s = state.students.find((x) => x.id === iv.studentId); const c = companies.find((x) => x.id === iv.companyId)
  const add = () => { if (!q.trim()) return; addQuestion(iv.id, { text: q.trim(), tag }); setQ(''); notify('질문 추가됨') }
  return (
    <div className="page">
      <TopBar title="면접 기록" />
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar" style={{ width: 42, height: 42, background: '#FDE68A', color: '#92400E' }}>{initial(s?.name)}</div>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 17, fontWeight: 700 }}>{s?.name} → {c?.name}</div><div style={{ fontSize: 13, color: 'var(--mute)' }}>{iv.when || '일시 미정'}{c?.desc ? ` · ${c.desc.split(' — ')[0]}` : ''}</div></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid var(--line-2)' }}>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--mute)' }}>면접 결과</div>
          <div className="seg" role="group">
            {['대기', '합격', '불합격'].map((r) => <button key={r} className={iv.result === r ? (r === '합격' ? 'on-green' : 'on') : ''} onClick={() => { setInterview(iv.id, { result: r }); if (r === '합격') notify('합격! 수강생 취업 여부도 바꿀까요? (수강생 화면)') }}>{r}</button>)}
          </div>
        </div>
      </div>
      <div className="sec"><span className="t">면접 질문</span><span className="r">{iv.questions?.length || 0}개 · 수강생 보고 기준</span></div>
      <div className="list" style={{ background: 'var(--yellow)' }}>
        {(iv.questions || []).map((x, i) => (
          <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
            <div className="avatar" style={{ width: 26, height: 26, fontSize: 12, background: 'var(--card-bg)', color: '#92400E' }}>{i + 1}</div>
            <div className="body"><div style={{ fontSize: 14, lineHeight: 1.45 }}>{x.text}</div><div><span style={{ fontSize: 11, color: 'var(--mute)', background: 'var(--card-bg)', borderRadius: 8, padding: '2px 7px' }}>{x.tag}</span></div></div>
          </div>
        ))}
        {!(iv.questions || []).length && <div className="empty">아직 기록된 질문이 없어요 — 아래에서 추가해 보세요</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="질문 추가 (예: 포트폴리오 설명)" style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid var(--yellow-line)', background: 'var(--card-bg)', padding: '0 14px', fontSize: 14, outline: 0, minWidth: 0 }} />
        <select value={tag} onChange={(e) => setTag(e.target.value)} style={{ height: 44, borderRadius: 12, border: '1px solid var(--yellow-line)', background: 'var(--card-bg)', padding: '0 8px', fontSize: 13 }}>{TAGS.map((t) => <option key={t}>{t}</option>)}</select>
        <button className="btn sm" style={{ height: 44, background: 'var(--amber)', borderRadius: 12 }} onClick={add}>추가</button>
      </div>
      <div className="sec"><span className="t">면접 후기 · 메모</span><span className="r">담당자만 봄</span></div>
      <div className="field"><textarea rows={3} placeholder="분위기, 면접관 수, 다음 지원자에게 알려줄 것" defaultValue={iv.memo} onBlur={(e) => { setInterview(iv.id, { memo: e.target.value }); notify('메모 저장됨') }} /></div>
      <div className="sticky-actions">
        <button className="btn ghost" style={{ flex: 1 }} onClick={() => nav(`/company/${c?.id}`)}>회사로</button>
        <button className="btn ghost" style={{ flex: 1 }} onClick={() => nav(`/student/${s?.id}`)}>수강생으로</button>
      </div>
    </div>
  )
}
