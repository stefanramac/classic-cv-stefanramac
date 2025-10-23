require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const mongoUri = process.env.MONGODB_URI;

// Initial experiences data from the website
const experiences = [
    {
        position: "System Integration Analyst",
        company: "Erste Banka Srbija",
        startDate: "2025-07",
        endDate: "2025-11",
        isPresent: false,
        description: "Responsible for functional analysis, design, and implementation oversight of banking solutions with focus on system integration. Leading end-to-end integration projects including REST APIs, event streaming, and file transfers. Preparing Integration Design Documents, supporting testing execution, and maintaining integration architecture repositories.",
        skills: ["RESTful APIs", "Kafka", "Event Streaming", "SDLC", "Integration Design", "Banking Sector"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        position: "Integration Specialist",
        company: "TNation",
        startDate: "2024-08",
        endDate: "2025-05",
        isPresent: false,
        description: "Designed, developed, and implemented integration solutions using Software AG WebMethods for international clients. Created robust integration architectures connecting enterprise systems with REST and SOAP web services. Leveraged AWS cloud services for hosting and managing integration solutions. Worked extensively with MongoDB and created standardized APIs using Swagger and OpenAPI specifications.",
        skills: ["Software AG WebMethods", "Java", "AWS Cloud", "MongoDB", "REST/SOAP", "OpenAPI", "Jenkins"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        position: "Integration Platform Developer",
        company: "NLB DigIT",
        startDate: "2023-12",
        endDate: "2024-08",
        isPresent: false,
        description: "Integration development on enterprise ESB platform building stable integrations between various enterprise solutions for NLB Banks across Slovenia, Serbia, Macedonia, Montenegro, and Croatia. Utilized Microsoft Azure for API Management and Logic Apps. Developed API proxies and flows in Google Apigee applying security standards including OAuth 2.0, JWT, and mTLS with caching and performance optimization.",
        skills: ["Azure API Management", "Azure Functions", "Google Apigee", "SOAP Web Services", "SQL/PL-SQL", "mTLS", "OAuth 2.0"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        position: "Enterprise Integration Architect",
        company: "Schneider Electric",
        startDate: "2022-12",
        endDate: "2023-12",
        isPresent: false,
        description: "Provided technical leadership for multiple concurrent projects requiring custom software design and deployment. Defined technical strategy, gathered requirements, and led solution design workshops for utility sector clients. Documented data models, functional specs, and integrations. Performed system, database, application, and network capacity planning while mentoring team members and supporting data migration design.",
        skills: ["Solution Architecture", "Technical Leadership", "Consulting", "Project Management", "Mentoring", "Utility Sector"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        position: "Integration Developer",
        company: "Devoteam Serbia",
        startDate: "2021-08",
        endDate: "2022-12",
        isPresent: false,
        description: "Developed TIBCO BW5 Fulfillment Orchestration Suite applications for telecommunications clients including A1 Serbia and A1 Macedonia. Built SOAP services with backend system integrations through SOAP/HTTP and SOAP/JMS. Designed Technical Products and prepared Bamboo pipelines for deployment. Developed and refactored BW5 applications and SMPP adapter for VAS (value-added) Services. Provided production support as EAI Team member.",
        skills: ["TIBCO BW5", "SOAP", "JMS", "SMPP", "Bamboo CI/CD", "Telecommunications"],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

async function initializeDatabase() {
    const client = new MongoClient(mongoUri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db('stefanramac_cv');
        const usersCollection = db.collection('user');
        const experienceCollection = db.collection('experience');
        
        // Check if admin user exists
        const existingUser = await usersCollection.findOne({ email: 'stefanramac@gmail.com' });
        
        if (!existingUser) {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await usersCollection.insertOne({
                email: 'stefanramac@gmail.com',
                password: hashedPassword,
                createdAt: new Date()
            });
            console.log('✅ Admin user created');
            console.log('   Email: stefanramac@gmail.com');
            console.log('   Password: admin123');
            console.log('   ⚠️  PLEASE CHANGE THE PASSWORD AFTER FIRST LOGIN!');
        } else {
            console.log('ℹ️  Admin user already exists');
        }
        
        // Check if experiences exist
        const existingExperiences = await experienceCollection.countDocuments();
        
        if (existingExperiences === 0) {
            // Insert experiences
            await experienceCollection.insertMany(experiences);
            console.log(`✅ ${experiences.length} experiences added to database`);
        } else {
            console.log(`ℹ️  Database already contains ${existingExperiences} experience(s)`);
        }
        
        console.log('\n🎉 Database initialization complete!');
        console.log('\nYou can now:');
        console.log('1. Start the server: npm run dev');
        console.log('2. Login at: http://localhost:3000/adminlogin');
        console.log('3. Manage experiences at: http://localhost:3000/dashboard');
        
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

initializeDatabase();

