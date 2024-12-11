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

connection.connect((err) => err && console.log(err))

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
    WHERE origin_airport_city LIKE $1 AND destination_airport_city LIKE $2`

    console.log(query);
    console.log(connection.user)
    console.log(connection.password)

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
const getUser = async (req, res) => {};

// Route 8: POST /user
// Create a new user
const createUser = async (req, res) => {};

// Route 9: POST /user/:id/plan
// Create a new plan for a user
const createPlan = async (req, res) => {};

// Route 10: GET /user/:id/plan
// Get all plans for a user
const getPlans = async (req, res) => {};

// Route 11: GET /user/:id/plan/:planId
// Get a plan by id for a user
const getPlan = async (req, res) => {};

// Route 12: PUT /user/:id/plan/:planId
// Update a plan by id for a user
const updatePlan = async (req, res) => {};

// Route 13: DELETE /user/:id/plan/:planId
// Delete a plan by id for a user
const deletePlan = async (req, res) => {};

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
