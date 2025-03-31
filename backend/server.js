require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Slide Schema
const SlideSchema = new mongoose.Schema({
    presentationId: String,
    content: String,
    position: { x: Number, y: Number },
});
const Slide = mongoose.model("Slide", SlideSchema);

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinPresentation", (presentationId) => {
        socket.join(presentationId);
        console.log(`User ${socket.id} joined presentation ${presentationId}`);
    });

    socket.on("updateSlide", async (slide) => {
        if (mongoose.connection.readyState !== 1) {
            // 1 = connected
            console.error("MongoDB is not connected. Skipping update.");
            return;
        }

        try {
            const updatedSlide = await Slide.findByIdAndUpdate(
                slide._id,
                slide,
                { new: true, upsert: true }
            );

            if (!updatedSlide) {
                console.error("Slide not found or update failed.");
                return;
            }

            io.to(slide.presentationId).emit("slideUpdated", updatedSlide);
        } catch (error) {
            console.error("Error updating slide:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(5000, () => console.log("Server running on port 5000"));
