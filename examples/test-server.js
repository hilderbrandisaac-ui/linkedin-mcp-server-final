#!/usr/bin/env node
/**
 * Simple test script for the LinkedIn MCP Server
 * Run with: node examples/test-server.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing LinkedIn MCP Server');
console.log('================================\n');

// Load test requests
const testRequestsPath = path.join(__dirname, 'test-requests.json');
let testRequests;

try {
    testRequests = JSON.parse(fs.readFileSync(testRequestsPath, 'utf8'));
    console.log('✅ Test requests loaded');
} catch (error) {
    console.error('❌ Failed to load test requests:', error.message);
    process.exit(1);
}

// Display available tests
console.log('\n📋 Available tests:');
Object.keys(testRequests).forEach(testName => {
    console.log('  - ' + testName);
});

console.log('\n💡 To test your server:');
console.log('1. Start your MCP server');
console.log('2. Use the requests in test-requests.json with curl or Postman');
console.log('3. Example:');
console.log('   curl -X POST http://localhost:8000/mcp \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'+ JSON.stringify(testRequests.get_profile.body) + '\'');
console.log('\n🚀 Happy testing!');