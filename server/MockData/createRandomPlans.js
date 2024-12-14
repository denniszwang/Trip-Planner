const { Pool } = require("pg");
const config = require("../config.json");
const routes = require("../routes.js");
// console.log("Imported createPlan:", createPlan)

const connection = new Pool({
    user: config.rds_user,
    host: config.rds_host,
    database: config.rds_db,
    password: config.rds_password,
    port: config.rds_port,
    ssl: { rejectUnauthorized: false },
});

const mockResponse = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        console.log("Response:", res.statusCode, res.data);
        return res;
    };
    return res;
}

const generateRandomPlan = async () => {
    const client = await connection.connect();
    try {
        // get random users, batch size set to 100 -> can be adjusted
        const {rows: users} = await client.query(`SELECT email FROM Users ORDER BY RANDOM() LIMIT 100`);
        if (users.length === 0) {
            console.log("No users found in the database!");
            return;
        }

        // get random combinations of flights and hotels -> adjust limit as needed
        const {rows: queryResult} = await client.query(`
        SELECT f.flight_id, h.hotel_id,
            split_part(f.origin_airport_city, ',', 1) AS origin_city,
            SPLIT_PART(f.destination_airport_city, ',', 1) AS destination_city
        FROM Flight f
        JOIN Hotel h
        ON SPLIT_PART(f.destination_airport_city, ',', 1) = h.city
        WHERE SPLIT_PART(f.destination_airport_city, ',', 1) = 'Boston'
            OR SPLIT_PART(f.origin_airport_city, ',', 1) = 'Boston'
        ORDER BY RANDOM()
        LIMIT 100; `);

        // begin transaction
        await client.query("BEGIN");

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            // random plan size between 1 and 3
            const planSize = Math.floor(Math.random() * 3) + 1;

            const selectedFlights = queryResult
                .sort(() => 0.5 - Math.random())
                .slice(0, planSize)
                .map((row) => row.flight_id);

            const selectedHotels = queryResult
                .sort(() => 0.5 - Math.random())
                .slice(0, planSize)
                .map((row) => row.hotel_id);

            const totalCost = (Math.random() * 50000).toFixed(2);

            const req = {
                params: { id: user.email },
                body: { total_cost: totalCost, flights: selectedFlights, hotels: selectedHotels }
            };

            const res = mockResponse();
            await routes.createPlan(req, res);

            console.log(
                `Plan created for ${user.email} with ${planSize} flights and ${planSize} hotels`
            );
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

generateRandomPlan();