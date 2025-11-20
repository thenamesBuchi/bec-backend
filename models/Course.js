// Models are now handled via native `mongodb` collections attached to `app.locals.collections`.
// Keep this file as a lightweight compatibility stub.

module.exports = {
    // Helper to get the collection from an Express `app` or `req` object
    getCollection: (appOrReq) => {
        if (appOrReq && appOrReq.app) appOrReq = appOrReq.app; // if a req was passed
        return appOrReq && appOrReq.locals && appOrReq.locals.collections
            ? appOrReq.locals.collections.courses
            : null;
    },
};
