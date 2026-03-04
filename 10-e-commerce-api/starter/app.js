require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
require("express-async-errors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
    res.send("e-commerce api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();
