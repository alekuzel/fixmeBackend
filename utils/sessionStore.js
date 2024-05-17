// Simple in-memory session store
const sessions = {};

const setSession = (sessionId, data) => {
    sessions[sessionId] = data;
};

const getSession = (sessionId) => {
    return sessions[sessionId];
};

const deleteSession = (sessionId) => {
    delete sessions[sessionId];
};

module.exports = {
    setSession,
    getSession,
    deleteSession
};
