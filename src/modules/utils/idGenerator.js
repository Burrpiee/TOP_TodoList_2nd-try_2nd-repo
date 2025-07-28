//Generate unique ID for projects and todos using UUID ver 4

function generateUniqueID() {
    //Defaults to crypto.randomUUID()
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    //Another method to generate ID in case crypto not supported
    else {
        const id = Date.now.toString(36) + Math.random().toString(36).slice(2);
        return id;
    }
};

export default generateUniqueID;