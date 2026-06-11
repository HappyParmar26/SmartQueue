const { Server } = require("socket.io");

let io = null;

function initSocket(server) {

    io = new Server(server);

    io.on("connection", (socket) => {
        
        const { officeId, tokenId } = socket.handshake.query || {};

        if (officeId) {
            socket.join(`office:${officeId}`);
        }

        if (tokenId) {
            socket.join(`token:${tokenId}`);
        }

        socket.on("join:office", (value) => {
            if (value) {
                socket.join(`office:${value}`);
            }
        });

        socket.on("join:token", (value) => {
            if (value) {
                socket.join(`token:${value}`);
            }
        });

        socket.on("join", (payload = {}) => {
            if (payload.officeId) {
                socket.join(`office:${payload.officeId}`);
            }

            if (payload.tokenId) {
                socket.join(`token:${payload.tokenId}`);
            }
        });
    });

    return io;
}

function getSocket() {
    return io;
}

function emitOfficeQueueUpdate(officeId, payload = {}) {
    if (!io || !officeId) {
        return;
    }

    io.to(`office:${officeId}`).emit("queue:updated", {
        office_id: officeId,
        ...payload,
    });
}

function emitTokenUpdate(token, payload = {}) {
    if (!io || !token) {
        return;
    }

    const tokenId = token._id || token.id;
    if (!tokenId) {
        return;
    }

    io.to(`token:${tokenId}`).emit("token:updated", {
        token_id: tokenId,
        token,
        ...payload,
    });

    if (token.office_id) {
        emitOfficeQueueUpdate(token.office_id, payload);
    }
}

function emitCounterUpdate(officeId, counter) {
    if (!io || !officeId) {
        return;
    }

    io.to(`office:${officeId}`).emit("counter:updated", {
        office_id: officeId,
        counter,
    });
}

function emitPublicDisplayUpdate(officeId, payload = {}) {
    if (!io || !officeId) {
        return;
    }

    io.to(`office:${officeId}`).emit("public:display:updated", {
        office_id: officeId,
        ...payload,
    });
}

module.exports = {
    initSocket,
    getSocket,
    emitOfficeQueueUpdate,
    emitTokenUpdate,
    emitCounterUpdate,
    emitPublicDisplayUpdate,
};
