import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pipeline from './pages/Pipeline'
import JobRequisitions from './pages/JobRequisitions'
import Clients from './pages/Clients'
import Interviews from './pages/Interviews'
import Analytics from './pages/Analytics'
import Training from './pages/Training'
import Team from './pages/Team'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/jobs" element={<JobRequisitions />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/training" element={<Training />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
