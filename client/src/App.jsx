import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Connect from './pages/Connect'
import Playground from './pages/Playground'

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/connect" element={<Connect />}/>
        <Route path="/playground" element={<Playground />}/>
      </Routes>
    </Router>
  )
}
