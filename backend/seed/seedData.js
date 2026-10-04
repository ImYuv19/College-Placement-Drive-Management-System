/**
 * Seed Data Script
 * 
 * Creates demo data for the College Placement Drive Management System.
 * 
 * This script populates the database with:
 * - 3 batches (2024-25, 2025-26, 2026-27)
 * - 1 College Management account
 * - 1 Placement Officer account
 * - 43 dummy students with varied CGPAs
 * - 5 companies
 * - 6 placement drives
 * - Some sample applications
 * 
 * DEMO CREDENTIALS:
 * Student:    username: student001, password: Student@123
 * Officer:    username: placement.officer, password: Officer@123
 * Management: username: college.admin, password: Admin@123
 * 
 * Usage: node seed/seedData.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
const User = require('../models/User');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const Batch = require('../models/Batch');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await Drive.deleteMany({});
    await Application.deleteMany({});
    await Batch.deleteMany({});

    // =============================================
    // 1. CREATE BATCHES
    // =============================================
    console.log('📦 Creating batches...');
    const batches = await Batch.create([
      { name: '2024-25', isActive: false },
      { name: '2025-26', isActive: false },
      { name: '2026-27', isActive: true }
    ]);
    console.log(`   Created ${batches.length} batches`);

    const activeBatch = batches[2]; // 2026-27
    const olderBatch = batches[1]; // 2025-26

    // =============================================
    // 2. CREATE MANAGEMENT ACCOUNT
    // =============================================
    console.log('👔 Creating management account...');
    const management = await User.create({
      name: 'Dr. Rajesh Kumar',
      username: 'college.admin',
      mobile: '9876543210',
      password: 'Admin@123',
      role: 'management',
      isActive: true
    });
    console.log(`   Management: college.admin / Admin@123`);

    // =============================================
    // 3. CREATE OFFICER ACCOUNT
    // =============================================
    console.log('👨‍💼 Creating placement officer account...');
    const officer = await User.create({
      name: 'Prof. Anita Sharma',
      username: 'placement.officer',
      mobile: '9876543211',
      password: 'Officer@123',
      role: 'officer',
      isActive: true
    });
    console.log(`   Officer: placement.officer / Officer@123`);

    // =============================================
    // 4. CREATE 43 STUDENTS
    // =============================================
    console.log('🎓 Creating 43 students...');

    const studentData = [
      // Students with HIGH CGPA (8.0 - 10.0) — will be eligible for most drives
      { name: 'Aarav Patel', studentId: 'CSE2027001', username: 'student001', mobile: '9000000001', cgpa: 9.5, batch: activeBatch._id },
      { name: 'Vivaan Sharma', studentId: 'CSE2027002', username: 'student002', mobile: '9000000002', cgpa: 9.2, batch: activeBatch._id },
      { name: 'Aditya Singh', studentId: 'CSE2027003', username: 'student003', mobile: '9000000003', cgpa: 9.0, batch: activeBatch._id },
      { name: 'Vihaan Gupta', studentId: 'CSE2027004', username: 'student004', mobile: '9000000004', cgpa: 8.8, batch: activeBatch._id },
      { name: 'Arjun Reddy', studentId: 'CSE2027005', username: 'student005', mobile: '9000000005', cgpa: 8.6, batch: activeBatch._id },
      { name: 'Sai Krishna', studentId: 'CSE2027006', username: 'student006', mobile: '9000000006', cgpa: 8.5, batch: activeBatch._id },
      { name: 'Reyansh Joshi', studentId: 'CSE2027007', username: 'student007', mobile: '9000000007', cgpa: 8.3, batch: activeBatch._id },
      { name: 'Ayaan Verma', studentId: 'CSE2027008', username: 'student008', mobile: '9000000008', cgpa: 8.1, batch: activeBatch._id },
      { name: 'Krishna Iyer', studentId: 'CSE2027009', username: 'student009', mobile: '9000000009', cgpa: 8.0, batch: activeBatch._id },
      { name: 'Ishaan Malik', studentId: 'CSE2027010', username: 'student010', mobile: '9000000010', cgpa: 8.0, batch: activeBatch._id },

      // Students with MEDIUM-HIGH CGPA (7.0 - 7.9) — eligible for most but not top-tier drives
      { name: 'Kabir Choudhury', studentId: 'CSE2027011', username: 'student011', mobile: '9000000011', cgpa: 7.8, batch: activeBatch._id },
      { name: 'Shaurya Das', studentId: 'CSE2027012', username: 'student012', mobile: '9000000012', cgpa: 7.6, batch: activeBatch._id },
      { name: 'Atharv Nair', studentId: 'CSE2027013', username: 'student013', mobile: '9000000013', cgpa: 7.5, batch: activeBatch._id },
      { name: 'Dhruv Saxena', studentId: 'CSE2027014', username: 'student014', mobile: '9000000014', cgpa: 7.3, batch: activeBatch._id },
      { name: 'Advait Tiwari', studentId: 'CSE2027015', username: 'student015', mobile: '9000000015', cgpa: 7.2, batch: activeBatch._id },
      { name: 'Pranav Mishra', studentId: 'CSE2027016', username: 'student016', mobile: '9000000016', cgpa: 7.0, batch: activeBatch._id },
      { name: 'Rudra Pandey', studentId: 'CSE2027017', username: 'student017', mobile: '9000000017', cgpa: 7.0, batch: activeBatch._id },

      // Students with MEDIUM CGPA (6.0 - 6.9) — eligible for some drives, not all
      { name: 'Arnav Kulkarni', studentId: 'CSE2027018', username: 'student018', mobile: '9000000018', cgpa: 6.8, batch: activeBatch._id },
      { name: 'Rohan Mehta', studentId: 'CSE2027019', username: 'student019', mobile: '9000000019', cgpa: 6.7, batch: activeBatch._id },
      { name: 'Daksh Agarwal', studentId: 'CSE2027020', username: 'student020', mobile: '9000000020', cgpa: 6.5, batch: activeBatch._id },
      { name: 'Parth Chauhan', studentId: 'CSE2027021', username: 'student021', mobile: '9000000021', cgpa: 6.4, batch: activeBatch._id },
      { name: 'Kian Bhatia', studentId: 'CSE2027022', username: 'student022', mobile: '9000000022', cgpa: 6.2, batch: activeBatch._id },
      { name: 'Yash Rastogi', studentId: 'CSE2027023', username: 'student023', mobile: '9000000023', cgpa: 6.0, batch: activeBatch._id },
      { name: 'Harsh Goyal', studentId: 'CSE2027024', username: 'student024', mobile: '9000000024', cgpa: 6.0, batch: activeBatch._id },

      // Students with LOWER CGPA (5.0 - 5.9) — will be ineligible for many drives
      { name: 'Tanish Srivastava', studentId: 'CSE2027025', username: 'student025', mobile: '9000000025', cgpa: 5.8, batch: activeBatch._id },
      { name: 'Shivansh Kapoor', studentId: 'CSE2027026', username: 'student026', mobile: '9000000026', cgpa: 5.6, batch: activeBatch._id },
      { name: 'Dev Menon', studentId: 'CSE2027027', username: 'student027', mobile: '9000000027', cgpa: 5.5, batch: activeBatch._id },
      { name: 'Aarush Jain', studentId: 'CSE2027028', username: 'student028', mobile: '9000000028', cgpa: 5.3, batch: activeBatch._id },
      { name: 'Vivek Rao', studentId: 'CSE2027029', username: 'student029', mobile: '9000000029', cgpa: 5.1, batch: activeBatch._id },
      { name: 'Manav Bajaj', studentId: 'CSE2027030', username: 'student030', mobile: '9000000030', cgpa: 5.0, batch: activeBatch._id },

      // More students to reach 43 — mixed CGPAs across both batches
      { name: 'Nikhil Bhatt', studentId: 'CSE2027031', username: 'student031', mobile: '9000000031', cgpa: 7.7, batch: activeBatch._id },
      { name: 'Sahil Dube', studentId: 'CSE2027032', username: 'student032', mobile: '9000000032', cgpa: 6.9, batch: activeBatch._id },
      { name: 'Kartik Rawat', studentId: 'CSE2027033', username: 'student033', mobile: '9000000033', cgpa: 8.4, batch: activeBatch._id },
      { name: 'Ansh Thakur', studentId: 'CSE2027034', username: 'student034', mobile: '9000000034', cgpa: 7.1, batch: activeBatch._id },
      { name: 'Laksh Mittal', studentId: 'CSE2027035', username: 'student035', mobile: '9000000035', cgpa: 5.9, batch: activeBatch._id },
      { name: 'Ritvik Sengupta', studentId: 'CSE2027036', username: 'student036', mobile: '9000000036', cgpa: 6.3, batch: activeBatch._id },
      { name: 'Mohit Bansal', studentId: 'CSE2027037', username: 'student037', mobile: '9000000037', cgpa: 9.1, batch: activeBatch._id },
      { name: 'Chirag Hegde', studentId: 'CSE2027038', username: 'student038', mobile: '9000000038', cgpa: 7.4, batch: activeBatch._id },

      // Some students in older batch (2025-26) — for testing batch features
      { name: 'Prateek Narayan', studentId: 'CSE2026039', username: 'student039', mobile: '9000000039', cgpa: 8.2, batch: olderBatch._id },
      { name: 'Siddharth Yadav', studentId: 'CSE2026040', username: 'student040', mobile: '9000000040', cgpa: 7.5, batch: olderBatch._id },
      { name: 'Abhishek Nanda', studentId: 'CSE2026041', username: 'student041', mobile: '9000000041', cgpa: 6.1, batch: olderBatch._id },
      { name: 'Varun Pillai', studentId: 'CSE2026042', username: 'student042', mobile: '9000000042', cgpa: 5.4, batch: olderBatch._id },
      { name: 'Rishi Ghosh', studentId: 'CSE2026043', username: 'student043', mobile: '9000000043', cgpa: 8.7, batch: olderBatch._id },
    ];

    const students = [];
    for (const s of studentData) {
      const student = await User.create({
        ...s,
        password: 'Student@123',
        role: 'student',
        isActive: true
      });
      students.push(student);
    }
    console.log(`   Created ${students.length} students`);

    // =============================================
    // 5. CREATE COMPANIES
    // =============================================
    console.log('🏢 Creating companies...');
    const companies = await Company.create([
      { name: 'Tata Consultancy Services', location: 'Mumbai, Maharashtra', description: 'TCS is a global leader in IT services, consulting, and business solutions.' },
      { name: 'Infosys Technologies', location: 'Bengaluru, Karnataka', description: 'Infosys is a global leader in next-generation digital services and consulting.' },
      { name: 'Wipro Limited', location: 'Bengaluru, Karnataka', description: 'Wipro is a leading technology services and consulting company.' },
      { name: 'HCL Technologies', location: 'Noida, Uttar Pradesh', description: 'HCL Technologies is a next-generation global technology company.' },
      { name: 'Tech Mahindra', location: 'Pune, Maharashtra', description: 'Tech Mahindra offers innovative and customer-centric IT solutions.' }
    ]);
    console.log(`   Created ${companies.length} companies`);

    // =============================================
    // 6. CREATE PLACEMENT DRIVES
    // =============================================
    console.log('🚀 Creating placement drives...');
    const drives = await Drive.create([
      {
        company: companies[0]._id, // TCS
        role: 'Software Developer',
        minCgpa: 6.0,
        description: 'Full-time position for fresh graduates. Work on enterprise applications using Java and Spring Boot.',
        driveDate: new Date('2027-01-15'),
        placementOfficer: officer._id,
        status: 'active'
      },
      {
        company: companies[1]._id, // Infosys
        role: 'Systems Engineer',
        minCgpa: 6.5,
        description: 'Join as a Systems Engineer and work on cutting-edge technology projects.',
        driveDate: new Date('2027-01-20'),
        placementOfficer: officer._id,
        status: 'active'
      },
      {
        company: companies[2]._id, // Wipro
        role: 'Project Engineer',
        minCgpa: 7.0,
        description: 'Project Engineer role working with cloud technologies and DevOps.',
        driveDate: new Date('2027-02-05'),
        placementOfficer: officer._id,
        status: 'active'
      },
      {
        company: companies[3]._id, // HCL
        role: 'Graduate Engineer Trainee',
        minCgpa: 5.5,
        description: 'GET program with 6 months training followed by project assignment.',
        driveDate: new Date('2027-02-15'),
        placementOfficer: officer._id,
        status: 'active'
      },
      {
        company: companies[4]._id, // Tech Mahindra
        role: 'Associate Software Engineer',
        minCgpa: 7.5,
        description: 'Work on AI/ML-based enterprise solutions for global clients.',
        driveDate: new Date('2027-03-01'),
        placementOfficer: officer._id,
        status: 'active'
      },
      {
        company: companies[0]._id, // TCS — closed drive
        role: 'Business Analyst',
        minCgpa: 8.0,
        description: 'Business Analyst role for top performers. This drive has been completed.',
        driveDate: new Date('2026-12-01'),
        placementOfficer: officer._id,
        status: 'closed'
      }
    ]);
    console.log(`   Created ${drives.length} drives`);

    // =============================================
    // 7. CREATE SAMPLE APPLICATIONS
    // =============================================
    console.log('📝 Creating sample applications...');
    const applications = await Application.create([
      // Student001 (CGPA 9.5) applied to TCS drive
      { student: students[0]._id, drive: drives[0]._id, status: 'Shortlisted' },
      // Student002 (CGPA 9.2) applied to Infosys drive
      { student: students[1]._id, drive: drives[1]._id, status: 'Applied' },
      // Student003 (CGPA 9.0) applied to Wipro drive
      { student: students[2]._id, drive: drives[2]._id, status: 'Selected' },
      // Student005 (CGPA 8.6) applied to TCS drive
      { student: students[4]._id, drive: drives[0]._id, status: 'Applied' },
      // Student011 (CGPA 7.8) applied to TCS drive  
      { student: students[10]._id, drive: drives[0]._id, status: 'Applied' },
      // Student016 (CGPA 7.0) applied to Wipro drive (exactly at minCgpa = 7.0)
      { student: students[15]._id, drive: drives[2]._id, status: 'Applied' },
      // Student020 (CGPA 6.5) applied to Infosys drive (exactly at minCgpa = 6.5)
      { student: students[19]._id, drive: drives[1]._id, status: 'Applied' },
      // Student001 also applied to Tech Mahindra
      { student: students[0]._id, drive: drives[4]._id, status: 'Applied' },
      // Student037 (CGPA 9.1) applied to closed TCS Business Analyst drive
      { student: students[36]._id, drive: drives[5]._id, status: 'Rejected' },
    ]);
    console.log(`   Created ${applications.length} sample applications`);

    // =============================================
    // SUMMARY
    // =============================================
    console.log('\n============================================');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('============================================');
    console.log(`📦 Batches: ${batches.length}`);
    console.log(`👔 Management: 1 (college.admin / Admin@123)`);
    console.log(`👨‍💼 Officer: 1 (placement.officer / Officer@123)`);
    console.log(`🎓 Students: ${students.length} (student001 / Student@123)`);
    console.log(`🏢 Companies: ${companies.length}`);
    console.log(`🚀 Drives: ${drives.length}`);
    console.log(`📝 Applications: ${applications.length}`);
    console.log('============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
