import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider } from './store'
import Layout from './Layout'
import { Login, Signup } from './pages/Auth'
import { Home, Company } from './pages/Companies'
import { Students, Student, Interview } from './pages/Students'
import { Projects, Project, ProjectPlan, ProjectDeploy, ProjectVideo, ProjectNew } from './pages/Projects'
import { Upload, Settings } from './pages/Misc'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/company/:id" element={<Company />} />
            <Route path="/students" element={<Students />} />
            <Route path="/student/:id" element={<Student />} />
            <Route path="/interview/:id" element={<Interview />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/new" element={<ProjectNew />} />
            <Route path="/project/:id" element={<Project />} />
            <Route path="/project/:id/plan" element={<ProjectPlan />} />
            <Route path="/project/:id/deploy" element={<ProjectDeploy />} />
            <Route path="/project/:id/video" element={<ProjectVideo />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
