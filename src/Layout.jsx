import { useState } from 'react'
import { NavLink, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useStore, initial } from './store'
import { Building, Person, Folder, FolderUp, Gear, Back, Chevron } from './icons'

const NAV = [
  { to: '/', label: '회사', Icon: Building, end: true },
  { to: '/students', label: '수강생', Icon: Person },
  { to: '/projects', label: '프로젝트', Icon: Folder },
]

export default function Layout() {
  const { state } = useStore()
  const loc = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  if (!state.ready) return <div className="login-wrap"><div style={{ color: 'var(--mute)' }}>불러오는 중…</div></div>
  if (!state.user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />

  const isActive = (to, end) => end ? loc.pathname === to : loc.pathname.startsWith(to)

  return (
    <div className="app">
      <aside className={'sidebar' + (collapsed ? ' collapsed' : '')}>
        <button className="collapse-btn" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? '메뉴 펼치기' : '메뉴 접기'} title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}>
          {collapsed ? <Chevron width="18" height="18" /> : <Back width="18" height="18" />}
        </button>
        <div className="brand">
          <img src={import.meta.env.BASE_URL + 'icon.png'} alt="" />
          <div className="brand-text"><b>면접로그</b><span>Myeonlog</span></div>
        </div>
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={'nav-item' + (isActive(to, end) ? ' active' : '')} title={label}>
            <Icon fill={isActive(to, end) ? '#BAE6FD' : '#FFFFFF'} /><span className="nav-label">{label}</span>
          </NavLink>
        ))}
        <NavLink to="/upload" className={'nav-item' + (isActive('/upload') ? ' active' : '')} title="엑셀 업로드">
          <FolderUp fill="#FEF9C3" stroke="var(--ink)" /><span className="nav-label">엑셀 업로드</span>
        </NavLink>
        <NavLink to="/settings" className={'nav-item' + (isActive('/settings') ? ' active' : '')} title="환경설정">
          <Gear fill="#EDE9FE" /><span className="nav-label">환경설정</span>
        </NavLink>
        <div className="side-foot">
          <div className="side-foot-box side-foot-text">마지막 갱신<br /><b style={{ color: 'var(--ink)' }}>11월 5일 05:00</b> · 성공</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px' }}>
            <div className="avatar" style={{ width: 32, height: 32, background: 'var(--sky)', color: '#fff', fontSize: 'calc(13px * var(--fs))' }}>{initial(state.user.name)}</div>
            <span className="side-foot-text" style={{ fontSize: 'calc(13px * var(--fs))', color: 'var(--mute)' }}>{state.user.name} 님</span>
          </div>
        </div>
      </aside>
      <div className="main">
        <Outlet />
        <nav className="tabbar" aria-label="주 메뉴">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={isActive(to, end) ? 'active' : ''}>
              <Icon fill={isActive(to, end) ? '#BAE6FD' : '#FFFFFF'} />{label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

export function TopBar({ title, back = -1, right }) {
  return (
    <div className="topbar">
      <BackLink to={back} />
      <div style={{ flex: 1, fontSize: 'calc(15px * var(--fs))', color: 'var(--mute)' }}>{title}</div>
      {right}
    </div>
  )
}
export function BackLink({ to = -1 }) {
  const nav = useNavigate()
  return <button className="backbtn" aria-label="뒤로" onClick={() => (typeof to === 'number' ? nav(to) : nav(to))}><Back /></button>
}
