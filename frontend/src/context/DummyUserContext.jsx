import React, { createContext, useContext, useMemo } from 'react';

// Dummy user data mirroring the sign-up fields from LoginPage
// Student: email, password, faculty, yearOfStudy
// Professor: email, password, faculty, subjects (array of strings)

const DummyUserContext = createContext(null);

export function DummyUserProvider({ children }) {
  const studentUser = useMemo(() => ({
    role: 'student',
    email: 'student@example.com',
    password: 'Password123!',
    faculty: 'Computer Science',
    yearOfStudy: 'year3', // 'year1' | 'year2' | 'year3' | 'supplementary'
    profile: {
      firstName: 'Alex',
      lastName: 'Student',
    },
  }), []);

  const professorUser = useMemo(() => ({
    role: 'professor',
    email: 'prof@example.com',
    password: 'Password123!',
    faculty: 'Computer Science',
    subjects: ['Machine Learning', 'Data Structures'],
    profile: {
      firstName: 'Pat',
      lastName: 'Professor',
    },
  }), []);

  const value = useMemo(() => ({ studentUser, professorUser }), [studentUser, professorUser]);

  return (
    <DummyUserContext.Provider value={value}>
      {children}
    </DummyUserContext.Provider>
  );
}

export function useDummyUsers() {
  const ctx = useContext(DummyUserContext);
  if (!ctx) throw new Error('useDummyUsers must be used within a DummyUserProvider');
  return ctx;
}

export default DummyUserContext;
