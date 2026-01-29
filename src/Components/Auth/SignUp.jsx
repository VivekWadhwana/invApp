import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function SignUp() {
    const [formdata, setFormdata] = useState({
        fullName: '',
        email: '',
        userName: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formdata.password !== formdata.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        setLoading(true);
        
        try {
            const { confirmPassword, ...userData } = formdata;
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Registration successful! Please login.');
                setFormdata({ fullName: '', email: '', userName: '', password: '', confirmPassword: '' });
                navigate('/login');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            alert('Network error. Please check your connection.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target
        setFormdata(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-cyan-50 to-green-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>Create Account</h1>
                    <p className='text-gray-600'>Sign up for a new account</p>
                </div>
                
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formdata.fullName}
                            onChange={handleInputChange}
                            placeholder='Enter your full name'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200'
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formdata.email}
                            onChange={handleInputChange}
                            placeholder='Enter your email'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200'
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Username</label>
                        <input
                            type="text"
                            name="userName"
                            value={formdata.userName}
                            onChange={handleInputChange}
                            placeholder='Choose a username'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200'
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder='Create a password'
                            value={formdata.password}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200'
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder='Confirm your password'
                            value={formdata.confirmPassword}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200'
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type='submit'
                        disabled={loading}
                        className='w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className='mt-6 text-center'>
                    <p className='text-sm text-gray-600'>
                        Already have an account?{' '}
                        <Link 
                            to='/login'
                            className='text-green-600 hover:text-green-800 font-medium transition-colors duration-200'
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
