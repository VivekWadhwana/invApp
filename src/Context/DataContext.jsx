import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

// Initialize with sample data
const INITIAL_INVENTORY = [
  { id: 1, name: 'Product A', category: 'Electronics', quantity: 100, price: 29.99 },
  { id: 2, name: 'Product B', category: 'Clothing', quantity: 50, price: 49.99 },
  { id: 3, name: 'Product C', category: 'Home', quantity: 25, price: 99.99 },
];

const INITIAL_HISTORY = [];

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // Load from localStorage (frontend-only)
      const stored = localStorage.getItem('inventory');
      if (stored) {
        setInventory(JSON.parse(stored));
      } else {
        setInventory(INITIAL_INVENTORY);
        localStorage.setItem('inventory', JSON.stringify(INITIAL_INVENTORY));
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      // Load from localStorage (frontend-only)
      const stored = localStorage.getItem('history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory(INITIAL_HISTORY);
        localStorage.setItem('history', JSON.stringify(INITIAL_HISTORY));
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const addProduct = async (product) => {
    try {
      setLoading(true);
      const newProduct = {
        ...product,
        id: Date.now()
      };
      const updated = [...inventory, newProduct];
      setInventory(updated);
      localStorage.setItem('inventory', JSON.stringify(updated));
      
      // Add to history
      const newHistory = [...history, {
        id: Date.now(),
        action: 'added',
        productName: product.name,
        timestamp: new Date().toISOString()
      }];
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));
      
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      setLoading(true);
      const updated = inventory.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      setInventory(updated);
      localStorage.setItem('inventory', JSON.stringify(updated));
      
      // Add to history
      const newHistory = [...history, {
        id: Date.now(),
        action: 'updated',
        productName: updates.name || 'Unknown',
        timestamp: new Date().toISOString()
      }];
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));
      
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      const deleted = inventory.find(item => item.id === id);
      const updated = inventory.filter(item => item.id !== id);
      setInventory(updated);
      localStorage.setItem('inventory', JSON.stringify(updated));
      
      // Add to history
      const newHistory = [...history, {
        id: Date.now(),
        action: 'deleted',
        productName: deleted?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }];
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      fetchInventory();
      fetchHistory();
    }
  }, []);

  const value = {
    users,
    setUsers,
    products,
    setProducts,
    inventory,
    setInventory,
    history,
    setHistory,
    currentUser,
    setCurrentUser,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchInventory,
    fetchHistory,
    logout,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
