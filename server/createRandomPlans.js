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

const sampleCities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
    "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington",
    "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Las Vegas", "Portland", "Memphis", "Louisville", "Milwaukee",
    "Baltimore", "Albuquerque", "Tucson", "Fresno", "Mesa", "Sacramento", "Atlanta", "Kansas City", "Colorado Springs", "Miami", "Raleigh",
    "Omaha", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington", "Tampa", "New Orleans", "Wichita"
]

const generateRandomPlan = async () => {
    const client = await connection.connect();
    try {
        // get random users
        const {rows: users} = await client.query(`SELECT email FROM Users ORDER BY RANDOM() LIMIT 5`);
        if (users.length === 0) {
            console.log("No users found in the database!");
            return;
        }

        // begin transaction
        await client.query("BEGIN");

        for (const user of users) {
            const sourceCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];

            // get random destination city, fliht and hotel
            const {rows: results} = await client.query(
                `SELECT f.flight_id, 
                    SPLIT_PART(f.destination_airport_city, ',', 1) AS destination_city, 
                    h.hotel_id
                FROM Flight f
                LEFT JOIN Hotel h ON SPLIT_PART(f.destination_airport_city, ',', 1) = h.city
                WHERE SPLIT_PART(f.origin_airport_city, ',', 1) = $1
                ORDER BY RANDOM()
                LIMIT 2`, [sourceCity]);

            if (results.length === 0) {
                console.log(`No flights found for ${sourceCity}`);
                continue;
            }

            // construct plan data
            const totalCost = (Math, random() * 5000).toFixed(2);
            const flights = results.filter(r => r.flight_id).map(r => r.flight_id).slice(0, 2);
            const hotels = results.filter(r => r.hotel_id).map(r => r.hotel_id).slice(0, 1);
            if (flights.length === 0 || hotels.length === 0) {
                console.log(`No flights or hotels found for ${sourceCity}`);
                continue;
            }

            // create plan
            const req = {
                params: { id: user},
                body: {totalCost, flights, hotels}
            }

            const res = mockResponse();
            await createPlan(req, res);
            console.log(`Plan created for ${user} from ${sourceCity} to ${results[0].destination_city}`);
        }

        await client.query("COMMIT");
        console.log("Random plans created successfully!");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in generateRandomPlan:", error);
    } finally {
        client.release();
    }
}
