
import './App.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Receiver } from './components/Receiver'
import { Sender } from './components/Sender'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sender" element={<Sender/>} />
        <Route path="/receiver" element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App