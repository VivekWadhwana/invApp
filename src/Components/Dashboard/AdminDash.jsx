import { Routes, useLocation } from 'react-router-dom'
import { Route } from 'react-router-dom'
import React from 'react'
import ScrollToTop from '../ScrollToTop'
import AdminNav from '../Navbar/AdminNav'
import Footer from '../Footer/Footer'
import Home from '../Pages/Home'
import Inventory from '../Pages/Inventory'
import Products from '../Pages/Products'
import Admin from '../Pages/AdminPanel'
import History from '../Pages/History'
import AddProduct from '../Pages/AddProduct'
import { useData } from '../../Context/DataContext'

const AdminDash = () => {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin/admin'
  const { logout } = useData()

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col z-auto ">
        <div>
          <AdminNav handleLogout={logout} />
        </div>
        <div className="flex-1 pt-17 min-h-dvh z-0">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/inventory' element={<Inventory/>}/>
            <Route path='/products' element={<Products/>}/>
            <Route path='/addProduct' element={<AddProduct/>}/>
            <Route path='/history' element={<History/>}/>
            <Route path='/admin' element={<Admin/>}/>
          </Routes>
        </div>
        {!isAdminPage && (
          <div>
            <Footer/>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminDash
