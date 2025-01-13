const jwt = require("jsonwebtoken");

// Then, when any authenticated request is made, the verifyToken middleware (from authMiddleware.js) verifies the token and attaches the decoded user information to the request object. The decoded information includes the id and role that were originally signed into the token.

// This means that in any route that uses the verifyToken middleware (like your rating endpoint), you will have access to:

// req.user.id (the user's ID)
// req.user.role (the user's role)

const verifyToken = (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No Token, Authorization Denied" });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      console.log("The Decoded user is : ", req.user);
      next();
    } catch (error) {
      res.status(400).json({ message: "Token is not Vallid" });
    }
  } else {
    return res.status(401).json({ message: "No Token, Authorization Denied" });
  }
};
module.exports = verifyToken;
