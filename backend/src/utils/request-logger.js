const config = require('./config');

module.exports = async function(req, res, next) {
    console.log(`ENTER ${config.baseUrl}${req.url}`);
    await next();
    console.log(`LEAVE ${res.statusCode} - ${config.baseUrl}${req.url}`);
};
