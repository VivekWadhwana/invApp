import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './Context/DataContext'
import ScrollToTop from './Components/ScrollToTop'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import AdminDash from './Components/Dashboard/AdminDash'
import EmployeeDash from './Components/Dashboard/EmployeeDash'

function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/admin/*" element={<AdminDash />} />
          <Route path="/employee/*" element={<EmployeeDash />} />
        </Routes>
      </Router>
    </DataProvider>
  )
}

export default App