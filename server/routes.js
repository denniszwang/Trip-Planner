// Complex Queries: 10, 11, 12, 14
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

const getTotalFlights = async (source, destination) => {
    const query = `
        SELECT COUNT(*) AS total_flights
        FROM Flight
        WHERE origin_airport_city LIKE $1 AND destination_airport_city LIKE $2;`;

    const { rows } = await connection.query(query, [`${source}%`, `${destination}%`]);
    if (rows.length === 0) {
        return 0;
    }
    return rows[0].total_flights;
}

// Route 1: GET /flight/:source/:destination
// Get all flights from source to destination
const getFlights = async (req, res) => {
    try {
        const source = req.params.source;
        const destination = req.params.destination;
        if (!source || !destination) {
            return res.status(400).json({error: "Invalid source or destination"});
        }

        // Pagination
        let {page = 1, limit = 5} = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({error: "Invalid page or limit"});
        }
        const offset = (page - 1) * limit;

        const query = `
    SELECT *
    FROM Flight
    WHERE origin_airport_city LIKE $1 AND destination_airport_city LIKE $2
       LIMIT $3 OFFSET $4;`;

        const {rows: flights} = await connection.query(query, [`${source}%`, `${destination}%`, limit, offset]);

        if (flights.length === 0) {
            return res.status(404).json({error: "No flights found"});
        }

        totalNum = await getTotalFlights(source, destination);
        res.status(200).json({
            currentPage: page,
            pageSize: limit,
            totalFlights: totalNum,
            flights,
        });
    } catch (error) {
        console.error('Error in getFlights:', error);
        res.status(500).json({error: "Internal server error!!!"});
    }
};

// Route 2: GET /flight/:source/:destination/popular
// Get popular flights from source to destination
const getPopularFlights = async (req, res) => {
    try {
        const {source, destination} = req.params;
        if (!source || !destination) {
            return res.status(400).json({error: "Invalid source or destination"});
        }

        // Pagination
        let {page = 1, limit = 5} = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({error: "Invalid page or limit"});
        }
        const offset = (page - 1) * limit;

        // return 5 for now, might need pagination
        const query = `
        SELECT f.*, COALESCE(COUNT(ftp.plan_id),0) AS saved_count
        FROM Flight f
        LEFT JOIN FlightTravelPlan ftp ON f.flight_id = ftp.flight_id
        WHERE f.origin_airport_city LIKE $1 AND f.destination_airport_city LIKE $2
        GROUP BY f.flight_id
        ORDER BY saved_count DESC
        LIMIT $3 OFFSET $4;`;

        const {rows: flights} = await connection.query(query, [`${source}%`, `${destination}%`, limit, offset]);

        if (flights.length === 0) {
            return res.status(404).json({error: "No flights found"});
        }

        totalNum = await getTotalFlights(source, destination);

        res.status(200).json({
            currentPage: page,
            pageSize: limit,
            totalFlights: totalNum,
            flights,
        });
    } catch (error) {
        console.error('Error in getPopularFlights:', error);
        res.status(500).json({error: "Internal server error!!!"});
    }
};

// Route 3: GET /flight/:source/:destination/average
// Get average price of flights from source to destination
const getAverageFlights = async (req, res) => {
    try {
        const { source, destination } = req.params;

        if (!source || !destination) {
            return res.status(400).json({ error: "Invalid source or destination" });
        }

        const query = `
        SELECT AVG(f.fare) AS average_price
        FROM Flight f
        WHERE f.origin_airport_city LIKE $1 AND f.destination_airport_city LIKE $2;`;

        const { rows } = await connection.query(query, [`${source}%`, `${destination}%`]);

        if (rows.length === 0 || rows[0].average_price === null) {
            return res.status(404).json({ error: "No flights found" });
        }

        res.status(200).json({ average_price: rows[0].average_price });
    } catch (error) {
        console.error('Error in getAverageFlights:', error);
        res.status(500).json({error: "Internal server error!!!"});
    }
};

// helper function to get the total number of hotels in 1 city
const getTotalHotels = async (city) => {
    const query = `
    SELECT COUNT(*) AS total_hotels
    FROM Hotel
    WHERE city = $1;`;

    const { rows } = await connection.query(query, [city]);
    if (rows.length === 0) {
        return 0;
    }

    return rows[0].total_hotels;
}

// Route 4: GET /hotel/:city
// Get hotels in a city
const getHotels = async (req, res) => {
    try {
        const {city} = req.params;
        if (!city) {
            return res.status(400).json({error: "City is required."});
        }

        // Pagination
        let {page = 1, limit = 5} = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({error: "Invalid page or limit"});
        }
        const offset = (page - 1) * limit;


        const query = `
        SELECT *
        FROM Hotel
        WHERE city = $1
        ORDER BY hotel_rating DESC
        LIMIT $2 OFFSET $3;`;

        const {rows: hotels} = await connection.query(query, [city, limit, offset]);
        if (hotels.length === 0) {
            return res.status(404).json({error: "No hotels found."});
        }

        totalNum = await getTotalHotels(city);

        res.status(200).json({
            currentPage: page,
            pageSize: limit,
            totalHotels: totalNum,
            hotels,
        });
    } catch (error) {
        console.error('Error in getHotels:', error);
        res.status(500).json({error: "Internal server error!!!"});
    }
};

// Route 5: GET /hotel/:city/popular
// Get popular hotels in a city
const getPopularHotels = async (req, res) => {
    try {
        const {city} = req.params;
        if (!city) {
            return res.status(400).json({error: "City is required."});
        }

        // Pagination
        let {page = 1, limit = 5} = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({error: "Invalid page or limit"});
        }
        const offset = (page - 1) * limit;

        // return 5 for now, might need pagination
        const query = `
        SELECT h.hotel_id, h.hotel_name, h.hotel_rating, h.hotel_website_url, COALESCE(COUNT(htp.plan_id), 0) AS saved_count
        FROM Hotel h
        LEFT JOIN HotelTravelPlan htp ON h.hotel_id = htp.hotel_id
        WHERE h.city = $1
        GROUP BY h.hotel_id, h.hotel_name, h.hotel_rating, h.hotel_website_url
        ORDER BY saved_count DESC
        LIMIT $2 OFFSET $3;`;

        const {rows: hotels} = await connection.query(query, [city, limit, offset]);

        if (hotels.length === 0) {
            return res.status(404).json({error: "No hotels found."});
        }

        totalHotels = await getTotalHotels(city);

        res.status(200).json({
            currentPage: page,
            pageSize: limit,
            totalHotels: totalHotels,
            hotels,
        });
    } catch (error) {
        console.error('Error in getPopularHotels:', error);
        res.status(500).json({error: "Internal server error!!!"});
    }
};

// Route 6: GET /hotel/:city/average
// Get average rating hotels in a city
const getAverageHotels = async (req, res) => {
    try {
        const {city} = req.params;
        if (!city) {
            return res.status(400).json({error: "City is required."});
        }

        const query = `
        SELECT AVG(hotel_rating) AS average_rating
        FROM Hotel
        WHERE city = $1;`;

        const {rows} = await connection.query(query, [city]);
        if (rows.length === 0 || rows[0].average_rating === null) {
            return res.status(404).json({error: "No hotels found."});
        }

        res.status(200).json({average_rating: rows[0].average_rating});
    } catch (error) {
        console.error('Error in getAverageHotels:', error);
        res.status(500).json({error: "Internal server error!!!"});
    }
};

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
        const {hotels, flights} = req.body;

        if (!email || !hotels || !flights || hotels.length === 0 || flights.length === 0) {
            return res.status(400).json({error: "Missing required fields"});
        }

        // Calculate total cost
        const flightQuery = `
    SELECT SUM(fare) AS flight_cost
    FROM Flight
    WHERE flight_id = ANY($1);
    `;
        const { rows: flightCostRows } = await client.query(flightQuery, [flights]);
        const flightCost = flightCostRows[0].flight_cost || 0;

        // Calculate hotel cost based on ratings
        const hotelQuery = `
            SELECT hotel_id, hotel_rating
            fROM Hotel
            WHERE hotel_id = ANY($1);
            `;
        const { rows: hotelRows } = await client.query(hotelQuery, [hotels]);

        let hotelCost = 0;
        hotelRows.forEach(({ hotel_rating }) => {
            const minRate = (hotel_rating - 1) * 100;
            const maxRate = hotel_rating * 100;
            hotelCost += Math.floor(Math.random() * (maxRate - minRate + 1)) + minRate;
        });
        console.log('flightCost:', flightCost);
        console.log('hotelCost:', hotelCost);
        const totalCost = Math.floor(flightCost) + Math.floor(hotelCost);
        console.log('totalCost:', totalCost);

        // Start transaction
        await client.query("BEGIN");

        // Update TravelPlan
        const insertPlanQuery = `
        INSERT INTO TravelPlan (total_cost, user_email)
            VALUES ($1, $2)
            RETURNING plan_id`;

        const {rows: plan} = await client.query(insertPlanQuery, [totalCost, email]);
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
// Note: hard to separate as source and destination because there are multiple flights
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

// Route 12: GET /plans/expensive
// Get most expensive plans
const getExpensivePlans = async (req, res) => {
    try {
        const query = `
        SELECT 
            tp.plan_id, 
            tp.total_cost, 
            u.name AS user_name, 
            u.email AS user_email, 
            ARRAY_AGG(DISTINCT f.origin_airport_city) || ARRAY_AGG(DISTINCT f.destination_airport_city) AS cities_visited,
            COUNT(DISTINCT ftp.flight_id) AS total_flights, 
            COUNT(DISTINCT htp.hotel_id) AS total_hotels
        FROM TravelPlan tp
        JOIN Users u ON tp.user_email = u.email
        LEFT JOIN FlightTravelPlan ftp ON tp.plan_id = ftp.plan_id
        LEFT JOIN Flight f ON ftp.flight_id = f.flight_id
        LEFT JOIN HotelTravelPlan htp ON tp.plan_id = htp.plan_id
        LEFT JOIN Hotel h ON htp.hotel_id = h.hotel_id
        GROUP BY tp.plan_id, u.name, u.email
        ORDER BY tp.total_cost DESC`;

        const { rows: plans } = await connection.query(query);

        if (plans.length === 0) {
            return res.status(404).json({ error: "No travel plans found." });
        }

        res.status(200).json({ plans });
    } catch (error) {
        console.error("Error in getExpensiveTravelPlans:", error);
        res.status(500).json({ error: "Internal server error!!!" });
    }
}

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

// Route 14: GET /plans/longest
// get longest routes
const getLongestRoutes = async (req, res) => {
    try {
        const query = `
        SELECT 
            tp.plan_id, 
            u.name AS user_name, 
            u.email AS user_email, 
            SUM(f.distance_miles) AS total_distance, 
            ARRAY_AGG(DISTINCT SPLIT_PART(f.origin_airport_city, ',', 1)) || 
            ARRAY_AGG(DISTINCT SPLIT_PART(f.destination_airport_city, ',', 1)) AS cities_visited
        FROM TravelPlan tp
        JOIN Users u ON tp.user_email = u.email
        JOIN FlightTravelPlan ftp ON tp.plan_id = ftp.plan_id
        JOIN Flight f ON ftp.flight_id = f.flight_id
        GROUP BY tp.plan_id, u.name, u.email
        HAVING SUM(f.distance_miles) > 0
        ORDER BY total_distance DESC`;

        const { rows: itineraries } = await connection.query(query);

        if (itineraries.length === 0) {
            return res.status(404).json({ error: "No travel plans found." });
        }

        res.status(200).json({ itineraries });
    } catch (error) {
        console.error("Error in getLongestItineraries:", error);
        res.status(500).json({ error: "Internal server error!!!" });
    }
};
// // Route 15: GET /plans/most
// // Get users with their travel statistics, filtered by minimum trip count
const getMostTrips = async (req, res) => {
    try {
        const query = `
        SELECT
        u.email,
        u.name,
        COUNT(DISTINCT tp.plan_id) as total_trips,
        SUM(tp.total_cost) as total_spent,
        ROUND(AVG(f.fare), 2) as avg_flight_cost,
        ROUND(AVG(f.distance_miles), 2) as avg_trip_distance,
        COUNT(DISTINCT h.hotel_id) as different_hotels_stayed
        FROM Users u
        JOIN TravelPlan tp ON u.email = tp.user_email
        JOIN FlightTravelPlan ftp ON tp.plan_id = ftp.plan_id
        JOIN Flight f ON ftp.flight_id = f.flight_id
        JOIN HotelTravelPlan htp ON tp.plan_id = htp.plan_id
        JOIN Hotel h ON htp.hotel_id = h.hotel_id
        GROUP BY u.email, u.name
        HAVING COUNT(DISTINCT tp.plan_id) > 3
        ORDER BY total_trips DESC;`;

        const { rows: planResult } = await connection.query(query);

        if (planResult.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: "No users found with more than 3 trips."
            });
        }

        return res.status(200).json({
            status: 'success',
            data: planResult,
            metadata: {
                count: planResult.length,
                minTrips: 3
            }
        });

    } catch (error) {
        console.error("Error in getMostTrips:", error);  // Fixed error message
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while fetching trip statistics.",
            detail: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// // Route 16: GET /flight/totalFlights
// // Get users with their travel statistics, filtered by minimum trip count
const getTotalFlightsInfo = async (req, res) => {
    try {
        const query = `
        WITH RouteStats AS (
        SELECT
            origin_airport_city,
            destination_airport_city,
            carrier_lg,
            carrier_low,
            fare,
            MAX(fare) OVER (PARTITION BY origin_airport_city, destination_airport_city) as highest_fare,
            passengers,
            distance_miles
        FROM Flight f1
        -- Remove CROSS JOIN and replace with a more efficient way to filter fares
        WHERE EXISTS (
            SELECT 1
            FROM Flight f2
            WHERE f2.origin_airport_city = f1.origin_airport_city
            AND f2.destination_airport_city = f1.destination_airport_city
            AND f1.fare BETWEEN f2.fare * 0.5 AND f2.fare * 1.5
        )
        ),
        CarrierMetrics AS (
            SELECT
            origin_airport_city,
            destination_airport_city,
            STRING_AGG(DISTINCT carrier_lg, ', ') as major_carriers,
            STRING_AGG(DISTINCT carrier_low, ', ') as budget_carriers,
            COUNT(*) as total_flights,
            ROUND(AVG(fare), 2) as avg_fare,
            ROUND(MAX(highest_fare), 2) as route_highest_fare,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY fare) as median_fare,
            ROUND(AVG(passengers), 2) as avg_passengers,
            ROUND(AVG(distance_miles), 2) as avg_distance
        FROM RouteStats
        GROUP BY origin_airport_city, destination_airport_city
    ),
    AvgFlights AS (
        SELECT AVG(total_flights) as avg_total_flights
        FROM CarrierMetrics
    )
    SELECT cm.*
    FROM CarrierMetrics cm, AvgFlights af
    WHERE cm.total_flights > af.avg_total_flights
    ORDER BY cm.total_flights DESC;
        `;

        const { rows: flightStats } = await connection.query(query);

        if (flightStats.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: "No routes found with above-average flight frequency."
            });
        }

        return res.status(200).json({
            status: 'success',
            data: flightStats,
            metadata: {
                count: flightStats.length,
                averageFlightsPerRoute: parseFloat(flightStats[0].route_average).toFixed(2)
            }
        });

    } catch (error) {
        console.error("Error in getTotalFlightsInfo:", error);
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while fetching flight statistics.",
            detail: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
    getExpensivePlans,
    getLongestRoutes,
    deletePlan,
    getMostTrips,
    getTotalFlightsInfo
};

