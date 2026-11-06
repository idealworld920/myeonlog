const P = { fill: 'none', stroke: '#1E293B', strokeWidth: 1.5, strokeLinejoin: 'round', viewBox: '0 0 24 24', 'aria-hidden': true }
const ink = 'var(--ink)'

export const Building = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><path d="M4 20V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" fill={fill} /><path d="M3 20h18M9 10h2M13 10h2M9 14h2M13 14h2M10 20v-3h4v3" /></svg>
)
export const Person = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><circle cx="12" cy="8" r="4" fill={fill} /><path d="M4 21c0-4 4-6 8-6s8 2 8 6z" fill={fill} /></svg>
)
export const Folder = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><path d="M4 7a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill={fill} /><path d="M9 14l2 2 4-4" /></svg>
)
export const FolderUp = ({ fill = '#38BDF8', ...p }) => (
  <svg {...P} stroke="#fff" {...p}><path d="M4 7a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill={fill} /><path d="M12 16v-5M9.5 13.5 12 11l2.5 2.5" /></svg>
)
export const Doc = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><path d="M6 3h8l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill={fill} /><path d="M14 3v4h4M8 12h8M8 16h5" /></svg>
)
export const Gear = ({ fill = '#BAE6FD', ...p }) => (
  <svg {...P} stroke={ink} {...p}><circle cx="12" cy="12" r="3" fill={fill} /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></svg>
)
export const Lock = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><rect x="5" y="10" width="14" height="10" rx="2" fill={fill} /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" /></svg>
)
export const Moon = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill={fill} /></svg>
)
export const Lines = (p) => (<svg {...P} stroke={ink} {...p}><path d="M4 7h16M4 12h10M4 17h7" /></svg>)
export const Logout = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" fill={fill} /><path d="M14 8l4 4-4 4M18 12H9" /></svg>
)
export const UserX = (p) => (
  <svg {...P} stroke="#B91C1C" {...p}><circle cx="10" cy="8" r="4" fill="#fff" /><path d="M3 21c0-4 3-6 7-6 1.2 0 2.3.2 3.2.5" /><path d="M16 16l5 5M21 16l-5 5" /></svg>
)
export const Globe = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><circle cx="12" cy="12" r="8" fill={fill} /><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" /></svg>
)
export const Code = (p) => (<svg {...P} stroke={ink} {...p}><path d="M8 6l-5 6 5 6M16 6l5 6-5 6M14 4l-4 16" /></svg>)
export const Arch = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><rect x="3" y="4" width="7" height="6" rx="1.5" fill={fill} /><rect x="14" y="4" width="7" height="6" rx="1.5" fill={fill} /><rect x="8.5" y="14" width="7" height="6" rx="1.5" fill={fill} /><path d="M6.5 10v2h11v-2M12 12v2" /></svg>
)
export const Video = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><rect x="3" y="6" width="13" height="12" rx="2" fill={fill} /><path d="M16 10l5-3v10l-5-3z" fill={fill} /></svg>
)
export const Slides = ({ fill = '#FFFFFF', ...p }) => (
  <svg {...P} stroke={ink} {...p}><rect x="3" y="5" width="18" height="14" rx="2" fill={fill} /><path d="M3 10h18M8 15h4" /></svg>
)
export const Team = ({ fill = '#BAE6FD', ...p }) => (
  <svg {...P} stroke={ink} {...p}><circle cx="9" cy="8" r="3" fill={fill} /><circle cx="16" cy="9" r="2.5" fill="#fff" /><path d="M3 20c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5zM15 14c2.8 0 5 1.6 5 4.5" /></svg>
)
export const Chevron = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...p}><path d="M9 6l6 6-6 6" /></svg>)
export const Back = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...p}><path d="M15 6l-6 6 6 6" /></svg>)
export const Search = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>)
export const Filter = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...p}><path d="M4 7h16M7 12h10M10 17h4" /></svg>)
export const Download = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...p}><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>)
export const Check = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><path d="M5 12l5 5L19 7" /></svg>)
export const Play = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M8 5v14l11-7z" /></svg>)
export const Plus = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" {...p}><path d="M12 5v14M5 12h14" /></svg>)
