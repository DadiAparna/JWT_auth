const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateAccessToken = (username) => {
    return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const authenticateToken = (req, res, next) => {

    // Get the token from the Authorization header

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    // Verify the JWT token

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }

        // Check if the user exists in the database
        
        User.findOne({ username: decoded.username })
            .then(user => {
                if (!user) {
                    return res.sendStatus(401);
                }

                // Attach the user object to the request for use in other middleware functions
                
                req.user = user;
                next();
            })
            .catch(error => {
                console.log(error);
                return res.sendStatus(500);
            });
    });
};

module.exports = {
    generateAccessToken,
    authenticateToken
  
};
