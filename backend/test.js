const sequelize = require('./config/database');
const User = require('./models/User');

(async () => {
  console.log("test.js started");

  try {
    // Test conexiune
    await sequelize.authenticate();
    console.log('✓ Conexiune reușită!');

    // Sincronizare tabel (creează tabelul dacă nu există)
    await sequelize.sync({ force: false });
    console.log('✓ Tabele sincronizate');

    // Creează un user test
    const newUser = await User.create({
      name: 'Ana Popescu',
      email: 'ana@email.com',
      passwordHash: 'hashed_password_here',
      role: 'student'
    });
    console.log('✓ User creat:', newUser.toJSON());

    // Afișează toți userii
    const users = await User.findAll();
    console.log('✓ Toți userii:', users.map(u => u.toJSON()));

  } catch (error) {
    console.error('✗ Eroare la conectare sau CRUD:', error.message);
  } finally {
    await sequelize.close();
    console.log('Conexiunea DB închisă');
  }
})();
