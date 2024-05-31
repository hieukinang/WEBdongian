const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
     const header = req.headers["authorization"];
     if (!header || !header.startsWith("Bearer")) {
          return res.status(401).json({
               error: "Unauthorized"
          });
     }
     const token = header.split(" ")[1];
     jwt.verify(token, "KEY", (error, decoded) => {
          if (error) {
               if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({
                         error: "Token expired"
                    });
               } else {
                    return res.status(403).json({
                         error: "Invalid token"
                    });
               }
          } else {
               req.user = decoded.userFind;
               next();
          }
     });
};
