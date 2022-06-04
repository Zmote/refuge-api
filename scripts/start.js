process.env.NODE_ENV = process.env.NODE_ENV || "development";

let server = require('../src/server');

/**
 * Listen on provided port, on all network interfaces.
 */

server.start();
