import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware to generate the hashed password
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const generateHashPassword = (req, res, next) => {
  bcrypt.hash(
    req.body.password,
    parseInt(process.env.SALT_ROUNDS),
    (err, hash) => {
      if (err) {
        next({
          statuCode: 500,
          message: "Internal Server Error",
        });
      }
      req.body.password = hash;
      next();
    }
  );
};

/**
 * function to verify the password to the hashed password stored in the database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const verifyPassword = (req, res, next) => {
  bcrypt.compare(req.body.password, req.user.password, function (err, result) {
    if (err) {
      next({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Cannot verify password",
      });
    }
    if (!result) {
      next({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Password doesn't match",
      });
    }

    next();
  });
};

/**
 * Function to generate the jwt token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const generateToken = (req, res, next) => {
  jwt.sign(
    { id: req.user.id, email: req.user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION },
    (err, token) => {
      if (err) {
        next({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Cannot generate token",
        });
      }
      req.user.token = token;
      next();
    }
  );
};

/**
 * Function to verify if the user entered token is correct
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    next({
      statusCode: StatusCodes.FORBIDDEN,
      message: "Token not found",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      next({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized access",
      });
    }
    req.decodedUser = { id: decoded.id, email: decoded.email };
    next();
  });
};
