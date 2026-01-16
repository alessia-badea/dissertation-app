const { Session, User } = require('./models');

async function checkSessions() {
  try {
    const sessions = await Session.findAll({
      include: [
        {
          model: User,
          as: 'professor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    console.log('\n=== SESSIONS IN DATABASE ===');
    console.log(`Total sessions: ${sessions.length}\n`);
    
    sessions.forEach(session => {
      console.log(`ID: ${session.id}`);
      console.log(`Title: ${session.title}`);
      console.log(`Professor: ${session.professor?.name || 'N/A'}`);
      console.log(`Start: ${session.startDate}`);
      console.log(`End: ${session.endDate}`);
      console.log(`Max Students: ${session.maxStudents}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSessions();
