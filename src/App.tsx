import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes'

function App() {
  return (
    <div className="app-container">
    <Router>
      <AppRoutes />
    </Router>
    </div>
  )
}

export default App