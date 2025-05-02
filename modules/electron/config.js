const { app } = require("electron");
const os = require("os");
module.exports = {
    host: "localhost", port: 3033, id: os.hostname()
}