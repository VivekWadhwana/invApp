import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              InvApp
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Smart Inventory Management System for Modern Businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/admin/inventory" 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              📊 Manage Inventory
            </Link>
            <Link 
              to="/admin/products" 
              className="px-6 py-3 bg-transparent border-2 border-purple-500 text-purple-600 font-semibold rounded-lg hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-300"
            >
              📦 View Products
            </Link>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200 hover:bg-white/90 transition-all duration-300 shadow-lg">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Performance</h3>
            <p className="text-gray-600 text-sm">Real-time inventory tracking with instant updates</p>
          </div>
          
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 hover:bg-white/90 transition-all duration-300 shadow-lg">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Modern Design</h3>
            <p className="text-gray-600 text-sm">Clean interface with intuitive user experience</p>
          </div>
          
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200 hover:bg-white/90 transition-all duration-300 shadow-lg">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Secure Access</h3>
            <p className="text-gray-600 text-sm">Role-based permissions and data protection</p>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">15+</div>
            <div className="text-gray-600 text-sm">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
            <div className="text-gray-600 text-sm">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-1">24/7</div>
            <div className="text-gray-600 text-sm">Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500 mb-1">100%</div>
            <div className="text-gray-600 text-sm">Reliable</div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Home
