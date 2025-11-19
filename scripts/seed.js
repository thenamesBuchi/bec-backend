require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bec-courses';

const seedCourses = [
    { title: 'Python for Beginners', author: 'A. Smith', price: 24.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?python,programming&sig=1', category: 'programming', description: 'Learn Python basics.' },
    { title: 'Web Development Bootcamp', author: 'B. Lee', price: 39.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?web,development&sig=2', category: 'programming', description: 'Full-stack web dev.' },
    { title: 'Data Science with Python', author: 'C. Zhao', price: 49.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?data,science&sig=3', category: 'data', description: 'Data analysis and ML.' },
    { title: 'UI/UX Design Fundamentals', author: 'D. Kumar', price: 19.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?ui,ux,design&sig=4', category: 'design', description: 'Design interfaces and experiences.' },
    { title: 'Intro to Machine Learning', author: 'E. Gomez', price: 59.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?machine,learning&sig=5', category: 'data', description: 'ML fundamentals.' },
    { title: 'Business Analytics', author: 'F. Rossi', price: 29.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?business,analytics&sig=6', category: 'business', description: 'Analytics for business.' },
    { title: 'Advanced JavaScript', author: 'G. Patel', price: 34.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?javascript,code&sig=7', category: 'programming', description: 'Deep dive into JS.' },
    { title: 'Databases with MongoDB', author: 'H. Wang', price: 44.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?database,mongodb&sig=8', category: 'data', description: 'MongoDB essentials.' },
    { title: 'Responsive Web Design', author: 'I. Murphy', price: 22.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?responsive,design&sig=9', category: 'design', description: 'Layouts that adapt.' },
    { title: 'DevOps Essentials', author: 'J. Nasser', price: 49.99, spaces: 30, imageUrl: 'https://source.unsplash.com/featured/300x200?devops,infrastructure&sig=10', category: 'business', description: 'CI/CD and infra.' }
];

async function seed() {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB for seeding');

        // Clear existing courses collection (optional)
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        const inserted = await Course.insertMany(seedCourses);
        console.log(`Inserted ${inserted.length} courses.`);
        console.log('Sample _id:', inserted[0]._id.toString());

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
