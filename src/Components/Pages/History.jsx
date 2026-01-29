import React, { useState, useEffect } from 'react'
import { useData } from '../../Context/DataContext'

function History() {
  const { history, loading } = useData()
  const [filters, setFilters] = useState({
    action: 'all',
    search: ''
  })

  const filteredHistory = history.filter(entry => {
    if (filters.action !== 'all' && entry.action.toLowerCase() !== filters.action.toLowerCase()) return false
    if (filters.search && !entry.product?.name?.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading history...</div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>
            <p className="text-gray-600 text-sm">Track all inventory changes</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({...filters, action: e.target.value})}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Actions</option>
                <option value="added">Added</option>
                <option value="deleted">Deleted</option>
                <option value="updated">Updated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {new Date(entry.timestamp || entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.action === 'Added' ? 'bg-green-100 text-green-800' : 
                      entry.action === 'Updated' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{entry.product?.name || 'N/A'}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{entry.product?.category || 'N/A'}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{entry.product?.quantity || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No history records found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History