import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useData } from '../../Context/DataContext'

function AddProduct() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addProduct, loading } = useData()
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    brand: '',
    color: '',
    size: '',
    material: '',
    description: ''
  })

  // Pre-fill form if product data is passed from Products page
  useEffect(() => {
    if (location.state?.productData) {
      const product = location.state.productData
      setFormData({
        name: product.name || '',
        category: product.category || '',
        quantity: '1',
        price: product.price?.toString() || '',
        brand: product.brand || '',
        color: product.color || '',
        size: product.size || '',
        material: product.type || '',
        description: ''
      })
    }
  }, [location.state])

  const productNames = {
    'Fabric': ['Cotton Fabric', 'Silk Fabric', 'Polyester Fabric', 'Wool Fabric', 'Linen Fabric', 'Denim Fabric'],
    'Sewing Machine': ['Singer Heavy Duty', 'Brother XM2701', 'Janome 2212', 'Bernina 330', 'Pfaff Creative'],
    'Thread': ['Cotton Thread', 'Polyester Thread', 'Silk Thread', 'Embroidery Thread'],
    'Needle': ['Universal Needles', 'Sharp Needles', 'Ballpoint Needles', 'Embroidery Needles', 'Leather Needles'],
    'Scissors': ['Fabric Scissors', 'Embroidery Scissors', 'Pinking Shears', 'Rotary Cutter'],
    'Button': ['Plastic Buttons', 'Metal Buttons', 'Wood Buttons', 'Shell Buttons', 'Fabric Covered Buttons'],
    'Zipper': ['Metal Zipper', 'Plastic Zipper', 'Invisible Zipper', 'Separating Zipper'],
    'Trim': ['Lace Trim', 'Ribbon Trim', 'Bias Tape', 'Elastic Trim', 'Piping Trim']
  }

  const categories = {
    'Fabric': ['Cotton', 'Silk', 'Polyester', 'Wool', 'Linen', 'Denim'],
    'Sewing Machine': ['Singer', 'Brother', 'Janome', 'Bernina', 'Pfaff'],
    'Thread': ['Cotton Thread', 'Polyester Thread', 'Silk Thread', 'Embroidery Thread'],
    'Needle': ['Universal', 'Ballpoint', 'Sharp', 'Embroidery', 'Leather'],
    'Scissors': ['Fabric Scissors', 'Embroidery Scissors', 'Pinking Shears', 'Rotary Cutter'],
    'Button': ['Plastic', 'Metal', 'Wood', 'Shell', 'Fabric Covered'],
    'Zipper': ['Metal', 'Plastic', 'Invisible', 'Separating'],
    'Trim': ['Lace', 'Ribbon', 'Bias Tape', 'Elastic', 'Piping']
  }

  const getCategoryFields = () => {
    switch(formData.category) {
      case 'Fabric':
        return (
          <>
            <div>
              <label htmlFor="material">Material *</label>
              <select 
                id="material" 
                className="border w-full border-black rounded-md p-2"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                required
              >
                <option value="">Select Material</option>
                {categories['Fabric'].map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="color">Color</label>
              <input 
                type="text" 
                id="color" 
                className="border w-full border-black rounded-md p-2"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                placeholder="e.g., Red, Blue, White"
              />
            </div>
          </>
        )
      case 'Sewing Machine':
        return (
          <div>
            <label htmlFor="brand">Brand *</label>
            <select 
              id="brand" 
              className="border w-full border-black rounded-md p-2"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              required
            >
              <option value="">Select Brand</option>
              {categories['Sewing Machine'].map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        )
      case 'Thread':
        return (
          <>
            <div>
              <label htmlFor="material">Type *</label>
              <select 
                id="material" 
                className="border w-full border-black rounded-md p-2"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                {categories['Thread'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="color">Color</label>
              <input 
                type="text" 
                id="color" 
                className="border w-full border-black rounded-md p-2"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                placeholder="e.g., Black, White, Red"
              />
            </div>
          </>
        )
      case 'Needle':
        return (
          <>
            <div>
              <label htmlFor="material">Type *</label>
              <select 
                id="material" 
                className="border w-full border-black rounded-md p-2"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                {categories['Needle'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="size">Size</label>
              <input 
                type="text" 
                id="size" 
                className="border w-full border-black rounded-md p-2"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                placeholder="e.g., 80/12, 90/14"
              />
            </div>
          </>
        )
      case 'Scissors':
        return (
          <div>
            <label htmlFor="material">Type *</label>
            <select 
              id="material" 
              className="border w-full border-black rounded-md p-2"
              value={formData.material}
              onChange={(e) => setFormData({...formData, material: e.target.value})}
              required
            >
              <option value="">Select Type</option>
              {categories['Scissors'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )
      case 'Button':
        return (
          <>
            <div>
              <label htmlFor="material">Material *</label>
              <select 
                id="material" 
                className="border w-full border-black rounded-md p-2"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                required
              >
                <option value="">Select Material</option>
                {categories['Button'].map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="size">Size</label>
              <input 
                type="text" 
                id="size" 
                className="border w-full border-black rounded-md p-2"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                placeholder="e.g., 12mm, 15mm"
              />
            </div>
          </>
        )
      case 'Zipper':
        return (
          <>
            <div>
              <label htmlFor="material">Type *</label>
              <select 
                id="material" 
                className="border w-full border-black rounded-md p-2"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                {categories['Zipper'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="size">Length</label>
              <input 
                type="text" 
                id="size" 
                className="border w-full border-black rounded-md p-2"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                placeholder="e.g., 20cm, 30cm"
              />
            </div>
          </>
        )
      case 'Trim':
        return (
          <>
            <div>
              <label htmlFor="material">Type *</label>
              <select 
                id="material" 
                className="border w-full border-black rounded-md p-2"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                {categories['Trim'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="color">Color</label>
              <input 
                type="text" 
                id="color" 
                className="border w-full border-black rounded-md p-2"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                placeholder="e.g., White, Black, Gold"
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.category || !formData.quantity) {
      alert('Please fill all required fields')
      return
    }
    
    try {
      await addProduct(formData)
      alert('Product added successfully!')
      setFormData({ name: '', category: '', quantity: '', price: '', brand: '', color: '', size: '', material: '', description: '' })
      navigate(location.pathname.includes('admin') ? '/admin/inventory' : '/employee/inventory')
    } catch (error) {
      alert('Failed to add product: ' + error.message)
    }
  }

  return (
    <div className="w-[60%] bg-white text-black p-7 rounded border mx-auto mt-7 mb-10">
      <h1 className="text-3xl font-bold">Add Product</h1>
      <form onSubmit={handleSubmit} className="grid gap-5 mt-3">
        <div>
          <label htmlFor="name">Product Name *</label>
          <select 
            id="name" 
            className="border w-full border-black rounded-md p-2"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            disabled={loading}
          >
            <option value="">Select Product Name</option>
            {formData.category && productNames[formData.category]?.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="category">Category *</label>
          <select 
            id="category" 
            className="border w-full border-black rounded-md p-2"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value, material: '', brand: '', color: '', size: '', name: ''})}
            required
            disabled={loading}
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        {getCategoryFields()}
        
        <div>
          <label htmlFor="quantity">Quantity *</label>
          <input 
            type="number" 
            id="quantity" 
            min="0"
            className="border w-full border-black rounded-md p-2"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="price">Price (₹)</label>
          <input 
            type="number" 
            id="price" 
            min="0"
            step="0.01"
            className="border w-full border-black rounded-md p-2 bg-gray-100"
            value={formData.price}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            className="border w-full border-black rounded-md p-2 h-20"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Additional product details..."
            disabled={loading}
          />
        </div>

        <div className="flex justify-between">
          <Link 
            to={location.pathname.includes('admin') ? '/admin/inventory' : '/employee/inventory'}
            className="border border-black rounded-md p-2"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            className="border border-black rounded-md p-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct