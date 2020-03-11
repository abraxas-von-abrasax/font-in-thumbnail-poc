const config = require('./config');

module.exports = function(req, res, next) {
    console.log(`ENTER ${config.baseUrl}${req.url}`);
    next();
    console.log(`LEAVE ${res.statusCode} - ${config.baseUrl}${req.url}`);
};
