// Test API Connection Script
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';

async function testEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  const tests = [
    {
      name: 'Health Check',
      url: `${API_BASE}/health`,
      method: 'GET'
    },
    {
      name: 'Get Exam Halls',
      url: `${API_BASE}/seating/halls`,
      method: 'GET'
    },
    {
      name: 'Get Exams',
      url: `${API_BASE}/exams`,
      method: 'GET'
    },
    {
      name: 'Get Hall Layout',
      url: `${API_BASE}/seating/halls/HALL-A/layout`,
      method: 'GET'
    },
    {
      name: 'Generate QR Codes',
      url: `${API_BASE}/seating/exams/exam-1/qr-codes`,
      method: 'GET'
    },
    {
      name: 'Get Analytics',
      url: `${API_BASE}/seating/exams/exam-1/analytics`,
      method: 'GET'
    },
    {
      name: 'Get Live Occupancy',
      url: `${API_BASE}/seating/exams/exam-1/live-occupancy`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name}: SUCCESS`);
        if (data.results) {
          console.log(`   📊 Results: ${data.results} items`);
        }
      } else {
        console.log(`❌ ${test.name}: FAILED (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 API Testing Complete!');
}

testEndpoints();