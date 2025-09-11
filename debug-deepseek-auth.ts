// Debug script for DeepSeek authentication issues
// This will help us understand what's happening with the token

export async function debugDeepSeekAuth() {
  console.log('🔍 DeepSeek Authentication Debug Started...');
  
  // 1. Check localStorage tokens
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  console.log('📦 Token Storage Status:', {
    hasAccess: !!accessToken,
    hasRefresh: !!refreshToken,
    accessLength: accessToken?.length,
    accessPreview: accessToken?.substring(0, 30) + '...',
    refreshLength: refreshToken?.length,
    refreshPreview: refreshToken?.substring(0, 30) + '...'
  });
  
  // 2. Test Django authentication endpoint
  console.log('🧪 Testing Django auth endpoint...');
  try {
    const authTestResponse = await fetch('http://127.0.0.1:8000/api/v2/auth/profile/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Auth endpoint response:', {
      status: authTestResponse.status,
      statusText: authTestResponse.statusText,
      headers: Object.fromEntries(authTestResponse.headers.entries())
    });
    
    if (authTestResponse.ok) {
      const authData = await authTestResponse.json();
      console.log('👤 User profile:', authData);
    } else {
      const errorText = await authTestResponse.text();
      console.error('❌ Auth endpoint error:', errorText);
    }
  } catch (error) {
    console.error('❌ Auth endpoint failed:', error);
  }
  
  // 3. Test the specific SSE endpoint that's failing
  console.log('🧪 Testing SSE chat endpoint...');
  try {
    const sseTestPayload = {
      messages: [{ role: 'user', content: 'Hello test' }],
      model: 'deepseek-chat',
      stream: true,
      temperature: 0.7,
      max_tokens: 100
    };
    
    const sseResponse = await fetch('http://127.0.0.1:8000/api/v2/chat/completions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'text/event-stream, application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(sseTestPayload)
    });
    
    console.log('🎯 SSE endpoint response:', {
      status: sseResponse.status,
      statusText: sseResponse.statusText,
      headers: Object.fromEntries(sseResponse.headers.entries()),
      contentType: sseResponse.headers.get('content-type')
    });
    
    if (!sseResponse.ok) {
      const errorText = await sseResponse.text();
      console.error('❌ SSE endpoint error:', errorText);
      
      // Try to parse as JSON if possible
      try {
        const errorJson = JSON.parse(errorText);
        console.error('📄 Parsed error:', errorJson);
      } catch {
        console.error('📄 Raw error text:', errorText);
      }
    } else {
      console.log('✅ SSE endpoint working!');
    }
  } catch (error) {
    console.error('❌ SSE endpoint failed:', error);
  }
  
  // 4. Test different authorization header formats
  console.log('🧪 Testing different auth header formats...');
  
  if (!accessToken) {
    console.log('⚠️ No access token available for format testing');
    return;
  }
  
  const authFormats = [
    `Bearer ${accessToken}`,
    `Token ${accessToken}`,
    `JWT ${accessToken}`,
    accessToken // Raw token
  ];
  
  for (const authHeader of authFormats) {
    try {
      const formatResponse = await fetch('http://127.0.0.1:8000/api/v2/auth/profile/', {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`📋 Auth format "${authHeader.split(' ')[0] || 'Raw'}" result:`, {
        status: formatResponse.status,
        ok: formatResponse.ok
      });
    } catch (error) {
      console.error(`❌ Auth format "${authHeader.split(' ')[0] || 'Raw'}" failed:`, error);
    }
  }
  
  console.log('🔍 Debug completed!');
  
  return {
    hasTokens: !!accessToken,
    authEndpointWorking: false, // Will be updated by the actual tests
    sseEndpointWorking: false   // Will be updated by the actual tests
  };
}

// Auto-run if window is available
if (typeof window !== 'undefined') {
  // Add to window for manual testing
  (window as typeof window & { debugDeepSeekAuth: typeof debugDeepSeekAuth }).debugDeepSeekAuth = debugDeepSeekAuth;
  
  // Auto-run after a short delay to ensure tokens are loaded
  setTimeout(() => {
    if (localStorage.getItem('access_token')) {
      debugDeepSeekAuth();
    } else {
      console.log('⏳ No access token found, skipping debug. Please login first.');
    }
  }, 2000);
}
