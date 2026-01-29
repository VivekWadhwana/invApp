import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useData } from '../../Context/DataContext'

function Inventory() {
  const navigate = useNavigate()
  const location = useLocation()
  const { inventory, deleteProduct, loading } = useData()

  const isAdmin = location.pathname.includes('/admin')
  const basePath = isAdmin ? '/admin' : '/employee'

  const getStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock'
    if (quantity < 10) return 'Low Stock'
    return 'In Stock'
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteProduct(id)
        alert('Product deleted successfully!')
      } catch (error) {
        alert('Failed to delete product: ' + error.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading inventory...</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`${basePath}/history`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            History
          </button>
          <button 
            onClick={() => navigate(`${basePath}/addProduct`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => {
              const status = getStatus(item.quantity)
              return (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.price || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      status === 'In Stock' ? 'bg-green-100 text-green-800' :
                      status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        {inventory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items in inventory. Add some products to get started.
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory