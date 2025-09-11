// Test script to verify SSE Accept header fix
const testSSEConnection = async () => {
  const apiUrl = 'http://127.0.0.1:8000/api/v2/chat/completions/';
  
  console.log('🧪 Testing SSE connection with fixed headers...');
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream, application/json', // FIXED: Accept both formats
        'Authorization': 'Bearer dummy-token-for-test',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'deepseek-chat',
        stream: true,
        temperature: 0.7,
        max_tokens: 100
      })
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 406) {
      console.error('❌ Still getting 406 error - header fix not working');
    } else if (response.status === 401) {
      console.log('✅ Header fix working! Getting 401 (auth error) instead of 406');
    } else {
      console.log('✅ Header fix working! Response status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run test if called directly
if (typeof window === 'undefined' && require.main === module) {
  testSSEConnection();
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.testSSEConnection = testSSEConnection;
}
