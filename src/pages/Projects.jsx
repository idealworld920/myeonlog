import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore, initial } from '../store'
import { TopBar } from '../Layout'
import { Search, Team, Person, Doc, Slides, Globe, Code, Arch, Video, Chevron, Download, Play, Lock, Plus } from '../icons'

const has = (p) => ({ plan: p.plans?.length > 0, deploy: !!p.deploy || p.deployDocs?.length > 0, video: p.videos?.length > 0 })
const Chip = ({ ok, label }) => <span className={'badge ' + (ok ? 'b-green' : 'b-amber')} style={{ fontSize: 12 }}>{ok ? `✓ ${label}` : `${label} 없음`}</span>
const TypeBadge = ({ type }) => <span className="badge" style={{ fontSize: 11, fontWeight: 700, background: 'var(--card-bg)', color: type === 'team' ? 'var(--blue-ink)' : 'var(--pink-ink)' }}>{type === 'team' ? '팀' : '개인'}</span>

export function Projects() {
  const { state } = useStore()
  const [q, setQ] = useState(''); const [f, setF] = useState('all')
  const sById = Object.fromEntries(state.students.map((s) => [s.id, s]))
  const list = useMemo(() => state.projects.filter((p) => {
    if (f === 'team' && p.type !== 'team') return false
    if (f === 'solo' && p.type !== 'solo') return false
    if (f === 'missing') { const h = has(p); if (h.plan && h.deploy && h.video) return false }
    if (q) { const names = p.members.map((m) => sById[m.studentId]?.name || '').join(' '); if (!p.title.includes(q) && !names.includes(q)) return false }
    return true
  }), [state.projects, q, f, sById])
  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div><div className="h-eyebrow">프로젝트</div><h1 className="h1">수강생 프로젝트</h1></div>
        <Link to="/project/new" className="btn sm" style={{ height: 40, gap: 6 }}><Plus width="16" height="16" />등록</Link>
      </div>
      <label className="search"><Search /><input placeholder="프로젝트명 · 수강생 이름 검색" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      <div className="chips">{[['all', '전체'], ['team', '팀'], ['solo', '개인'], ['missing', '자료 미완']].map(([k, l]) => <button key={k} className={'chip' + (f === k ? ' on' : '')} onClick={() => setF(k)}>{l}</button>)}</div>
      <div className="sec"><span className="t">2기 프로젝트</span><span className="r">{list.length}개 · 최근 업로드순</span></div>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {list.map((p) => { const h = has(p); return (
          <Link key={p.id} to={`/project/${p.id}`} className="list" style={{ background: p.type === 'team' ? 'var(--blue)' : 'var(--pink)', padding: '14px 16px', gap: 10, color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="tile" style={{ background: 'var(--card-bg)' }}>{p.type === 'team' ? <Team /> : <Person fill="#F8E6F6" />}</div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 16, fontWeight: 700 }}>{p.title}</div><div style={{ fontSize: 13, color: 'var(--mute)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.members.map((m) => sById[m.studentId]?.name).filter(Boolean).join(' · ')} · {p.period}</div></div>
              <TypeBadge type={p.type} />
            </div>
            <div className="chips" style={{ gap: 6 }}><Chip ok={h.plan} label="기획서" /><Chip ok={h.deploy} label="배포 자료" /><Chip ok={h.video} label="시연영상" />{p.stack?.length > 0 && <span className="badge" style={{ background: 'var(--card-bg)', color: 'var(--mute)', fontSize: 12 }}>{p.stack.slice(0, 3).join(' · ')}</span>}</div>
          </Link>
        ) })}
        {list.length === 0 && <div className="empty card">조건에 맞는 프로젝트가 없어요</div>}
      </div>
    </div>
  )
}

function useProject() {
  const { id } = useParams(); const { state, companies } = useStore()
  const p = state.projects.find((x) => x.id === id)
  const sById = Object.fromEntries(state.students.map((s) => [s.id, s]))
  return { p, sById, companies }
}
const Header = ({ p, title }) => (
  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, color: 'var(--mute)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div><div style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>{title}</div></div>
)
const Internal = () => <span className="badge b-amber" style={{ fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Lock width="10" height="10" stroke="#B45309" />내부용</span>

export function Project() {
  const { p, sById } = useProject(); const nav = useNavigate(); const { notify } = useStore()
  if (!p) return <div className="page"><TopBar title="프로젝트" /><div className="empty">프로젝트를 찾을 수 없어요</div></div>
  const h = has(p)
  const Card = ({ to, bg, Icon, iconFill, title, sub, ok, extra }) => (
    <Link to={to} className="row" style={{ background: bg, borderRadius: 18, border: '1px solid var(--sky-100)', color: 'inherit' }}>
      <div className="tile" style={{ width: 46, height: 46, background: 'var(--card-bg)' }}><Icon fill={iconFill} width="26" height="26" /></div>
      <div className="body"><div className="ttl" style={{ fontSize: 16, fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}>{title}{extra}</div><div className="sub">{sub}</div></div>
      <span className={'badge ' + (ok ? 'b-green' : 'b-amber')} style={{ fontSize: 11, fontWeight: 600 }}>{ok ? '완료' : '미등록'}</span><Chevron className="chev" />
    </Link>
  )
  return (
    <div className="page">
      <TopBar title="프로젝트" back="/projects" right={<button className="btn sm ghost" onClick={() => notify('프로토타입: 편집은 다음 단계')}>편집</button>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><span className="badge" style={{ fontSize: 11, fontWeight: 700, background: p.type === 'team' ? 'var(--blue)' : 'var(--pink)', color: p.type === 'team' ? 'var(--blue-ink)' : 'var(--pink-ink)' }}>{p.type === 'team' ? '팀 프로젝트' : '개인 프로젝트'}</span><span style={{ fontSize: 12, color: 'var(--mute)' }}>{p.period} · {p.cohort}</span></div>
        <h2 className="h2">{p.title}</h2>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 }}>{p.summary}</div>
        <div className="chips" style={{ gap: 6 }}>{p.stack.map((s) => <span key={s} style={{ fontSize: 12, color: 'var(--sky-dark)', background: 'var(--card-bg)', border: '1px solid var(--sky-200)', borderRadius: 8, padding: '3px 9px' }}>{s}</span>)}</div>
      </div>
      <div className="pc-cols">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sec"><span className="t">팀원 · 역할</span><span className="r">{p.members.length}명</span></div>
          <div className="list" style={{ background: 'var(--blue)' }}>
            {p.members.map((m) => { const s = sById[m.studentId]; return (
              <Link key={m.studentId} to={`/student/${m.studentId}`} className="row" style={{ minHeight: 50 }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: 'var(--card-bg)', color: 'var(--blue-ink)' }}>{initial(s?.name)}</div>
                <div className="body"><div className="ttl" style={{ fontSize: 14 }}>{s?.name}</div><div className="sub" style={{ fontSize: 12 }}>{m.role}</div></div>
                <span className={'badge ' + (s?.status === '취업' ? 'b-green' : 'b-gray')} style={{ fontSize: 11 }}>{s?.status}</span>
              </Link>
            ) })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="sec"><span className="t">프로젝트 자료</span><span className="r">{[h.plan, h.deploy, h.video].filter(Boolean).length}/3 등록</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Card to={`/project/${p.id}/plan`} bg="var(--yellow)" Icon={Doc} iconFill="#FEF9C3" title="기획서" ok={h.plan} sub={h.plan ? `파일 ${p.plans.length}개 · 최근 ${p.plans[0].date} · ${sById[p.plans[0].by]?.name || ''}` : '아직 올라온 파일이 없어요'} />
            <Card to={`/project/${p.id}/deploy`} bg="var(--mint)" Icon={Globe} iconFill="#DDF5F0" title="배포 자료" ok={h.deploy} sub={p.deploy ? `배포 주소 ${p.deploy.status} · 저장소 · 가이드 ${p.deployDocs.length}개` : '배포 주소·저장소를 등록하세요'} />
            <Card to={`/project/${p.id}/video`} bg="var(--lav)" Icon={Video} iconFill="#EDE7FB" title="시연영상" extra={<Internal />} ok={h.video} sub={h.video ? `영상 ${p.videos.length}개 · ${p.videos[0].length} · ${p.videos[0].date} · ${sById[p.videos[0].by]?.name || ''}` : '시연영상을 올려두면 면접 준비에 써요'} />
          </div>
          <div className="sticky-actions"><button className="btn ghost" style={{ flex: 1 }} onClick={() => nav('/projects')}>목록으로</button><button className="btn" style={{ flex: 1.4 }} onClick={() => notify('면접 기록에서 첨부할 수 있어요 (다음 단계)')}>면접에 첨부</button></div>
        </div>
      </div>
    </div>
  )
}

const FileRow = ({ f, by, color, Icon }) => (
  <a href="#file" className="row">
    <div className="tile" style={{ background: 'var(--card-bg)' }}><Icon fill="#FEF9C3" /></div>
    <div className="body"><div className="ttl" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div><div className="sub">{f.meta} · {f.date} · {by}</div></div>
    <Download width="18" height="18" color={color} />
  </a>
)

export function ProjectPlan() {
  const { p, sById } = useProject(); const { addAsset, notify } = useStore(); const nav = useNavigate()
  if (!p) return null
  const upload = () => { addAsset(p.id, 'plans', { id: 'f' + Date.now(), name: `${p.title}_기획서_v${(p.plans.length || 0) + 1}.pdf`, meta: '업로드 예정', date: new Date().toISOString().slice(0, 10).replaceAll('-', '.'), by: p.members[0].studentId }); notify('프로토타입: 파일명만 등록됨') }
  return (
    <div className="page">
      <div className="topbar"><TopBar title="" back={`/project/${p.id}`} /><Header p={p} title="기획서" /><button className="btn sm" style={{ background: 'var(--amber)' }} onClick={upload}>+ 업로드</button></div>
      {p.planSummary && <div className="card" style={{ background: 'var(--yellow)', padding: '14px 16px' }}><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--mute)', marginBottom: 6 }}>한 줄 요약</div><div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)' }}>{p.planSummary}</div></div>}
      <div className="sec"><span className="t">파일</span><span className="r">{p.plans.length}개 · 최신순</span></div>
      <div className="list" style={{ background: 'var(--yellow)' }}>
        {p.plans.map((f) => <FileRow key={f.id} f={f} by={sById[f.by]?.name || ''} color="var(--yellow-ink)" Icon={f.name.endsWith('.pptx') ? Slides : Doc} />)}
        {p.plans.length === 0 && <div className="empty">아직 올라온 기획서가 없어요</div>}
      </div>
      <div className="note">PDF · PPT · 한글 · 워드, 파일당 50MB까지. 올린 사람과 날짜가 자동 기록되고, 같은 이름은 새 버전으로 쌓여요.</div>
      <div className="sticky-actions"><button className="btn ghost" style={{ flex: 1 }} onClick={() => nav(`/project/${p.id}`)}>프로젝트로</button><button className="btn" style={{ flex: 1 }} onClick={() => nav(`/project/${p.id}/deploy`)}>배포 자료 →</button></div>
    </div>
  )
}

export function ProjectDeploy() {
  const { p, sById } = useProject(); const { notify } = useStore(); const nav = useNavigate()
  if (!p) return null
  const d = p.deploy
  return (
    <div className="page">
      <div className="topbar"><TopBar title="" back={`/project/${p.id}`} /><Header p={p} title="배포 자료" /><button className="btn sm" style={{ background: '#0D9488' }} onClick={() => notify('프로토타입: 주소 등록은 다음 단계')}>+ 추가</button></div>
      {d ? (
        <div className="card" style={{ background: 'var(--mint)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mute)' }}>배포 주소</span><span className="badge b-green" style={{ fontSize: 11, fontWeight: 600 }}>● {d.status} · 오늘 05:00 확인</span></div>
          <a href={d.url} target="_blank" rel="noreferrer" style={{ fontSize: 17, fontWeight: 700, color: 'var(--mint-ink)', wordBreak: 'break-all' }}>{d.url.replace('https://', '')} ↗</a>
          <div style={{ display: 'flex', gap: 8 }}><button className="btn sm tint" style={{ flex: 1, color: 'var(--mint-ink)', borderColor: 'var(--mint-line)' }} onClick={() => { navigator.clipboard?.writeText(d.url); notify('주소 복사됨') }}>주소 복사</button><button className="btn sm tint" style={{ flex: 1, color: 'var(--mint-ink)', borderColor: 'var(--mint-line)' }} onClick={() => notify('테스트 계정: demo / demo1234!')}>테스트 계정 보기</button></div>
        </div>
      ) : <div className="card empty">배포 주소가 아직 없어요</div>}
      <div className="sec"><span className="t">저장소 · 문서</span><span className="r">{(d ? 1 : 0) + p.deployDocs.length}개</span></div>
      <div className="list" style={{ background: 'var(--mint)' }}>
        {d?.repo && <a href={d.repo} target="_blank" rel="noreferrer" className="row"><div className="tile" style={{ background: 'var(--card-bg)' }}><Code /></div><div className="body"><div className="ttl">GitHub 저장소</div><div className="sub">{d.repo.replace('https://', '')} · 커밋 {d.commits}</div></div><span style={{ fontSize: 12, color: 'var(--mint-ink)', fontWeight: 600 }}>열기 ↗</span></a>}
        {p.deployDocs.map((f) => <FileRow key={f.id} f={f} by={sById[f.by]?.name || ''} color="var(--mint-ink)" Icon={Arch} />)}
        {!d?.repo && p.deployDocs.length === 0 && <div className="empty">저장소·문서가 없어요</div>}
      </div>
      {d?.env && <>
        <div className="sec"><span className="t">배포 환경</span></div>
        <div className="card" style={{ padding: '4px 16px' }}>{d.env.map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--line-2)', fontSize: 14 }}><span style={{ color: 'var(--mute)' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span></div>)}</div>
      </>}
      <div className="note">배포 주소는 앱이 하루 1번 접속해 "운영 중 / 접속 안 됨"을 표시해요. 접속 안 되면 팀원에게 알림.</div>
      <div className="sticky-actions"><button className="btn ghost" style={{ flex: 1 }} onClick={() => nav(`/project/${p.id}/plan`)}>← 기획서</button><button className="btn" style={{ flex: 1 }} onClick={() => nav(`/project/${p.id}/video`)}>시연영상 →</button></div>
    </div>
  )
}

export function ProjectVideo() {
  const { p, sById } = useProject(); const { notify } = useStore(); const nav = useNavigate()
  if (!p) return null
  const v = p.videos[0]
  return (
    <div className="page">
      <div className="topbar"><TopBar title="" back={`/project/${p.id}`} /><Header p={p} title={<>시연영상 <Internal /></>} /><button className="btn sm" style={{ background: '#7C3AED' }} onClick={() => notify('프로토타입: 영상 업로드는 다음 단계')}>+ 업로드</button></div>
      {v ? (
        <div className="list" style={{ background: 'var(--lav)' }}>
          <div className="video"><span className="tag">{v.name} · {v.length}</span><button className="play" aria-label="재생" onClick={() => notify('프로토타입: 영상 파일 연결 전')}><Play width="28" height="28" color="#fff" /></button><div className="bar"><i /></div></div>
          <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--mute)', lineHeight: 1.5 }}>{v.date} · {sById[v.by]?.name} 업로드 · 기관 담당자와 팀원만 재생돼요</div>
        </div>
      ) : <div className="card empty">시연영상이 아직 없어요</div>}
      {v?.chapters && <>
        <div className="sec"><span className="t">구간</span><button className="btn sm" style={{ background: 'transparent', color: 'var(--lav-ink)', padding: 0, height: 'auto' }} onClick={() => notify('프로토타입')}>+ 구간 추가</button></div>
        <div className="list" style={{ background: 'var(--lav)' }}>{v.chapters.map(([t, l], i) => <a key={i} href="#ch" className="row" style={{ minHeight: 48 }}><span style={{ fontSize: 12, color: 'var(--lav-ink)', fontWeight: 700, width: 36 }}>{t}</span><div className="body"><div className="ttl" style={{ fontSize: 14 }}>{l}</div></div>{i === 0 && <Play width="16" height="16" color="var(--lav-ink)" />}</a>)}</div>
      </>}
      <div className="sec"><span className="t">외부 공유</span><span className="r">담당자 승인 필요</span></div>
      <div className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>면접 때 회사에 보여줄 일이 있으면 <b>7일짜리 링크</b>를 만들어요. 만든 링크는 여기서 언제든 끌 수 있어요.</div>
        {p.shares.map((s) => <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--page-bg)' }}><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div><div style={{ fontSize: 12, color: 'var(--mute)' }}>{s.until}까지 · 조회 {s.views}회</div></div><button className="btn sm tint" style={{ height: 30, color: 'var(--red-ink)', borderColor: '#FECACA' }} onClick={() => notify('링크 꺼짐 (프로토타입)')}>끄기</button></div>)}
        <button className="btn sm tint" style={{ height: 42, color: 'var(--lav-ink)', borderColor: 'var(--lav-line)' }} onClick={() => notify('담당자 승인 요청 보냄 (프로토타입)')}>새 공유 링크 요청</button>
      </div>
      <div className="sticky-actions"><button className="btn ghost" style={{ flex: 1 }} onClick={() => nav(`/project/${p.id}/deploy`)}>← 배포 자료</button><button className="btn" style={{ flex: 1 }} onClick={() => nav(`/project/${p.id}`)}>프로젝트로</button></div>
    </div>
  )
}

export function ProjectNew() {
  const { state, addProject, notify } = useStore(); const nav = useNavigate()
  const [title, setTitle] = useState(''); const [type, setType] = useState('team'); const [summary, setSummary] = useState(''); const [stack, setStack] = useState(''); const [members, setMembers] = useState('')
  const submit = (e) => {
    e.preventDefault(); if (!title) return
    const names = members.split(/[,\s·]+/).filter(Boolean)
    const ms = names.map((n) => state.students.find((s) => s.name === n)).filter(Boolean).map((s, i) => ({ studentId: s.id, role: i === 0 ? '팀장' : '팀원' }))
    const p = { id: 'pj' + Date.now(), title, type, cohort: '2기', period: new Date().getFullYear() + '.' + String(new Date().getMonth() + 1).padStart(2, '0'), summary, stack: stack.split(/[,\s·]+/).filter(Boolean), members: ms, plans: [], planSummary: '', deploy: null, deployDocs: [], videos: [], shares: [] }
    addProject(p); notify('프로젝트 등록됨'); nav(`/project/${p.id}`)
  }
  return (
    <div className="page">
      <TopBar title="프로젝트 등록" back="/projects" />
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="field"><label>프로젝트명</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 헬스장 예약 관리 시스템" /></div>
        <div className="field"><label>구분</label><div className="seg" style={{ alignSelf: 'flex-start' }}><button type="button" className={type === 'team' ? 'on' : ''} onClick={() => setType('team')}>팀</button><button type="button" className={type === 'solo' ? 'on' : ''} onClick={() => setType('solo')}>개인</button></div></div>
        <div className="field"><label>참여 수강생 (이름, 쉼표로)</label><input value={members} onChange={(e) => setMembers(e.target.value)} placeholder={state.students.slice(0, 2).map((s) => s.name).join(', ')} /></div>
        <div className="field"><label>한 줄 설명</label><textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
        <div className="field"><label>기술 스택 (쉼표로)</label><input value={stack} onChange={(e) => setStack(e.target.value)} placeholder="Spring Boot, React, MySQL" /></div>
        <button className="btn" type="submit" style={{ height: 54 }}>등록하고 자료 올리기</button>
      </form>
    </div>
  )
}
