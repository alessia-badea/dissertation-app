const { Request, User } = require('./models');

async function updateAllRequests() {
  try {
    console.log('🔄 Updating all requests with thesis details...\n');

    // Sample thesis data for different students
    const thesisData = {
      'emma@test.com': {
        title: 'Blockchain Technology in Supply Chain Management',
        description: 'This research investigates the implementation of blockchain technology to enhance transparency and traceability in supply chain operations. The study examines how distributed ledger technology can reduce fraud, improve efficiency, and create immutable records of product movement from manufacturer to consumer. The methodology includes case studies of existing blockchain implementations, development of a prototype system, and analysis of cost-benefit ratios. Expected outcomes include a framework for blockchain adoption in supply chains and recommendations for overcoming implementation challenges.'
      },
      'michael@test.com': {
        title: 'Natural Language Processing for Sentiment Analysis in Social Media',
        description: 'This dissertation explores advanced NLP techniques for analyzing sentiment in social media posts, focusing on detecting nuanced emotions beyond simple positive/negative classifications. The research involves developing a deep learning model using transformer architectures to understand context, sarcasm, and cultural references. Data will be collected from multiple social media platforms, and the model will be trained to identify emotions such as joy, anger, fear, and surprise. The study aims to improve brand monitoring and public opinion analysis tools.'
      },
      'sarah@test.com': {
        title: 'Machine Learning Applications in Healthcare Diagnostics',
        description: 'This research explores the application of deep learning algorithms for early disease detection in medical imaging. The study focuses on developing a convolutional neural network model that can accurately identify patterns in X-ray and MRI scans to assist radiologists in diagnosing conditions such as pneumonia, tumors, and fractures. The methodology includes data collection from public medical imaging datasets, preprocessing techniques, model training using transfer learning, and validation against expert diagnoses. Expected outcomes include improved diagnostic accuracy, reduced analysis time, and a framework for integrating AI-assisted diagnostics into clinical workflows.'
      },
      'david@test.com': {
        title: 'Cybersecurity Threat Detection Using Machine Learning',
        description: 'This research focuses on developing an intelligent intrusion detection system using machine learning algorithms to identify and prevent cyber attacks in real-time. The study examines various ML techniques including random forests, neural networks, and ensemble methods to detect anomalous network behavior. The methodology involves collecting network traffic data, feature engineering, model training, and performance evaluation against known attack patterns. Expected outcomes include a robust detection system with high accuracy and low false-positive rates, contributing to enhanced network security infrastructure.'
      },
      'lisa@test.com': {
        title: 'Cloud Computing Optimization for Resource Allocation',
        description: 'This dissertation investigates optimization algorithms for efficient resource allocation in cloud computing environments. The research focuses on developing intelligent scheduling mechanisms that balance workload distribution, minimize energy consumption, and reduce operational costs while maintaining quality of service. The methodology includes simulation of cloud environments, implementation of various optimization algorithms, and comparative analysis of performance metrics. Expected outcomes include a novel resource allocation framework that improves cloud infrastructure efficiency and provides guidelines for cloud service providers.'
      }
    };

    // Get all requests
    const requests = await Request.findAll({
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    console.log(`Found ${requests.length} requests to update\n`);

    let updated = 0;
    for (const request of requests) {
      // Skip if already has thesis data
      if (request.thesisTitle && request.thesisDescription) {
        console.log(`⏭️  Request #${request.id} already has thesis data`);
        continue;
      }

      const studentEmail = request.student?.email;
      const thesis = thesisData[studentEmail];

      if (thesis) {
        request.thesisTitle = thesis.title;
        request.thesisDescription = thesis.description;
        await request.save();
        console.log(`✅ Updated request #${request.id} for ${request.student.name}`);
        updated++;
      } else {
        // Generic thesis for unknown students
        request.thesisTitle = 'Research Proposal in Computer Science';
        request.thesisDescription = 'This research proposal outlines a comprehensive study in the field of computer science, focusing on innovative solutions to contemporary challenges. The methodology includes literature review, experimental design, data collection and analysis, and validation of results. Expected outcomes include contributions to the academic field and practical applications for industry.';
        await request.save();
        console.log(`✅ Updated request #${request.id} with generic thesis data`);
        updated++;
      }
    }

    console.log(`\n✨ Updated ${updated} requests successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAllRequests();
