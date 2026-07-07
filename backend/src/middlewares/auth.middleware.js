const { ApiError } = require('../utils/apiResponse');
const { verifyAccessToken } = require('../utils/tokenUtils');

const authenticate = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'Missing or invalid Authorization header'));
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.id,
      role: payload.role
    };
    return next();
  } catch (error) {
    return next(new ApiError(401, 'INVALID_TOKEN', 'Access token is invalid or expired'));
  }
};

module.exports = authenticate;
