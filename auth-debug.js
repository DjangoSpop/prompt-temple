/**
 * Authentication Flow Test
 * 
 * This script can be run in the browser console to test the authentication flow
 * and debug the "user None" issue.
 */

// Test the authentication flow
async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...');
  
  try {
    // Import the auth adapter
    const { auth } = await import('/src/lib/auth.ts');
    
    console.log('📋 Initial auth status:');
    auth.debugAuthStatus();
    
    // Test credentials (replace with actual test credentials)
    const testCredentials = {
      username: 'testuser', // Replace with actual username
      password: 'testpass'  // Replace with actual password
    };
    
    console.log('🔐 Attempting login...');
    const loginResult = await auth.login(testCredentials);
    
    console.log('✅ Login successful:', {
      user: loginResult.user.username,
      hasTokens: !!(loginResult.access && loginResult.refresh)
    });
    
    console.log('📋 Auth status after login:');
    auth.debugAuthStatus();
    
    // Test an authenticated request
    console.log('🧪 Testing authenticated request...');
    const profile = await auth.getProfile();
    
    console.log('✅ Profile request successful:', {
      username: profile.username,
      id: profile.id
    });
    
    console.log('🎉 Authentication flow test completed successfully!');
    
    return {
      success: true,
      user: profile,
      tokens: {
        access: loginResult.access,
        refresh: loginResult.refresh
      }
    };
    
  } catch (error) {
    console.error('❌ Authentication flow test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test function to verify token persistence
function testTokenPersistence() {
  console.log('🧪 Testing Token Persistence...');
  
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  console.log('📋 Tokens in localStorage:', {
    hasAccess: !!accessToken,
    hasRefresh: !!refreshToken,
    accessLength: accessToken?.length,
    refreshLength: refreshToken?.length
  });
  
  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      
      console.log('🔍 Token analysis:', {
        isExpired,
        expiresAt: new Date(payload.exp * 1000).toISOString(),
        timeLeft: payload.exp - currentTime + ' seconds'
      });
    } catch (error) {
      console.error('❌ Token parsing failed:', error);
    }
  }
}

// Debug function to check API request headers
function debugAPIHeaders() {
  console.log('🧪 Debug: Intercepting next API request...');
  
  // This would need to be called after importing the auth service
  // to inspect the actual headers being sent
}

// Export functions for browser console usage
if (typeof window !== 'undefined') {
  window.testAuthFlow = testAuthFlow;
  window.testTokenPersistence = testTokenPersistence;
  window.debugAPIHeaders = debugAPIHeaders;
  
  console.log('🎯 Auth debug functions loaded:');
  console.log('- window.testAuthFlow()');
  console.log('- window.testTokenPersistence()');
  console.log('- window.debugAPIHeaders()');
}