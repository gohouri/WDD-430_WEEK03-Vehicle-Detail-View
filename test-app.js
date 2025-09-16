const http = require('http');

// Test the application endpoints
const testEndpoints = [
    { url: 'http://localhost:3000/', description: 'Home page' },
    { url: 'http://localhost:3000/inventory/classification/1', description: 'SUV classification' },
    { url: 'http://localhost:3000/inventory/classification/2', description: 'Sedan classification' },
    { url: 'http://localhost:3000/inventory/detail/1', description: 'Vehicle detail (Nissan Sentra)' },
    { url: 'http://localhost:3000/inventory/detail/2', description: 'Vehicle detail (Honda CR-V)' },
    { url: 'http://localhost:3000/inventory/detail/999', description: 'Non-existent vehicle (404 test)' },
    { url: 'http://localhost:3000/error/trigger', description: 'Intentional error (500 test)' }
];

async function testEndpoint(url, description) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            console.log(`✅ ${description}: ${res.statusCode} ${res.statusMessage}`);
            resolve({ success: true, status: res.statusCode, description });
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${description}: Error - ${err.message}`);
            resolve({ success: false, error: err.message, description });
        });
        
        req.setTimeout(5000, () => {
            console.log(`⏰ ${description}: Timeout`);
            req.destroy();
            resolve({ success: false, error: 'Timeout', description });
        });
    });
}

async function runTests() {
    console.log('🚀 Testing Vehicle Detail View Application...\n');
    
    const results = [];
    for (const endpoint of testEndpoints) {
        const result = await testEndpoint(endpoint.url, endpoint.description);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
    }
    
    console.log('\n📊 Test Results Summary:');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
        console.log('\n❌ Failed tests:');
        results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.description}: ${r.error}`);
        });
    }
    
    console.log('\n🎉 Testing complete!');
}

runTests().catch(console.error);
