const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./src/models/job.model');

const jobs = [
    {
        title: "Senior Full Stack Developer",
        department: "Engineering",
        location: "Remote (Europe)",
        type: "Full-time",
        description: "Join our engineering team to build scalable features for our halal events platform. Work with React, Node.js, and modern cloud technologies.",
        requirements: [
            "5+ years of full-stack development experience",
            "Strong proficiency in React, TypeScript, and Node.js",
            "Experience with Stripe integration and payment systems",
            "Knowledge of cloud platforms (AWS/GCP)",
            "Excellent problem-solving and communication skills"
        ],
        status: "active"
    },
    {
        title: "Product Designer (UI/UX)",
        department: "Design",
        location: "Remote (Europe)",
        type: "Full-time",
        description: "Shape the future of halal event discovery and ticketing. Create beautiful, user-friendly experiences that delight our community.",
        requirements: [
            "3+ years of product design experience",
            "Strong portfolio demonstrating mobile and web design",
            "Proficiency in Figma and design systems",
            "Experience with user research and testing",
            "Understanding of accessibility standards"
        ],
        status: "active"
    },
    {
        title: "Marketing Manager",
        department: "Marketing",
        location: "London, UK",
        type: "Full-time",
        description: "Lead our marketing efforts to grow HalalBrite across the UK and Europe. Drive user acquisition and brand awareness in the halal community.",
        requirements: [
            "4+ years of marketing experience, preferably in tech",
            "Proven track record in digital marketing and growth",
            "Strong understanding of the halal/Muslim community",
            "Experience with social media and content marketing",
            "Data-driven approach to campaign optimization"
        ],
        status: "active"
    }
];

async function seedJobs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Clear existing jobs
        await Job.deleteMany({});
        console.log('Cleared existing jobs');
        
        // Insert new jobs
        await Job.insertMany(jobs);
        console.log('Inserted seed jobs');
        
        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (err) {
        console.error(err);
    }
}

seedJobs();
