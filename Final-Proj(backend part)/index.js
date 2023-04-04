const mongoose = require('mongoose');
const express = require('express');
const app = express();
const DB = require('./database').connectDB;

DB();

const userRouter = require("./routers/userRoutes");
const recipeRouter = require("./routers/recipeRoutes");
const categoryRouter = require("./routers/categoryRoutes");

app.use(express.json());

app.use("/api", userRouter);
app.use("/api", recipeRouter);
app.use("/api", categoryRouter);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});