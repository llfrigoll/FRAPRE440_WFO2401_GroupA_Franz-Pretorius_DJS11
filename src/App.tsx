import Dashboard from './Dashboard'
import Header from '../components/Header'
import Navbar from '../components/Navbar'

export default function App() {
  return (
    <div className="relative">
      <Header />
      <Navbar />
      <Dashboard />
    </div>
  )
}