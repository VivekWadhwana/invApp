import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Products(){ 
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = location.pathname.includes('/admin');
    const basePath = isAdmin ? '/admin' : '/employee';

    const [selectedCategory, setSelectedCategory] = useState('All')

    const productCategories = [
        // Fabric Products
        { id: 1, name: "Cotton Fabric", category: "Fabric", type: "Cotton", price: 4000, color: "White" },
        { id: 2, name: "Silk Fabric", category: "Fabric", type: "Silk", price: 8000, color: "Red" },
        { id: 3, name: "Denim Fabric", category: "Fabric", type: "Denim", price: 3500, color: "Blue" },
        
        // Sewing Machine Products
        { id: 4, name: "Singer Heavy Duty", category: "Sewing Machine", type: "Singer", price: 45000, brand: "Singer" },
        { id: 5, name: "Brother XM2701", category: "Sewing Machine", type: "Brother", price: 35000, brand: "Brother" },
        { id: 6, name: "Janome 2212", category: "Sewing Machine", type: "Janome", price: 25000, brand: "Janome" },
        
        // Thread Products
        { id: 7, name: "Cotton Thread", category: "Thread", type: "Cotton Thread", price: 800, color: "Black" },
        { id: 8, name: "Polyester Thread", category: "Thread", type: "Polyester Thread", price: 600, color: "White" },
        { id: 9, name: "Embroidery Thread", category: "Thread", type: "Embroidery Thread", price: 1200, color: "Multi" },
        
        // Needle Products
        { id: 10, name: "Universal Needles", category: "Needle", type: "Universal", price: 400, size: "80/12" },
        { id: 11, name: "Sharp Needles", category: "Needle", type: "Sharp", price: 450, size: "90/14" },
        { id: 12, name: "Ballpoint Needles", category: "Needle", type: "Ballpoint", price: 500, size: "75/11" },
        
        // Scissors Products
        { id: 13, name: "Fabric Scissors", category: "Scissors", type: "Fabric Scissors", price: 2000, size: "8 inch" },
        { id: 14, name: "Embroidery Scissors", category: "Scissors", type: "Embroidery Scissors", price: 1500, size: "4 inch" },
        { id: 15, name: "Pinking Shears", category: "Scissors", type: "Pinking Shears", price: 2500, size: "9 inch" },
        
        // Button Products
        { id: 16, name: "Plastic Buttons", category: "Button", type: "Plastic", price: 300, size: "15mm" },
        { id: 17, name: "Metal Buttons", category: "Button", type: "Metal", price: 500, size: "20mm" },
        { id: 18, name: "Wood Buttons", category: "Button", type: "Wood", price: 400, size: "18mm" },
        
        // Zipper Products
        { id: 19, name: "Metal Zipper", category: "Zipper", type: "Metal", price: 250, size: "30cm" },
        { id: 20, name: "Plastic Zipper", category: "Zipper", type: "Plastic", price: 150, size: "25cm" },
        { id: 21, name: "Invisible Zipper", category: "Zipper", type: "Invisible", price: 200, size: "20cm" },
        
        // Trim Products
        { id: 22, name: "Lace Trim", category: "Trim", type: "Lace", price: 800, color: "White" },
        { id: 23, name: "Ribbon Trim", category: "Trim", type: "Ribbon", price: 600, color: "Gold" },
        { id: 24, name: "Elastic Trim", category: "Trim", type: "Elastic", price: 400, color: "Black" }
    ];

    const getCategoryIcon = (category) => {
        const icons = {
            'Fabric': '🧵',
            'Sewing Machine': '🪡',
            'Thread': '🧶',
            'Needle': '📍',
            'Scissors': '✂️',
            'Button': '🔘',
            'Zipper': '🤐',
            'Trim': '🎀'
        }
        return icons[category] || '📦'
    }

    const categories = ['All', 'Fabric', 'Sewing Machine', 'Thread', 'Needle', 'Scissors', 'Button', 'Zipper', 'Trim']
    
    const filteredProducts = selectedCategory === 'All' 
        ? productCategories 
        : productCategories.filter(product => product.category === selectedCategory)

    return(
        <div className="p-6 bg-amber-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div className="text-center flex-1">
                        <h1 className="text-5xl font-bold text-amber-900 mb-4">Product Catalog</h1>
                        <p className="text-xl text-amber-700">Choose from our wide range of quality products</p>
                    </div>
                    <div className="ml-8">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-white border-2 border-amber-300 text-amber-800 px-4 py-2 rounded-lg font-semibold focus:outline-none focus:border-amber-500 shadow-md"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-amber-200 overflow-hidden">
                            <div className="relative">
                                <div className="w-full h-32 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                                            <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                                        </div>
                                        <span className="text-white text-sm font-semibold">{product.category}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-amber-900 mb-2">{product.name}</h3>
                                <div className="mb-4 space-y-2">
                                    <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {product.type}
                                    </span>
                                    {product.color && (
                                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                                            {product.color}
                                        </span>
                                    )}
                                    {product.size && (
                                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                                            {product.size}
                                        </span>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => navigate(`${basePath}/addProduct`, { state: { productData: product } })}
                                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                                    >
                                        ➕ Add to Inventory
                                    </button>
                                    <Link 
                                        to={`${basePath}/inventory`} 
                                        className="w-full block text-center border-2 border-orange-500 text-orange-600 py-3 px-4 rounded-lg hover:bg-orange-500 hover:text-white transition-all text-sm font-semibold"
                                    >
                                        👁️ View Stock
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Products;