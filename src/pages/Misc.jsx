import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, initial } from '../store'
import { TopBar } from '../Layout'
import { Doc, Lock, Building, Moon, Lines, Logout, UserX, Chevron } from '../icons'

export function Upload() {
  const { notify } = useStore(); const nav = useNavigate()
  const [file, setFile] = useState(null)
  const preview = file ? { companies: 12, interviews: 38, students: 5, skipped: 714 } : null
  return (
    <div className="page">
      <TopBar title="엑셀 업로드" back="/" />
      <label className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div className="tile" style={{ background: 'var(--green-bg)' }}><Doc fill="#FFFFFF" /></div>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 'calc(15px * var(--fs))', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file ? file.name : '면접 리스트 엑셀 선택'}</div><div style={{ fontSize: 'calc(13px * var(--fs))', color: 'var(--mute)' }}>{file ? '첫 번째 시트 · 764행 읽음' : '지금 쓰는 엑셀 그대로, 양식 안 바꿔도 돼요'}</div></div>
        <span style={{ fontSize: 'calc(13px * var(--fs))', color: 'var(--sky-dark)', fontWeight: 500 }}>{file ? '변경' : '선택'}</span>
        <input type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>
      {preview ? <>
        <div className="hero" style={{ borderRadius: 18 }}>
          <div className="lbl">반영될 내용</div>
          <div className="grid"><div><div className="k">새 회사</div><div className="v" style={{ fontSize: 'calc(30px * var(--fs))' }}>{preview.companies}</div></div><div><div className="k">새 면접기록</div><div className="v" style={{ fontSize: 'calc(30px * var(--fs))' }}>{preview.interviews}</div></div><div><div className="k">새 수강생</div><div className="v" style={{ fontSize: 'calc(30px * var(--fs))' }}>{preview.students}</div></div></div>
          <div style={{ fontSize: 'calc(13px * var(--fs))', color: '#BAE6FD' }}>이미 있는 {preview.skipped}건은 건너뜁니다 · 삭제되는 항목 없음</div>
        </div>
        <div className="sec"><span className="t">새로 추가될 회사</span><span className="r">12곳 중 4곳 표시</span></div>
        <div className="list" style={{ background: 'var(--card-bg)' }}>
          {[['㈜케이엑스넥스지', '10.27'], ['㈜뉴로코어', '10.27'], ['㈜엔플럭스', '10.23']].map(([n, d]) => <div key={n} className="row" style={{ borderBottomColor: 'var(--line-2)' }}><span className="badge b-sky" style={{ fontSize: 'calc(11px * var(--fs))', fontWeight: 700 }}>NEW</span><div className="body"><div className="ttl">{n}</div></div><span style={{ fontSize: 'calc(13px * var(--fs))', color: 'var(--mute)' }}>{d}</span></div>)}
          <div className="row" style={{ borderBottomColor: 'var(--line-2)' }}><span className="badge b-amber" style={{ fontSize: 'calc(11px * var(--fs))', fontWeight: 700 }}>확인</span><div className="body"><div className="ttl">㈜웨인테크놀로지</div><div className="sub" style={{ color: 'var(--amber-ink)' }}>기존 "(주)웨인테크놀로지"와 같은 회사로 합칠게요</div></div></div>
        </div>
        <div className="note">같은 회사명이 (주)·㈜ 표기만 다를 때는 자동으로 하나로 합칩니다. 반영 후에도 회사 상세에서 수정할 수 있어요.</div>
        <div className="sticky-actions"><button className="btn ghost" style={{ flex: 1 }} onClick={() => setFile(null)}>취소</button><button className="btn" style={{ flex: 2 }} onClick={() => { notify('프로토타입: 실제 반영은 Firebase 연결 후'); nav('/') }}>55건 반영하기</button></div>
      </> : <div className="note">업로드하면 반영 전에 미리보기를 보여드려요. 프로토타입에서는 파일을 읽지 않고 예시 숫자를 보여줍니다.</div>}
    </div>
  )
}

const Row = ({ Icon, bg, title, sub, right, onClick, danger }) => (
  <button type="button" onClick={onClick} className="row" style={{ background: 'transparent', border: 0, width: '100%', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,.7)' }}>
    <div className="tile" style={{ width: 38, height: 38, borderRadius: 12, background: bg }}><Icon /></div>
    <div className="body"><div className="ttl" style={{ color: danger ? 'var(--red-ink)' : undefined }}>{title}</div>{sub && <div className="sub">{sub}</div>}</div>
    {right || <Chevron className="chev" />}
  </button>
)

export function Settings() {
  const { state, patch, logout, notify, changePassword, deleteAccount, fbEnabled } = useStore(); const nav = useNavigate()
  const [pwOpen, setPwOpen] = useState(false); const [pw1, setPw1] = useState(''); const [pw2, setPw2] = useState('')
  const pwValid = pw1.length >= 8 && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw1) && pw1 === pw2
  const u = state.user
  const seg = (val, opts, onPick, cls = '') => <div className={'seg ' + cls}>{opts.map(([k, l]) => <button key={k} className={val === k ? 'on' : ''} onClick={() => onPick(k)}>{l}</button>)}</div>
  const Toggle = ({ k, title, sub }) => (
    <label className="row" style={{ borderBottom: '1px solid rgba(255,255,255,.7)' }}>
      <div className="body"><div className="ttl">{title}</div><div className="sub">{sub}</div></div>
      <span style={{ fontSize: 'calc(12px * var(--fs))', fontWeight: 500, color: state.alerts[k] ? 'var(--amber-ink)' : 'var(--mute-2)' }}>{state.alerts[k] ? '켜짐' : '꺼짐'}</span>
      <span className="switch"><input type="checkbox" checked={state.alerts[k]} onChange={(e) => patch((s) => ({ alerts: { ...s.alerts, [k]: e.target.checked } }))} /><span /></span>
    </label>
  )
  return (
    <div className="page">
      <TopBar title="" back="/" right={<div style={{ fontSize: 'calc(22px * var(--fs))', fontWeight: 700, flex: 1 }}>환경설정</div>} />
      <div className="card" style={{ background: 'var(--lav)', padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="avatar" style={{ width: 48, height: 48, fontSize: 'calc(18px * var(--fs))', background: '#7C3AED', color: '#fff' }}>{initial(u.name)}</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 'calc(17px * var(--fs))', fontWeight: 700 }}>{u.name}</div><div style={{ fontSize: 'calc(13px * var(--fs))', color: 'var(--mute)' }}>{u.email} · 담당자</div></div>
        <button className="btn sm tint" style={{ color: 'var(--lav-ink)', borderColor: 'var(--lav-line)' }} onClick={() => notify('프로토타입')}>편집</button>
      </div>
      <div className="sec"><span className="t">계정</span></div>
      <div className="list" style={{ background: 'var(--mint)' }}>
        <Row Icon={() => <Lock />} bg="var(--card-bg)" title="비밀번호 변경" sub={fbEnabled ? undefined : '프로토타입(로컬 모드)에서는 비밀번호가 없어요'} onClick={() => fbEnabled ? setPwOpen((v) => !v) : notify('프로토타입(로컬 모드)에서는 비밀번호가 없어요')} />
        {pwOpen && <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="field"><input type="password" placeholder="새 비밀번호 (8자 이상 + 특수문자)" value={pw1} onChange={(e) => setPw1(e.target.value)} /></div>
          <div className="field"><input type="password" placeholder="새 비밀번호 확인" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
          <button className="btn" disabled={!pwValid} style={{ opacity: pwValid ? 1 : 0.5 }} onClick={async () => { if (await changePassword(pw1)) { setPwOpen(false); setPw1(''); setPw2('') } }}>변경하기</button>
        </div>}
        <Row Icon={() => <Building fill="#DCFCE7" />} bg="var(--card-bg)" title="소속 기관" sub={`${u.org} · 담당자 3명`} onClick={() => notify('프로토타입')} />
      </div>
      <div className="sec"><span className="t">화면</span></div>
      <div className="list" style={{ background: 'var(--blue)' }}>
        <div className="row"><div className="tile" style={{ width: 38, height: 38, borderRadius: 12, background: '#EDE9FE' }}><Moon /></div><div className="body"><div className="ttl">테마</div></div>{seg(state.theme, [['light', '라이트'], ['dark', '다크'], ['system', '시스템']], (v) => patch(() => ({ theme: v })), 'blue')}</div>
        <div className="row"><div className="tile" style={{ width: 38, height: 38, borderRadius: 12, background: '#FEF9C3' }}><Lines /></div><div className="body"><div className="ttl">글자 크기</div></div>{seg(state.fontSize, [['small', '작게'], ['normal', '보통'], ['large', '크게']], (v) => patch(() => ({ fontSize: v })), 'blue')}</div>
      </div>
      <div className="sec"><span className="t">알림</span></div>
      <div className="list" style={{ background: 'var(--beige)' }}>
        <Toggle k="newPosting" title="새 공고 알림" sub="매일 아침 이메일로" />
        <Toggle k="dueSoon" title="마감 임박 알림" sub="마감 3일 전" />
        <Toggle k="weekly" title="이번 주 면접 요약" sub="월요일 아침" />
      </div>
      <div className="sec"><span className="t">계정 관리</span></div>
      <div className="list" style={{ background: 'var(--peach)' }}>
        <Row Icon={() => <Logout />} bg="#FFEDD5" title="로그아웃" sub="이 기기에서만 로그아웃됩니다" onClick={async () => { await logout(); nav('/login') }} />
        <Row Icon={() => <UserX />} bg="var(--red-bg)" title="회원탈퇴" sub="내 계정만 삭제되고, 기관 데이터는 남습니다" danger onClick={async () => { if (confirm(fbEnabled ? '정말 탈퇴할까요? 내 계정이 삭제됩니다.' : '정말 탈퇴할까요? (프로토타입: 이 브라우저 데이터만 초기화)')) { if (await deleteAccount()) nav('/login') } }} />
      </div>
      <div className="note" style={{ textAlign: 'center' }}>면접로그 v0.1 프로토타입 · 이유정</div>
    </div>
  )
}
