import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { ApiError } from './errorMiddleware.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        throw new ApiError('User not found', 404);
      }

      // Check if user is active
      // if (!user.isActive) {
      //   throw new ApiError('User account is deactivated', 401);
      // }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError('Invalid token', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new ApiError('Token expired', 401);
      }
      throw error;
    }
  }

  if (!token) {
    throw new ApiError('Not authorized, no token', 401);
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new ApiError('Not authorized as an admin', 403);
  }
});

// Rate limiting middleware
const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return asyncHandler(async (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old requests
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }

    // Count requests in current window
    const requestCount = Array.from(requests.values()).filter(
      timestamp => timestamp > windowStart
    ).length;

    if (requestCount >= max) {
      throw new ApiError('Too many requests, please try again later', 429);
    }

    // Add current request
    requests.set(ip, now);
    next();
  });
};

export { protect, admin, rateLimit };