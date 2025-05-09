const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

const contextService = {
  middleware: (req, res, next) => {
    asyncLocalStorage.run(new Map(), () => {
      asyncLocalStorage.getStore().set('traceId', req.id);
      next();
    });
  },
  get: (key) => {
    const store = asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  }
};

module.exports = contextService;