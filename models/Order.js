// Models are now handled via native `mongodb` collections attached to `app.locals.collections`.
// Keep this file as a lightweight compatibility stub.

module.exports = {
    getCollection: (appOrReq) => {
        if (appOrReq && appOrReq.app) appOrReq = appOrReq.app;
        return appOrReq && appOrReq.locals && appOrReq.locals.collections
            ? appOrReq.locals.collections.orders
            : null;
    },
};
