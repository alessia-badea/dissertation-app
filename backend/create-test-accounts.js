const { User, Session, Request } = require('./models');
const bcrypt = require('bcrypt');

async function createTestAccounts() {
  try {
    console.log('🌱 Creating test accounts and data...\n');

    // Create professor account
    console.log('👨‍🏫 Creating professor account...');
    let professor = await User.findOne({ where: { email: 'prof@test.com' } });
    
    if (!professor) {
      const hashedPassword = await bcrypt.hash('Prof123!', 10);
      professor = await User.create({
        email: 'prof@test.com',
        passwordHash: hashedPassword,
        role: 'professor',
        name: 'Dr. Sarah Mitchell',
        maxStudents: 5
      });
      console.log(`   ✅ Created: ${professor.name} (${professor.email})`);
    } else {
      console.log(`   ⏭️  Already exists: ${professor.name}`);
    }

    // Create a test session if none exists
    console.log('\n📅 Creating test session...');
    let session = await Session.findOne({ where: { professorId: professor.id } });
    
    if (!session) {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 5); // Started 5 days ago
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 25); // Ends in 25 days
      
      session = await Session.create({
        professorId: professor.id,
        title: `Registration Session ${startDate.toLocaleDateString()}`,
        startDate: startDate,
        endDate: endDate,
        maxStudents: 5
      });
      console.log(`   ✅ Created session: ${session.title}`);
    } else {
      console.log(`   ⏭️  Session already exists`);
    }

    // Create test students
    const studentData = [
      {
        name: 'Emma Johnson',
        email: 'emma@test.com',
        role: 'student'
      },
      {
        name: 'Michael Chen',
        email: 'michael@test.com',
        role: 'student'
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@test.com',
        role: 'student'
      },
      {
        name: 'David Brown',
        email: 'david@test.com',
        role: 'student'
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@test.com',
        role: 'student'
      }
    ];

    console.log('\n👥 Creating test students...');
    const students = [];
    
    for (const data of studentData) {
      let student = await User.findOne({ where: { email: data.email } });
      
      if (!student) {
        const hashedPassword = await bcrypt.hash('Student123!', 10);
        student = await User.create({
          ...data,
          passwordHash: hashedPassword
        });
        console.log(`   ✅ Created: ${student.name}`);
      } else {
        console.log(`   ⏭️  Already exists: ${student.name}`);
      }
      
      students.push(student);
    }

    console.log('\n📝 Creating test requests...');

    // Create 2 pending requests
    const pendingRequests = [
      {
        studentId: students[0].id,
        professorId: professor.id,
        sessionId: session.id,
        status: 'pending'
      },
      {
        studentId: students[1].id,
        professorId: professor.id,
        sessionId: session.id,
        status: 'pending'
      }
    ];

    for (const reqData of pendingRequests) {
      const existing = await Request.findOne({
        where: {
          studentId: reqData.studentId,
          sessionId: reqData.sessionId
        }
      });

      if (!existing) {
        await Request.create(reqData);
        const student = students.find(s => s.id === reqData.studentId);
        console.log(`   ✅ Pending request from: ${student.name}`);
      }
    }

    // Create 3 approved requests (current students)
    const approvedRequests = [
      {
        studentId: students[2].id,
        professorId: professor.id,
        sessionId: session.id,
        status: 'approved'
      },
      {
        studentId: students[3].id,
        professorId: professor.id,
        sessionId: session.id,
        status: 'approved',
        studentFilePath: '/uploads/david_brown_dissertation.pdf'
      },
      {
        studentId: students[4].id,
        professorId: professor.id,
        sessionId: session.id,
        status: 'approved',
        studentFilePath: '/uploads/lisa_anderson_dissertation.pdf',
        professorFilePath: '/uploads/lisa_anderson_signed.pdf'
      }
    ];

    for (const reqData of approvedRequests) {
      const existing = await Request.findOne({
        where: {
          studentId: reqData.studentId,
          sessionId: reqData.sessionId
        }
      });

      if (!existing) {
        await Request.create(reqData);
        const student = students.find(s => s.id === reqData.studentId);
        console.log(`   ✅ Approved request from: ${student.name}`);
      }
    }

    console.log('\n✨ Test accounts and data created!\n');
    console.log('═══════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════');
    console.log(`Students: ${students.length}`);
    console.log(`Pending requests: ${pendingRequests.length}`);
    console.log(`Approved requests: ${approvedRequests.length}`);
    console.log('\n═══════════════════════════════════════════');
    console.log('🔑 TEST CREDENTIALS');
    console.log('═══════════════════════════════════════════');
    console.log('\n👨‍🏫 PROFESSOR:');
    console.log('   Email:    prof@test.com');
    console.log('   Password: Prof123!');
    console.log('\n👨‍🎓 STUDENTS:');
    console.log('   Email:    emma@test.com');
    console.log('   Email:    michael@test.com');
    console.log('   Email:    sarah@test.com');
    console.log('   Email:    david@test.com');
    console.log('   Email:    lisa@test.com');
    console.log('   Password: Student123! (for all students)');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test accounts:', error);
    process.exit(1);
  }
}

createTestAccounts();
