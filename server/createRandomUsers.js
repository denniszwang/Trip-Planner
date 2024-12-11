const { Pool } = require("pg");
const config = require("./config");

const connection = new Pool({
    user: config.rds_user,
    host: config.rds_host,
    database: config.rds_db,
    password: config.rds_password,
    port: config.rds_port,
    ssl: { rejectUnauthorized: false },
});

const firstNames = [
    "John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah",
    "Ian", "Julia", "Kevin", "Laura", "Michael", "Nina", "Oscar", "Paul", "Quinn", "Rachel",
    "Sam", "Tina", "Ursula", "Victor", "Wendy", "Xander", "Yara", "Zane", "Amber", "Blake",
    "Caleb", "Daisy", "Ethan", "Faith", "Grace", "Henry", "Isla", "Jack", "Kate", "Leo",
    "Molly", "Nathan", "Olivia", "Peter", "Quincy", "Ruby", "Sarah", "Thomas", "Uma", "Violet"
];

const lastNames = [
    "Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
    "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
    "Allen", "Young", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson", "Carter",
    "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
    "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey"
];

const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const createRandomUsers = async () => {
    try {
        const users = [];
        for (let i = 0; i < 10; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@testdata.com`;
            const password = generateRandomString(6);
            users.push({ name, email, password });
        }

        const query = `
      INSERT INTO Users (name, email, password) 
      VALUES ($1, $2, $3);
    `;

        for (const user of users) {
            await connection.query(query, [user.name, user.email, user.password]);
        }

        console.log("10 random users created successfully!");
        process.exit();
    } catch (error) {
        console.error("Error in createRandomUsers:", error);
        process.exit(1);
    }
};

createRandomUsers();
