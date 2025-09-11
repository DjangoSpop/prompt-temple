/**
 * Simple manual test of the Prompt Temple API integration
 * Run with: node test-integration.js
 */

const HEALTH_URL = 'https://api.prompt-temple.com/health/';
const TEMPLATES_URL = 'https://api.prompt-temple.com/api/v2/templates/';

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const response = await fetch(HEALTH_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Health Check: SUCCESS');
    console.log('📊 Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Health Check: FAILED');
    console.log('🚨 Error:', error.message);
  }
}

async function testTemplatesEndpoint() {
  console.log('\n📝 Testing Templates Endpoint...');
  try {
    const response = await fetch(`${TEMPLATES_URL}?page_size=5`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Templates Endpoint: SUCCESS');
    console.log('📊 Found templates:', data.count || 0);
    if (data.results && data.results.length > 0) {
      console.log('📋 First template:', {
        id: data.results[0].id,
        title: data.results[0].title,
        category: data.results[0].category?.name,
      });
    }
  } catch (error) {
    console.log('❌ Templates Endpoint: FAILED');
    console.log('🚨 Error:', error.message);
  }
}

async function testCORS() {
  console.log('\n🌐 Testing CORS Configuration...');
  try {
    const response = await fetch(HEALTH_URL, {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ CORS: SUCCESS (HEAD request worked)');
  } catch (error) {
    console.log('❌ CORS: FAILED');
    console.log('🚨 Error:', error.message);
  }
}

async function testOpenAPISchema() {
  console.log('\n📋 Testing OpenAPI Schema...');
  try {
    const response = await fetch('https://api.prompt-temple.com/api/schema/');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const schema = await response.json();
    console.log('✅ OpenAPI Schema: SUCCESS');
    console.log('📊 Schema info:', {
      openapi: schema.openapi,
      title: schema.info?.title,
      version: schema.info?.version,
      pathCount: Object.keys(schema.paths || {}).length,
    });
  } catch (error) {
    console.log('❌ OpenAPI Schema: FAILED');
    console.log('🚨 Error:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Prompt Temple API Integration Tests\n');
  console.log('=' * 50);
  
  await testHealthCheck();
  await testTemplatesEndpoint();
  await testCORS();
  await testOpenAPISchema();
  
  console.log('\n' + '=' * 50);
  console.log('🏁 Integration tests completed!');
}

// Check if running in Node.js environment
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runAllTests().catch(console.error);
} else {
  console.log('This test should be run in Node.js environment');
}