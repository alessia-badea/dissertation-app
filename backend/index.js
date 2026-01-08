const http = require('http');
const { handleAuth } = require('../routes/auth');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/auth')) {
    return handleAuth(req, res); // delegate to auth module
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

server.listen(3000, () => console.log('Server on 3000'));
