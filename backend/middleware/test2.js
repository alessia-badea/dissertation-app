app.get('/login', (req, res) => {
  req.session.user = 'admin';
  res.send('Sesiune creată');
});

app.get('/profile', (req, res) => {
  res.send(req.session.user || 'Neautentificat');
});
