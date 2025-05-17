//Vehicle Trip Management System//


const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/vehicleDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Vehicle Schema
const tripSchema = new mongoose.Schema({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  distance: { type: Number, required: true, min: [1, "Distance must be greater than 0"] },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ["car", "truck", "bike"] },
  model: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  trips: [tripSchema]
});

// Instance method
vehicleSchema.methods.totalDistance = function () {
  return this.trips.reduce((acc, trip) => acc + trip.distance, 0);
};

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

// Routes

// A. VEHICLE CRUD
app.post("/vehicles", async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// B. TRIP OPERATIONS
app.post("/vehicles/:id/trips", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    vehicle.trips.push(req.body);
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/vehicles/:vehicleId/trips/:tripId", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const trip = vehicle.trips.id(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    Object.assign(trip, req.body);
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/vehicles/:vehicleId/trips/:tripId", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    vehicle.trips.id(req.params.tripId).remove();
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// C. ADVANCED QUERIES

// 1. Trip distance > 200km
app.get("/query/long-trips", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ "trips.distance": { $gt: 200 } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Trips starting from specific cities
app.get("/query/start-cities", async (req, res) => {
  try {
    const cities = ["Delhi", "Mumbai", "Bangalore"];
    const vehicles = await Vehicle.find({ "trips.startLocation": { $in: cities } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Trips starting after Jan 1, 2024
app.get("/query/start-after-2024", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ "trips.startTime": { $gte: new Date("2024-01-01") } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Vehicle type: car or truck
app.get("/query/car-or-truck", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ type: { $in: ["car", "truck"] } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Total distance (instance method example)
app.get("/vehicle/:id/total-distance", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const total = vehicle.totalDistance();
    res.json({ registrationNumber: vehicle.registrationNumber, totalDistance: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
