const sequelize = require('./config/database');

async function addThesisFields() {
  try {
    console.log('Adding thesis fields to Requests table...');
    
    await sequelize.query(`
      ALTER TABLE Requests ADD COLUMN thesisTitle VARCHAR(200);
    `);
    console.log('✅ Added thesisTitle column');
    
    await sequelize.query(`
      ALTER TABLE Requests ADD COLUMN thesisDescription TEXT;
    `);
    console.log('✅ Added thesisDescription column');
    
    console.log('\n✨ Thesis fields added successfully!');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log('⏭️  Columns already exist');
      process.exit(0);
    }
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addThesisFields();
