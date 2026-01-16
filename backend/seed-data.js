const { User, Session, Request } = require('./models');
const bcrypt = require('bcrypt');

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Get the first professor (assuming you're logged in as one)
    const professor = await User.findOne({ where: { role: 'professor' } });
    
    if (!professor) {
      console.error('❌ No professor found. Please create a professor account first.');
      process.exit(1);
    }

    console.log(`✅ Found professor: ${professor.name} (${professor.email})`);

    // Get professor's sessions
    const sessions = await Session.findAll({ where: { professorId: professor.id } });
    
    if (sessions.length === 0) {
      console.error('❌ No sessions found. Please create at least one session first.');
      process.exit(1);
    }

    console.log(`✅ Found ${sessions.length} session(s)\n`);

    // Create test students
    const studentData = [
      {
        name: 'Emma Johnson',
        email: 'emma.johnson@student.com',
        role: 'student'
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@student.com',
        role: 'student'
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.williams@student.com',
        role: 'student'
      },
      {
        name: 'David Brown',
        email: 'david.brown@student.com',
        role: 'student'
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@student.com',
        role: 'student'
      }
    ];

    console.log('👥 Creating test students...');
    const students = [];
    
    for (const data of studentData) {
      // Check if student already exists
      let student = await User.findOne({ where: { email: data.email } });
      
      if (!student) {
        const hashedPassword = await bcrypt.hash('password123', 10);
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

    // Create some pending requests (for the first session)
    const pendingRequests = [
      {
        studentId: students[0].id,
        professorId: professor.id,
        sessionId: sessions[0].id,
        status: 'pending'
      },
      {
        studentId: students[1].id,
        professorId: professor.id,
        sessionId: sessions[0].id,
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
        console.log(`   ✅ Pending request: ${student.name}`);
      } else {
        console.log(`   ⏭️  Request already exists for student ${reqData.studentId}`);
      }
    }

    // Create some approved requests (current students)
    const approvedRequests = [
      {
        studentId: students[2].id,
        professorId: professor.id,
        sessionId: sessions[0].id,
        status: 'approved'
      },
      {
        studentId: students[3].id,
        professorId: professor.id,
        sessionId: sessions[0].id,
        status: 'approved',
        studentFilePath: '/uploads/david_brown_dissertation.pdf' // Simulating uploaded document
      },
      {
        studentId: students[4].id,
        professorId: professor.id,
        sessionId: sessions[0].id,
        status: 'approved',
        studentFilePath: '/uploads/lisa_anderson_dissertation.pdf',
        professorFilePath: '/uploads/lisa_anderson_signed.pdf' // Completed
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
        console.log(`   ✅ Approved request: ${student.name}`);
      } else {
        console.log(`   ⏭️  Request already exists for student ${reqData.studentId}`);
      }
    }

    console.log('\n✨ Database seeding completed!\n');
    console.log('📊 Summary:');
    console.log(`   - Students created: ${students.length}`);
    console.log(`   - Pending requests: ${pendingRequests.length}`);
    console.log(`   - Approved requests: ${approvedRequests.length}`);
    console.log('\n🔑 Test student credentials:');
    console.log('   Email: emma.johnson@student.com');
    console.log('   Password: password123');
    console.log('   (Same password for all test students)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
