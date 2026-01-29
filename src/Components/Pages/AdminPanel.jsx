import React from 'react'

function Admin() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded">
          <h3 className="text-sm">Total Products</h3>
          <p className="text-2xl font-bold">28</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded">
          <h3 className="text-sm">Total Stock</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded">
          <h3 className="text-sm">Low Stock</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded">
          <h3 className="text-sm">Out of Stock</h3>
          <p className="text-2xl font-bold">28</p>
        </div>
      </div>
    </div>
  )
}

export default Admin
