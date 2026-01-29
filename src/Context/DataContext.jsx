import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const API_BASE = 'http://localhost:5000/api';

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
      const response = await fetch(`${API_BASE}/inventory`);
      const data = await response.json();
      if (response.ok) {
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/history`);
      const data = await response.json();
      if (response.ok) {
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const addProduct = async (product) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await response.json();
      if (response.ok) {
        await fetchInventory();
        await fetchHistory();
        return data;
      } else {
        throw new Error(data.message);
      }
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
      const response = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (response.ok) {
        await fetchInventory();
        await fetchHistory();
        return data;
      } else {
        throw new Error(data.message);
      }
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
      const response = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchInventory();
        await fetchHistory();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
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
