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

app.use(express.json())

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
app.put("/user/:id/plan/:planId", routes.updatePlan);
app.get("/plans/expensive", routes.getExpensivePlans)
app.get("/plans/longest", routes.getLongestRoutes)
app.delete("/user/:id/plan/:planId", routes.deletePlan);


app.listen(config.server_port, () => {
  console.log(
    `Server is running on port http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
