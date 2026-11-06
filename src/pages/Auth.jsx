import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store'
import { Building, Check, Back } from '../icons'

const ORG_DOMAINS = { 'ooacademy.co.kr': 'OO직업전문학교', 'company.co.kr': 'OO직업전문학교' }
const pwOk = (pw) => ({ len: pw.length >= 8, special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw) })

export function Login() {
  const { login, resetPassword, fbEnabled, notify } = useStore()
  const notifyNeedEmail = () => notify('이메일을 먼저 입력해 주세요')
  const nav = useNavigate(); const loc = useLocation()
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState(fbEnabled ? '' : 'hojun@ooacademy.co.kr')
  const [pw, setPw] = useState('')
  const submit = async (e) => { e.preventDefault(); if (!email || (fbEnabled && !pw)) return; setBusy(true); const ok = await login(email, pw); setBusy(false); if (ok) nav(loc.state?.from || '/', { replace: true }) }
  return (
    <div className="login-wrap">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <img src={import.meta.env.BASE_URL + 'icon.png'} alt="면접로그" style={{ width: 108, height: 108, objectFit: 'contain' }} />
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 'calc(28px * var(--fs))', fontWeight: 700 }}>면접로그</div><div style={{ fontSize: 'calc(14px * var(--fs))', color: 'var(--mute)' }}>Myeonlog · 취업 담당자 전용</div></div>
      </div>
      <form className="login-box" onSubmit={submit}>
        <div className="field"><label>이메일</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.co.kr" /></div>
        <div className="field"><label>비밀번호</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" /></div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'calc(14px * var(--fs))', color: 'var(--mute)' }}><input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--sky)', margin: 0 }} />로그인 상태 유지</label>
        <button className="btn" type="submit" disabled={busy} style={{ marginTop: 8, height: 54, opacity: busy ? 0.6 : 1 }}>{busy ? '확인 중…' : '로그인'}</button>
        <a href="#reset" onClick={(e) => { e.preventDefault(); if (!email) return notifyNeedEmail(); resetPassword(email) }} style={{ textAlign: 'center', fontSize: 'calc(14px * var(--fs))', fontWeight: 500 }}>비밀번호를 잊으셨나요?</a>
        <Link to="/signup" className="btn" style={{ background: '#FFF3D5', color: 'var(--mute)', border: '1px solid var(--sky-200)', marginTop: 12, height: 54 }}>회원가입</Link>
        <div className="note" style={{ textAlign: 'center' }}>{fbEnabled ? '기관 담당자 계정으로 로그인하세요' : '프로토타입: 아무 이메일로 로그인돼요 · 데이터는 이 브라우저에만 저장'}</div>
      </form>
    </div>
  )
}

export function Signup() {
  const { signup, notify } = useStore(); const nav = useNavigate()
  const [busy, setBusy] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [agree, setAgree] = useState(false)
  const domain = email.split('@')[1] || ''
  const org = ORG_DOMAINS[domain]
  const ok = pwOk(pw)
  const can = name && email.includes('@') && ok.len && ok.special && agree
  const submit = async (e) => { e.preventDefault(); if (!can || busy) return; setBusy(true); const ok = await signup(name, email, pw); setBusy(false); if (ok) { notify('가입 완료!'); nav('/', { replace: true }) } }
  return (
    <div className="page" style={{ paddingTop: 24 }}>
      <div className="topbar"><Link to="/login" className="backbtn" aria-label="뒤로"><Back /></Link><div style={{ fontSize: 'calc(15px * var(--fs))', color: 'var(--mute)' }}>회원가입</div></div>
      <div><h1 className="h1">담당자 계정 만들기</h1><div className="h-eyebrow" style={{ marginTop: 4 }}>기관 이메일이면 소속이 자동으로 확인돼요</div></div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="field"><label>이름</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" /></div>
        <div className="field">
          <label>이메일</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@ooacademy.co.kr" className={org ? 'ok' : ''} />
          {email.includes('@') && (
            org ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--mint)' }}>
                <div className="tile" style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--card-bg)' }}><Building fill="#DCFCE7" width="18" height="18" /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 'calc(13px * var(--fs))', fontWeight: 700 }}>{org}</div><div style={{ fontSize: 'calc(12px * var(--fs))', color: 'var(--green-ink)' }}>기관 이메일로 소속이 확인됐어요</div></div>
                <Check width="18" height="18" color="var(--green-ink)" />
              </div>
            ) : (
              <div style={{ padding: '10px 12px', borderRadius: 12, background: '#FEF3C7', fontSize: 'calc(13px * var(--fs))', color: 'var(--amber-ink)' }}>소속을 확인할 수 없어요 — 기관 관리자에게 초대를 요청하세요</div>
            )
          )}
        </div>
        <div className="field">
          <label>비밀번호</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="8자 이상 + 특수문자" className={ok.len && ok.special ? 'ok' : ''} />
          <div style={{ display: 'flex', gap: 14 }}>
            <span className={'rule' + (ok.len ? ' ok' : '')}><Check width="14" height="14" />8자 이상</span>
            <span className={'rule' + (ok.special ? ' ok' : '')}><Check width="14" height="14" />특수문자 포함</span>
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'calc(13px * var(--fs))', color: 'var(--mute)', lineHeight: 1.5 }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--sky)', margin: '1px 0 0', flexShrink: 0 }} />
          <span>수강생 개인정보를 업무 목적으로만 사용하며, <a href="#terms" style={{ fontWeight: 500 }}>이용약관·개인정보 처리방침</a>에 동의합니다.</span>
        </label>
        <button className="btn" type="submit" disabled={!can || busy} style={{ height: 54, opacity: can && !busy ? 1 : 0.5 }}>{busy ? '가입 중…' : '가입하기'}</button>
      </form>
      <div style={{ textAlign: 'center', fontSize: 'calc(14px * var(--fs))', color: 'var(--mute)' }}>이미 계정이 있나요? <Link to="/login" style={{ fontWeight: 500 }}>로그인</Link></div>
      <div className="card" style={{ padding: '14px 16px', fontSize: 'calc(13px * var(--fs))', color: 'var(--mute)', lineHeight: 1.5, textAlign: 'center' }}>기관 이메일이 없나요?<br /><span style={{ color: 'var(--mute-2)' }}>기관 관리자에게 초대를 요청하면 초대 링크가 메일로 와요</span></div>
    </div>
  )
}
