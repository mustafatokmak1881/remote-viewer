const serverSide = require('./modules/server');
const ElectronSide = require('./modules/electron');
const electronSide = new ElectronSide('http://localhost')


module.exports = { serverSide, electronSide }