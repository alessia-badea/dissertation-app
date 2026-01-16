const { Request, User } = require('./models');

async function updateSarahRequest() {
  try {
    console.log('Updating Sarah\'s request with thesis details...\n');

    // Find Sarah
    const sarah = await User.findOne({ where: { email: 'sarah@test.com' } });
    
    if (!sarah) {
      console.log('❌ Sarah not found');
      process.exit(1);
    }

    // Find her approved request
    const request = await Request.findOne({
      where: {
        studentId: sarah.id,
        status: 'approved'
      }
    });

    if (!request) {
      console.log('❌ No approved request found for Sarah');
      process.exit(1);
    }

    // Update with thesis details
    request.thesisTitle = 'Machine Learning Applications in Healthcare Diagnostics';
    request.thesisDescription = 'This research explores the application of deep learning algorithms for early disease detection in medical imaging. The study focuses on developing a convolutional neural network model that can accurately identify patterns in X-ray and MRI scans to assist radiologists in diagnosing conditions such as pneumonia, tumors, and fractures. The methodology includes data collection from public medical imaging datasets, preprocessing techniques, model training using transfer learning, and validation against expert diagnoses. Expected outcomes include improved diagnostic accuracy, reduced analysis time, and a framework for integrating AI-assisted diagnostics into clinical workflows.';
    
    await request.save();

    console.log('✅ Updated Sarah\'s request:');
    console.log(`   Title: ${request.thesisTitle}`);
    console.log(`   Description: ${request.thesisDescription.substring(0, 100)}...`);
    console.log('\n✨ Done!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateSarahRequest();
