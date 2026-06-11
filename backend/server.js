require('dotenv').config();
const http = require("http");
const app = require('./src/app');
const connectToDB = require('./src/config/db');
const { initSocket } = require("./src/realtime/socket");
const { startQueueJanitor } = require("./src/services/queue.service");

async function startServer() {
    try {
        // Connect to database first
        await connectToDB();

        const server = http.createServer(app);
        initSocket(server);
        startQueueJanitor();

        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
