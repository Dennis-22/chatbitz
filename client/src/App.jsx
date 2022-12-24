import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Join from './pages/Join'
import Playground from './pages/Playground'

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/join" element={<Join />}/>
        <Route path="/create" element={<Create />}/>
        <Route path="/playground" element={<Playground />}/>
      </Routes>
    </Router>
  )
}
