import React from "react";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">InvApp</h3>
            <p className="text-gray-400 text-sm mb-3">
              Smart inventory management for modern businesses
            </p>
            <div className="flex space-x-3">
              <a href="mailto:support@invapp.com" className="w-8 h-8 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors">
                <span className="text-sm">📧</span>
              </a>
              <a href="tel:+1234567890" className="w-8 h-8 bg-teal-600 hover:bg-teal-500 rounded-full flex items-center justify-center transition-colors">
                <span className="text-sm">📱</span>
              </a>
              <a href="https://invapp.com" className="w-8 h-8 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-colors">
                <span className="text-sm">🌐</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-emerald-400 mb-3">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link to="/admin" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">Dashboard</Link></li>
              <li><Link to="/admin/inventory" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">Inventory</Link></li>
              <li><Link to="/admin/products" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">Products</Link></li>
              <li><Link to="/admin/history" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">Reports</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-teal-400 mb-3">Support</h4>
            <ul className="space-y-1">
              <li><a href="mailto:help@invapp.com" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">Help Center</a></li>
              <li><a href="https://docs.invapp.com" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">Documentation</a></li>
              <li><a href="mailto:contact@invapp.com" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              &copy; 2024 InvApp. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="https://invapp.com/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="https://invapp.com/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;