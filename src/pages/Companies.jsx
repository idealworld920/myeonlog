import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore, resultBadge, initial } from '../store'
import { TopBar } from '../Layout'
import { Building, Gear, Search, Filter, Chevron, FolderUp } from '../icons'

const todayLabel = () => {
  const d = new Date(); const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${w}요일 · 마지막 갱신 05:00`
}

export function CompanyRow({ c, active, interviewsCount }) {
  const gray = !c.hiring
  return (
    <Link to={`/company/${c.id}`} className="row" style={{ background: active ? '#B6E8DC' : undefined }}>
      <div className="tile" style={{ background: gray ? 'var(--line-2)' : 'var(--green-bg)' }}><Building fill="#FFFFFF" stroke={gray ? '#94A3B8' : undefined} /></div>
      <div className="body">
        <div className="ttl" style={{ color: gray ? 'var(--mute)' : undefined }}>{c.name}</div>
        <div className="sub">{gray ? `현재 공고 없음 · ${c.checkedAt.slice(5, 10)} 확인` : `${(c.desc || '').split(' — ')[0] || c.postings[0]?.title} · ${c.location}`}</div>
      </div>
      {c.dueSoon ? <span style={{ fontSize: 'calc(13px * var(--fs))', color: 'var(--red)', fontWeight: 500 }}>마감 D-2</span>
        : c.isNew ? <span className="badge b-white" style={{ fontSize: 'calc(12px * var(--fs))' }}>NEW</span>
        : c.hiring ? <span style={{ fontSize: 'calc(13px * var(--fs))', color: 'var(--mint-ink)', fontWeight: 600 }}>공고 {c.postingCount}</span> : null}
      <Chevron className="chev" />
    </Link>
  )
}

export function Home() {
  const { companies, state, interviews } = useStore()
  const [q, setQ] = useState('')
  const [f, setF] = useState('hiring')
  const list = useMemo(() => {
    let l = companies
    if (f === 'hiring') l = l.filter((c) => c.hiring)
    if (f === 'due') l = l.filter((c) => c.dueSoon)
    if (f === 'new') l = l.filter((c) => c.isNew)
    if (q) l = l.filter((c) => c.name.includes(q) || c.key.includes(q))
    return l
  }, [companies, q, f])
  const stats = { hiring: companies.filter((c) => c.hiring).length, newC: companies.filter((c) => c.isNew).length, due: companies.filter((c) => c.dueSoon).length }
  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div><div className="h-eyebrow">{todayLabel()}</div><h1 className="h1">안녕하세요, {state.user.name} 님</h1></div>
        <Link to="/settings" className="iconbtn" aria-label="환경설정"><Gear /></Link>
      </div>
      <div className="hero">
        <div className="lbl">오늘의 채용 현황</div>
        <div className="grid">
          <div><div className="k">채용중</div><div className="v">{stats.hiring}</div></div>
          <div><div className="k">새 공고</div><div className="v">{stats.newC}</div></div>
          <div><div className="k">마감 임박</div><div className="v">{stats.due}</div></div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <label className="search" style={{ flex: 1 }}><Search /><input placeholder="회사명 검색" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <button className="iconbtn" aria-label="필터"><Filter style={{ color: 'var(--sky-dark)' }} /></button>
      </div>
      <div className="chips">
        {[['hiring', '채용중만'], ['all', '전체'], ['new', '새 공고'], ['due', '마감 임박']].map(([k, l]) => (
          <button key={k} className={'chip' + (f === k ? ' on' : '')} onClick={() => setF(k)}>{l}</button>
        ))}
      </div>
      <div className="sec"><span className="t">회사 목록</span><span className="r">{list.length}곳</span></div>
      <div className="list" style={{ background: 'var(--mint)' }}>
        {list.slice(0, 60).map((c) => <CompanyRow key={c.id} c={c} />)}
        {list.length === 0 && <div className="empty">검색 결과가 없어요</div>}
        {list.length > 60 && <div className="empty" style={{ padding: 14 }}>{list.length - 60}곳 더 있음 — 검색으로 좁혀보세요</div>}
      </div>
      <Link to="/upload" className="btn sticky-actions" style={{ height: 54, justifyContent: 'center' }}><FolderUp width="22" height="22" />면접 리스트 엑셀 업로드</Link>
    </div>
  )
}

export function Company() {
  const { id } = useParams()
  const { companies, state, setMemo, notify } = useStore()
  const c = companies.find((x) => x.id === id)
  const nav = useNavigate()
  if (!c) return <div className="page"><TopBar title="회사 상세" /><div className="empty">회사를 찾을 수 없어요</div></div>
  const ivs = state.interviews.filter((i) => i.companyId === c.id)
  const sById = Object.fromEntries(state.students.map((s) => [s.id, s]))
  const qCount = ivs.reduce((n, i) => n + (i.questions?.length || 0), 0)
  const memoKey = 'c:' + c.id
  return (
    <div className="page">
      <TopBar title="회사 상세" back="/" />
      <div className="pc-cols">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="tile" style={{ width: 56, height: 56, borderRadius: 18, background: c.hiring ? 'var(--green-bg)' : 'var(--line-2)', marginBottom: 10 }}><Building fill="#FFFFFF" width="30" height="30" /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><h2 className="h2">{c.name}</h2>{c.hiring ? <span className="badge b-green">채용중</span> : <span className="badge b-gray">공고 없음</span>}</div>
            <div style={{ fontSize: 'calc(14px * var(--fs))', color: 'var(--mute)', marginTop: 4 }}>{c.industry} · {c.location}</div>
            <div style={{ fontSize: 'calc(14px * var(--fs))', color: 'var(--sky-dark)', marginTop: 2 }}>{c.contact || '인사담당자 연락처 미등록'}</div>
          </div>
          {c.desc && <div className="hero" style={{ borderRadius: 18, gap: 4, padding: '16px 18px' }}><div style={{ fontSize: 'calc(13px * var(--fs))', color: '#BAE6FD' }}>직무 한줄설명</div><div style={{ fontSize: 'calc(16px * var(--fs))', fontWeight: 500, lineHeight: 1.45 }}>{c.desc}</div></div>}
          <div className="sec"><span className="t">현재 공고</span><span className="r">사람인 · {c.checkedAt} 확인</span></div>
          <div className="list" style={{ background: 'var(--rose)' }}>
            {c.postings.map((p) => (
              <a key={p.id} href={p.link} target="_blank" rel="noreferrer" className="row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                <div style={{ fontSize: 'calc(15px * var(--fs))', fontWeight: 500, lineHeight: 1.4 }}>{p.title}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 'calc(13px * var(--fs))', color: 'var(--mute)', flexWrap: 'wrap' }}><span>접수 {p.start}</span><span>마감 {p.due}</span><span>{p.career} · {p.edu}</span><span style={{ color: 'var(--rose-ink)', fontWeight: 600 }}>사람인 ↗</span></div>
              </a>
            ))}
            {c.postings.length === 0 && <div className="empty">지금은 올라온 공고가 없어요</div>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sec"><span className="t">이 회사에 면접 본 수강생</span><span className="r">{ivs.length}명 · 기록된 질문 {qCount}개</span></div>
          <div className="list" style={{ background: 'var(--yellow)' }}>
            {ivs.map((i) => { const s = sById[i.studentId]; return (
              <Link key={i.id} to={`/interview/${i.id}`} className="row">
                <div className="avatar" style={{ background: '#FDE68A', color: '#92400E' }}>{initial(s?.name)}</div>
                <div className="body"><div className="ttl">{s?.name || '미상'}</div><div className="sub">{i.when || '일시 미정'} · {i.questions?.length ? `질문 ${i.questions.length}개 기록` : '질문 없음'}</div></div>
                <span className={'badge ' + resultBadge(i.result)}>{i.result}</span>
              </Link>
            ) })}
            {ivs.length === 0 && <div className="empty">아직 면접 기록이 없어요</div>}
          </div>
          <div className="sec"><span className="t">담당자 메모</span><span className="r">담당자만 봄</span></div>
          <div className="field"><textarea rows={3} placeholder="이 회사에 대해 기억할 것" defaultValue={state.memos[memoKey] || ''} onBlur={(e) => { setMemo(memoKey, e.target.value); notify('메모 저장됨') }} /></div>
          <div className="sticky-actions">
            <button className="btn ghost" style={{ flex: 1 }} onClick={() => nav('/students')}>수강생 추천</button>
          </div>
        </div>
      </div>
    </div>
  )
}
