const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const expiration = '2h';

function signToken(user) {
  const payload = { _id: user._id, email: user.email, username: user.username };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

function authMiddleware(req, res, next) {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token provided" });
  if (token.startsWith("Bearer ")) token = token.slice(7).trim();

  try {
    const { data } = jwt.verify(token, secret);
    req.user = data;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { signToken, authMiddleware };