import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {withOneTabEnforcer} from 'react-one-tab-enforcer'
import Home from './pages/Home'
import Connect from './pages/Connect'
import Playground from './pages/Playground'
import AppAlreadyRunning from './components/global/AppAlreadyRunning'

function App() {  
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


export default withOneTabEnforcer({appName:"ChatBitz", OnlyOneTabComponent:AppAlreadyRunning})(App)