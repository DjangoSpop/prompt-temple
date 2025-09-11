// Authentication Flow Test Script
// Open browser console and paste this to test authentication

console.log('🔧 Starting Authentication Flow Test...');

// Test function to check current auth status
window.checkAuthStatus = function() {
  console.log('📊 Current Authentication Status:');
  console.log('- Access Token:', localStorage.getItem('access_token')?.substring(0, 30) + '...');
  console.log('- Refresh Token:', localStorage.getItem('refresh_token')?.substring(0, 30) + '...');
  console.log('- Token Storage Status:', {
    hasAccess: !!localStorage.getItem('access_token'),
    hasRefresh: !!localStorage.getItem('refresh_token')
  });
};

// Test registration flow
window.testRegistration = async function() {
  console.log('🧪 Testing Registration Flow...');
  
  try {
    const testUser = {
      username: 'testuser_' + Date.now(),
      email: 'test_' + Date.now() + '@example.com',
      password: 'testpassword123',
      password_confirm: 'testpassword123',
      first_name: 'Test',
      last_name: 'User'
    };
    
    console.log('📝 Attempting registration with:', testUser.username, testUser.email);
    
    // This will use the actual auth service from your app
    const response = await fetch('/api/proxy/api/v2/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful:', data);
      if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        console.log('💾 Tokens saved to storage');
      }
    } else {
      console.error('❌ Registration failed:', data);
    }
    
    return data;
  } catch (error) {
    console.error('💥 Registration error:', error);
    return null;
  }
};

// Test login flow
window.testLogin = async function(username = 'demo', password = 'password') {
  console.log('🧪 Testing Login Flow...');
  console.log('🔐 Attempting login with:', username);
  
  try {
    const response = await fetch('/api/proxy/api/v2/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful:', data);
      
      // Check if response has the expected format
      if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        console.log('💾 Tokens saved to storage');
      } else if (data.access && data.refresh) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        console.log('💾 Tokens saved to storage (legacy format)');
      } else {
        console.warn('⚠️ No tokens in response:', data);
      }
    } else {
      console.error('❌ Login failed:', data);
    }
    
    return data;
  } catch (error) {
    console.error('💥 Login error:', error);
    return null;
  }
};

// Test authenticated request
window.testAuthenticatedRequest = async function() {
  console.log('🧪 Testing Authenticated Request...');
  
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('❌ No access token found. Please login first.');
    return;
  }
  
  try {
    const response = await fetch('/api/proxy/api/v2/auth/profile/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Profile request successful:', data);
    } else {
      console.error('❌ Profile request failed:', response.status, data);
    }
    
    return data;
  } catch (error) {
    console.error('💥 Profile request error:', error);
    return null;
  }
};

// Test complete flow
window.testCompleteFlow = async function() {
  console.log('🔄 Testing Complete Authentication Flow...');
  
  // 1. Check initial state
  window.checkAuthStatus();
  
  // 2. Clear any existing tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  console.log('🧹 Cleared existing tokens');
  
  // 3. Test login
  const loginResult = await window.testLogin();
  if (!loginResult) {
    console.error('❌ Login failed, stopping test');
    return;
  }
  
  // 4. Check auth status after login
  window.checkAuthStatus();
  
  // 5. Test authenticated request
  await window.testAuthenticatedRequest();
  
  console.log('🎉 Complete flow test finished');
};

// Display available test functions
console.log('🎮 Available test functions:');
console.log('- window.checkAuthStatus() - Check current auth status');
console.log('- window.testLogin() - Test login with demo credentials');
console.log('- window.testLogin("username", "password") - Test login with custom credentials');
console.log('- window.testRegistration() - Test registration with random user');
console.log('- window.testAuthenticatedRequest() - Test profile request');
console.log('- window.testCompleteFlow() - Run complete test sequence');

console.log('✅ Authentication test functions loaded. Try running window.testCompleteFlow()');