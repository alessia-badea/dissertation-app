const { User, Session } = require('./models');
const bcrypt = require('bcrypt');

async function addMoreProfessors() {
  try {
    console.log('🌱 Adding more professors and sessions...\n');

    // Create additional professors
    const professorsData = [
      {
        name: 'Prof. James Anderson',
        email: 'james.anderson@test.com',
        role: 'professor',
        maxStudents: 5
      },
      {
        name: 'Dr. Emily Chen',
        email: 'emily.chen@test.com',
        role: 'professor',
        maxStudents: 4
      },
      {
        name: 'Prof. Michael Brown',
        email: 'michael.brown@test.com',
        role: 'professor',
        maxStudents: 6
      },
      {
        name: 'Dr. Lisa Williams',
        email: 'lisa.williams@test.com',
        role: 'professor',
        maxStudents: 3
      }
    ];

    console.log('👨‍🏫 Creating professors...');
    const professors = [];
    
    for (const data of professorsData) {
      let professor = await User.findOne({ where: { email: data.email } });
      
      if (!professor) {
        const hashedPassword = await bcrypt.hash('Prof123!', 10);
        professor = await User.create({
          ...data,
          passwordHash: hashedPassword
        });
        console.log(`   ✅ Created: ${professor.name}`);
      } else {
        console.log(`   ⏭️  Already exists: ${professor.name}`);
      }
      
      professors.push(professor);
    }

    // Create active sessions for each professor
    console.log('\n📅 Creating active sessions...');
    
    const today = new Date();
    
    // Session 1: James Anderson - Started 5 days ago, ends in 20 days
    const session1Start = new Date(today);
    session1Start.setDate(today.getDate() - 5);
    const session1End = new Date(today);
    session1End.setDate(today.getDate() + 20);
    
    let session1 = await Session.findOne({ 
      where: { 
        professorId: professors[0].id,
        title: `Registration Session ${session1Start.toLocaleDateString()}`
      } 
    });
    
    if (!session1) {
      session1 = await Session.create({
        professorId: professors[0].id,
        title: `Registration Session ${session1Start.toLocaleDateString()}`,
        startDate: session1Start,
        endDate: session1End,
        maxStudents: professors[0].maxStudents
      });
      console.log(`   ✅ ${professors[0].name}: ${session1Start.toLocaleDateString()} - ${session1End.toLocaleDateString()}`);
    }

    // Session 2: Emily Chen - Started today, ends in 30 days
    const session2Start = new Date(today);
    const session2End = new Date(today);
    session2End.setDate(today.getDate() + 30);
    
    let session2 = await Session.findOne({ 
      where: { 
        professorId: professors[1].id,
        title: `Registration Session ${session2Start.toLocaleDateString()}`
      } 
    });
    
    if (!session2) {
      session2 = await Session.create({
        professorId: professors[1].id,
        title: `Registration Session ${session2Start.toLocaleDateString()}`,
        startDate: session2Start,
        endDate: session2End,
        maxStudents: professors[1].maxStudents
      });
      console.log(`   ✅ ${professors[1].name}: ${session2Start.toLocaleDateString()} - ${session2End.toLocaleDateString()}`);
    }

    // Session 3: Michael Brown - Started 10 days ago, ends in 15 days
    const session3Start = new Date(today);
    session3Start.setDate(today.getDate() - 10);
    const session3End = new Date(today);
    session3End.setDate(today.getDate() + 15);
    
    let session3 = await Session.findOne({ 
      where: { 
        professorId: professors[2].id,
        title: `Registration Session ${session3Start.toLocaleDateString()}`
      } 
    });
    
    if (!session3) {
      session3 = await Session.create({
        professorId: professors[2].id,
        title: `Registration Session ${session3Start.toLocaleDateString()}`,
        startDate: session3Start,
        endDate: session3End,
        maxStudents: professors[2].maxStudents
      });
      console.log(`   ✅ ${professors[2].name}: ${session3Start.toLocaleDateString()} - ${session3End.toLocaleDateString()}`);
    }

    // Session 4: Lisa Williams - Started 3 days ago, ends in 10 days
    const session4Start = new Date(today);
    session4Start.setDate(today.getDate() - 3);
    const session4End = new Date(today);
    session4End.setDate(today.getDate() + 10);
    
    let session4 = await Session.findOne({ 
      where: { 
        professorId: professors[3].id,
        title: `Registration Session ${session4Start.toLocaleDateString()}`
      } 
    });
    
    if (!session4) {
      session4 = await Session.create({
        professorId: professors[3].id,
        title: `Registration Session ${session4Start.toLocaleDateString()}`,
        startDate: session4Start,
        endDate: session4End,
        maxStudents: professors[3].maxStudents
      });
      console.log(`   ✅ ${professors[3].name}: ${session4Start.toLocaleDateString()} - ${session4End.toLocaleDateString()}`);
    }

    console.log('\n✨ Additional professors and sessions created!\n');
    console.log('═══════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════');
    console.log(`Professors: ${professors.length}`);
    console.log(`Active Sessions: 4`);
    console.log('\n═══════════════════════════════════════════');
    console.log('🔑 PROFESSOR CREDENTIALS');
    console.log('═══════════════════════════════════════════');
    professors.forEach(prof => {
      console.log(`\n${prof.name}:`);
      console.log(`   Email:    ${prof.email}`);
      console.log(`   Password: Prof123!`);
    });
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMoreProfessors();
