const express= require('express');
const app= express();

const userRoutes= require("./routes/User");
const paymentRoutes= require("./routes/Payment");
const profileRoutes= require("./routes/Profile");
const courseRoutes= require("./routes/Course");

const database= require("./config/database");
const cookieParser= require("cookie-parser");
const cors= require("cors");    // for backend and frontend to work together
const {cloudinaryConnect}= require("./config/cloudinary");
const fileUpload= require("express-fileupload");
require('dotenv').config();

const PORT= process.env.PORT||4000;
database.connectWithDb();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        //origin: "http://localhost:3000",    // frontend se request accept karne ke liye
        origin:"*",
        credentials: true,
    })
)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir:"/tmp",
    })
)

cloudinaryConnect();

// routes
/* app.use("/api/aka1/auth",userRoutes);
app.use("/api/aka1/profile",profileRoutes);
app.use("/api/aka1/course",courseRoutes);
app.use("/api/aka1/payment",paymentRoutes); */
app.use("/auth",userRoutes);
app.use("/profile",profileRoutes);
app.use("/course",courseRoutes);
app.use("/payment",paymentRoutes);

// default route for home page
app.get("/",(req,res)=>{
    return res.json({
        success: true,
        message: "Your server is running successfully ",
    });
});

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
})

