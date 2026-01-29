import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../../Context/DataContext'

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser, fetchInventory, fetchHistory } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.username, 
          password: formData.password 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        await fetchInventory();
        await fetchHistory();
        
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Network error. Please check your connection.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome Back</h1>
                    <p className='text-gray-600'>Sign in to your account</p>
                </div>
                
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                        <input
                            type="email"
                            placeholder='Enter your email'
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                        <input
                            type="password"
                            placeholder='Enter your password'
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type='submit'
                        disabled={loading}
                        className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50'
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className='mt-6'>
                    <div className='relative mb-4'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-2 bg-white text-gray-500'>or</span>
                        </div>
                    </div>
                    
                    <Link to="/signUp"
                        className='w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 block text-center'
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
