const config = require("./config");
const { v4: uuid } = require("uuid").v4;
const { Pool, types } = require("pg");

types.setTypeParser(20, (val) => parseInt(val, 10));

const connection = new Pool({
  user: config.rds_user,
  host: config.rds_host,
  database: config.rds_db,
  password: config.rds_password,
  port: config.rds_port,
  ssl: {
    rejectUnauthorized: false,
  },
});

// connection.connect((err) => err && console.log(err))

// Route 1: GET /flight/:source/:destination
// Get all flights from source to destination
const getFlights = async (req, res) => {
  try {
    const source = req.params.source;
    const destination = req.params.destination;
    if (!source || !destination) {
      return res.status(400).json({error: "Invalid source or destination"});
    }

    const query = `
    SELECT *
    FROM Flight
    WHERE origin_airport_city LIKE $1 AND destination_airport_city LIKE $2`;

    const {rows: flights} = await connection.query(query, [`${source}%`, `${destination}%`]);

    if (flights.length === 0) {
      return res.status(404).json({error: "No flights found"});
    }

    res.status(200).json(flights);
  } catch (error) {
    console.error('Error in getFlights:', error);
    res.status(500).json({error: "Internal server error!!!"});
  }
};

// Route 2: GET /flight/:source/:destination/popular
// Get popular flights from source to destination
const getPopularFlights = async (req, res) => {};

// Route 3: GET /flight/:source/:destination/average
// Get average flights from source to destination
const getAverageFlights = async (req, res) => {};

// Route 4: GET /hotel/:city
// Get hotels in a city
const getHotels = async (req, res) => {};

// Route 5: GET /hotel/:city/popular
// Get popular hotels in a city
const getPopularHotels = async (req, res) => {};

// Route 6: GET /hotel/:city/average
// Get average hotels in a city
const getAverageHotels = async (req, res) => {};

// Route 7: GET /user/:id
// Get user by id
const getUser = async (req, res) => {
  try {
    const {id: email} = req.params;
    if (!email) {
      return res.status(400).json({error: "Email is required."});
    }

    const query =  `
    SELECT * 
    FROM Users
    WHERE email = $1`;

    const {rows:user} = await connection.query(query, [email]);
    if (user.length === 0) {
        return res.status(404).json({error: "User not found."});
    }

    res.status(200).json(user[0]);
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({error: "Internal server error!!!"});
  }
};

// Route 8: POST /user
// Create a new user
const createUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        console.log(name)
        console.log(email)
        console.log(password)
        if (!name || !email || !password) {
        return res.status(400).json({error: "All fields are required to register a user!!!"});
        }

        const query = `
        INSERT INTO Users (name, email, password)
        VALUES ($1, $2, $3)`;

        await connection.query(query, [name, email, password]);

        res.status(201).json({message: "User created successfully"});
    } catch (error) {
        console.error('Error in createUser:', error);
        if (error.code === '23505') {
          return res.status(409).json({error: "User email already exists"});
        }
        res.status(500).json({error: "Internal server error!!!"});
    }
};

// Route 9: POST /user/:id/plan
// Create a new plan for a user
const createPlan = async (req, res) => {
    const client = await connection.connect();
    try {
        const {id: email} = req.params;
        const {total_cost, hotels, flights} = req.body;

        if (!email || !total_cost || !hotels || !flights) {
            return res.status(400).json({error: "Missing required fields"});
        }

        // Start transaction
        await client.query("BEGIN");

        // Update TravelPlan
        const insertPlanQuery = `
        INSERT INTO TravelPlan (total_cost, user_email)
            VALUES ($1, $2)
            RETURNING plan_id`;

        const {rows: plan} = await client.query(insertPlanQuery, [total_cost, email]);
        const planId = plan[0].plan_id;

        // Update HotelTravelPlan
        if (hotels && hotels.length > 0) {
            const insertHotelQuery = `
            INSERT INTO HotelTravelPlan (plan_id, hotel_id)
            VALUES ($1, $2)`;
            for (const hotelId of hotels) {
                await client.query(insertHotelQuery, [planId, hotelId]);
            }
        }

        // Update FlightTravelPlan
        if (flights && flights.length > 0) {
            const insertFlightQuery = `
            INSERT INTO FlightTravelPlan (plan_id, flight_id)
            VALUES ($1, $2)`;
            for (const flightId of flights) {
                await client.query(insertFlightQuery, [planId, flightId]);
            }
        }

        // Commit transaction
        await client.query("COMMIT");
        res.status(201).json({message: "Plan created successfully", planId});
    } catch (error) {
        // Rollback transaction
        await client.query("ROLLBACK");
        console.error('Error in createPlan:', error);
        res.status(500).json({error: "Internal server error!!!"});
    } finally {
        client.release();
    }
};

// Route 10: GET /user/:id/plan
// Get all plans for a user
// TODO: hard to separate as source and destination because there are multiple flights
const getPlans = async (req, res) => {
    try {
        const {id: email} = req.params;
        if (!email) {
            return res.status(400).json({error: "Email is required."});
        }

        const query = `
        SELECT  tp.plan_id, tp.total_cost, tp.created_at AS plan_date, 
       ARRAY_AGG(DISTINCT f.origin_airport_city) || ARRAY_AGG(DISTINCT f.destination_airport_city) AS cities
        FROM TravelPlan tp
        JOIN FlightTravelPlan ftp ON tp.plan_id = ftp.plan_id
        JOIN Flight f ON ftp.flight_id = f.flight_id
        WHERE tp.user_email = $1
        GROUP BY tp.plan_id
        ORDER BY tp.created_at DESC;`;

        const {rows: plans} = await connection.query(query, [email]);
        res.status(200).json({plans});
    } catch (error) {
        console.error('Error in getPlan:', error);
        res.status(500).json({error: "Internal server error!!!"});
    }
};

// Route 11: GET /user/:id/plan/:planId
// Get a plan by id for a user
const getPlan = async (req, res) => {
    try {
        const {id: email, planId} = req.params;
        if (!email || !planId) {
            return res.status(400).json({error: "Email and planId are required."});
        }

        const query = `
        SELECT 
        tp.plan_id, 
        tp.total_cost, 
        tp.created_at AS plan_date,
        ARRAY_AGG(DISTINCT f.origin_airport_city) || ARRAY_AGG(DISTINCT f.destination_airport_city) AS cities,
        COALESCE(JSON_AGG(DISTINCT f.*) FILTER (WHERE f.flight_id IS NOT NULL), '[]') AS flights,
        COALESCE(JSON_AGG(DISTINCT h.*) FILTER (WHERE h.hotel_id IS NOT NULL), '[]') AS hotels
        FROM TravelPlan tp
        JOIN FlightTravelPlan ftp ON tp.plan_id = ftp.plan_id
        JOIN Flight f ON ftp.flight_id = f.flight_id
        JOIN HotelTravelPlan htp ON tp.plan_id = htp.plan_id
        JOIN Hotel h ON htp.hotel_id = h.hotel_id
        WHERE tp.user_email = $1 AND tp.plan_id = $2
        GROUP BY tp.plan_id;`

        const {rows: plans} = await connection.query(query, [email, planId]);
        res.status(200).json({plan: plans});
    } catch (error) {
        console.error('Error in getPlan:', error);
        res.status(500).json({error: "Internal server error!!!"});
}
}

// Route 12: PUT /user/:id/plan/:planId
// Update a plan by id for a user
const updatePlan = async (req, res) => {};

// Route 13: DELETE /user/:id/plan/:planId
// Delete a plan by id for a user
const deletePlan = async (req, res) => {
    const client = await connection.connect();
    try {
        const {id: email, planId} = req.params;
        if (!email || !planId) {
            return res.status(400).json({error: "Email and planId are required."});
        }

        // Start transaction
        await client.query("BEGIN");

        // Delete FlightTravelPlan
        await client.query(`
        DELETE FROM FlightTravelPlan
        WHERE plan_id = $1`, [planId]);

        // Delete HotelTravelPlan
        await client.query(`
        DELETE FROM HotelTravelPlan
        WHERE plan_id = $1`, [planId]);

        // Delete TravelPlan
        const {rows: deletedPlan} = await client.query(`
        DELETE FROM TravelPlan
        WHERE user_email = $1 AND plan_id = $2
        RETURNING *`, [email, planId]);

        if (deletedPlan.length === 0) {
            return res.status(404).json({error: "Plan not found"});
        }

        // Commit transaction
        await client.query("COMMIT");
        res.status(204).json({message: "Plan deleted successfully", deletedPlan});
    } catch (error) {
        // Rollback transaction
        await client.query("ROLLBACK");
        console.error('Error in deletePlan:', error);
        res.status(500).json({error: "Internal server error!!!"});
    } finally {
        client.release();
    }
};

module.exports = {
  getFlights,
  getPopularFlights,
  getAverageFlights,
  getHotels,
  getPopularHotels,
  getAverageHotels,
  getUser,
  createUser,
  createPlan,
  getPlans,
  getPlan,
  updatePlan,
  deletePlan,
};
