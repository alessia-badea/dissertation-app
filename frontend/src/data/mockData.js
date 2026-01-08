// Mock data for development - will be replaced with API calls later

export const mockProfessors = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    initials: 'SM',
    subjects: ['Machine Learning', 'Artificial Intelligence'],
    availableSlots: 3,
    totalSlots: 5
  },
  {
    id: 2,
    name: 'Prof. James Anderson',
    initials: 'JA',
    subjects: ['Software Engineering', 'Web Development'],
    availableSlots: 5,
    totalSlots: 5
  },
  {
    id: 3,
    name: 'Dr. Emily Chen',
    initials: 'EC',
    subjects: ['Data Science', 'Big Data Analytics'],
    availableSlots: 2,
    totalSlots: 5
  },
  {
    id: 4,
    name: 'Prof. Michael Brown',
    initials: 'MB',
    subjects: ['Cybersecurity', 'Network Security'],
    availableSlots: 4,
    totalSlots: 5
  },
  {
    id: 5,
    name: 'Dr. Lisa Williams',
    initials: 'LW',
    subjects: ['Cloud Computing', 'Distributed Systems'],
    availableSlots: 1,
    totalSlots: 5
  }
];

export const mockStudentRequests = [
  {
    id: 1,
    name: 'Emma Johnson',
    initials: 'EJ',
    thesisTitle: 'Machine Learning Applications in Healthcare Diagnostics',
    faculty: 'Computer Science',
    year: 'Year 3',
    submittedDate: '2 days ago'
  },
  {
    id: 2,
    name: 'Michael Chen',
    initials: 'MC',
    thesisTitle: 'Blockchain Technology for Supply Chain Management',
    faculty: 'Computer Science',
    year: 'Year 3',
    submittedDate: '5 days ago'
  },
  {
    id: 3,
    name: 'Sarah Williams',
    initials: 'SW',
    thesisTitle: 'Natural Language Processing for Sentiment Analysis',
    faculty: 'Computer Science',
    year: 'Year 3',
    submittedDate: '1 week ago'
  }
];

export const mockCurrentStudents = [
  {
    id: 4,
    name: 'David Brown',
    initials: 'DB',
    thesisTitle: 'Deep Learning for Image Recognition in Medical Imaging',
    faculty: 'Computer Science',
    year: 'Year 3',
    startedDate: '2 months ago'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    initials: 'LA',
    thesisTitle: 'Cybersecurity Frameworks for IoT Devices',
    faculty: 'Computer Science',
    year: 'Year 3',
    startedDate: '3 months ago'
  }
];

export const mockAnnouncements = [
  {
    id: 1,
    title: 'Application Period Open',
    date: '2 days ago',
    text: 'The dissertation application period is now open. Submit your applications before the deadline on March 31st.'
  },
  {
    id: 2,
    title: 'New Coordinators Available',
    date: '1 week ago',
    text: 'Several new coordinators have joined the platform. Check out their profiles and research interests.'
  }
];
