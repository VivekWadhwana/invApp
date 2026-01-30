/**
 * Simple Backend Test Suite
 * Tests basic server functionality without running the server
 */

console.log('🧪 Running Backend Tests...\n');

// Test 1: Verify required dependencies
console.log('Test 1: Checking dependencies...');
try {
  require('express');
  require('cors');
  require('mongoose');
  console.log('✅ All dependencies found\n');
} catch (error) {
  console.error('❌ Missing dependencies:', error.message);
  process.exit(1);
}

// Test 2: Verify server file exists and is valid
console.log('Test 2: Validating server.js...');
try {
  const fs = require('fs');
  const path = require('path');
  const serverPath = path.join(__dirname, 'server.js');
  
  if (!fs.existsSync(serverPath)) {
    throw new Error('server.js not found');
  }
  
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Check for essential components
  const checks = [
    { name: 'Express initialization', pattern: /express\(\)/ },
    { name: 'CORS middleware', pattern: /cors\(\)/ },
    { name: 'MongoDB connection', pattern: /mongoose\.connect/ },
    { name: 'Auth routes', pattern: /\/api\/auth/ },
    { name: 'Inventory routes', pattern: /\/api\/inventory/ },
    { name: 'Server listening', pattern: /app\.listen/ }
  ];
  
  let allPassed = true;
  checks.forEach(check => {
    if (check.pattern.test(serverContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ❌ ${check.name} - NOT FOUND`);
      allPassed = false;
    }
  });
  
  if (!allPassed) {
    throw new Error('Server validation failed');
  }
  
  console.log('✅ Server structure validated\n');
} catch (error) {
  console.error('❌ Server validation failed:', error.message);
  process.exit(1);
}

// Test 3: Check environment configuration
console.log('Test 3: Checking environment setup...');
try {
  const PORT = process.env.PORT || 5000;
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory';
  
  console.log(`  ℹ️  PORT: ${PORT}`);
  console.log(`  ℹ️  MONGODB_URI: ${MONGODB_URI}`);
  console.log('✅ Environment configuration OK\n');
} catch (error) {
  console.error('❌ Environment check failed:', error.message);
  process.exit(1);
}

// Test 4: Verify Dockerfile exists
console.log('Test 4: Checking Dockerfile...');
try {
  const fs = require('fs');
  const path = require('path');
  const dockerfilePath = path.join(__dirname, 'Dockerfile');
  
  if (!fs.existsSync(dockerfilePath)) {
    throw new Error('Dockerfile not found');
  }
  
  console.log('✅ Dockerfile exists\n');
} catch (error) {
  console.error('❌ Dockerfile check failed:', error.message);
  process.exit(1);
}

console.log('🎉 All backend tests passed!\n');
process.exit(0);
