const fetch = require('node-fetch');

async function testLoginEndpoint() {
  try {
    console.log('Testing login endpoint...\n');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'prof@test.com',
        password: 'Prof123!'
      })
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login successful!');
    } else {
      console.log('\n❌ Login failed!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLoginEndpoint();
