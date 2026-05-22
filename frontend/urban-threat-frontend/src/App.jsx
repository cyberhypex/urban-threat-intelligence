import react from 'react'
import './App.css'
import {HomePage} from './HomePage';
import SummaryPage from './SummaryPage';
import {Routes,Route} from 'react-router-dom'

function App() {
  return(
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/summary" element={<SummaryPage />} />
    </Routes>
  )
}

export default App;