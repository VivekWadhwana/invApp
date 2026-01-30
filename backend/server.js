const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  userName: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'employee' }
});

const inventorySchema = new mongoose.Schema({
  name: String,
  category: String,
  quantity: Number,
  price: Number
});

const historySchema = new mongoose.Schema({
  action: String,
  product: Object,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const History = mongoose.model('History', historySchema);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize default data
const initializeData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        { fullName: 'Admin User', email: 'admin@test.com', userName: 'admin', password: 'admin123', role: 'admin' },
        { fullName: 'Employee User', email: 'employee@test.com', userName: 'employee', password: 'emp123', role: 'employee' }
      ]);
    }
    
    const inventoryCount = await Inventory.countDocuments();
    if (inventoryCount === 0) {
      await Inventory.create([
        { name: 'Cotton Fabric', category: 'Fabric', quantity: 50, price: 4000 },
        { name: 'Lockstitch Machine', category: 'Sewing Machine', quantity: 5, price: 40000 },
        { name: 'Colored Thread', category: 'Thread', quantity: 100, price: 800 }
      ]);
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

initializeData();

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, userName, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = await User.create({
      fullName,
      email,
      userName,
      password,
      role: 'employee'
    });
    
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({
      message: 'Login successful',
      token: 'simple-token-' + user._id,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Inventory routes
app.get('/api/inventory', async (req, res) => {
  try {
    const products = await Inventory.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    
    const product = await Inventory.create({
      name,
      category,
      quantity: parseInt(quantity),
      price: parseFloat(price) || 0
    });
    
    await History.create({
      action: 'Added',
      product: product.toObject()
    });
    
    res.status(201).json({
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;
    
    const product = await Inventory.findByIdAndUpdate(id, {
      name,
      category,
      quantity: parseInt(quantity),
      price: parseFloat(price) || 0
    }, { new: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await History.create({
      action: 'Updated',
      product: product.toObject()
    });
    
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Inventory.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await History.create({
      action: 'Deleted',
      product: product.toObject()
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// History routes
app.get('/api/history', async (req, res) => {
  try {
    const historyData = await History.find().sort({ timestamp: -1 });
    res.json(historyData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});