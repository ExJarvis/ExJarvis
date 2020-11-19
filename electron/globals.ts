const initGlobals = () => {
  (global as any).path = require('path');
};

export default initGlobals;