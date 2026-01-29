import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import Inventory from '../Pages/Inventory'
import Products from '../Pages/Products'
import AddProduct from '../Pages/AddProduct'
import History from '../Pages/History'
import EmployeeNav from '../Navbar/EmployeeNav'
import Footer from '../Footer/Footer'
import { useData } from '../../Context/DataContext'

const EmployeeDash = () => {
  const { logout } = useData();
  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <EmployeeNav handleLogout={logout} />
      </div>
      <div className="flex-1 pt-17">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/inventory' element={<Inventory/>}/>
          <Route path='/products' element={<Products/>}/>
          <Route path='/addProduct' element={<AddProduct/>}/>
          <Route path='/history' element={<History/>}/>
        </Routes>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  )
}

export default EmployeeDash
