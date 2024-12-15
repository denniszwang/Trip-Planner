const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Travel API");
});

app.get("/flight/:source/:destination", routes.getFlights);
app.get("/flight/:source/:destination/popular", routes.getPopularFlights);
app.get("/flight/:source/:destination/average", routes.getAverageFlights);
app.get("/hotel/:city", routes.getHotels);
app.get("/hotel/:city/popular", routes.getPopularHotels);
app.get("/hotel/:city/average", routes.getAverageHotels);
app.get("/user/:id", routes.getUser);
app.post("/user", routes.createUser);
app.post("/user/:id/plan", routes.createPlan);
app.get("/user/:id/plan", routes.getPlans);
app.get("/user/:id/plan/:planId", routes.getPlan);
app.delete("/user/:id/plan/:planId", routes.deletePlan);
app.get("/plans/expensive", routes.getExpensivePlans);
app.get("/plans/expensive/most", routes.getMostExpensivePlan);
app.get("/plans/longest", routes.getLongestRoutes);
app.get("/plans/stats", routes.getMostTrips);
app.get("/flight/stats", routes.getTotalFlightsInfo);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
