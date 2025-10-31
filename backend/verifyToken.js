// import jwt from "jsonwebtoken";
import { auth } from "express-oauth2-jwt-bearer";
import Users from "./models/users.js";
import Roles from "./models/roles.js";


export const verifyToken = async(req, res, next) => {
    const token =
    req.body.token || req.query.token || req.headers["authorization"];
    const bearer = token?.split(' ');
    const bearerToken = bearer?.[1];
  if (!bearerToken) {
    return res.send({message:"A token is required for authentication",success:false});
  }

  try {
    // Use express-oauth2-jwt-bearer to validate the token
    auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: process.env.AUTH0_DOMAIN,
    })(req, res, async (err) => {
      if (err) {
        // Handle JWT validation errors
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: err.message || 'Invalid or expired token',
        });
      }
      if(!req?.auth?.payload?.sub){
        return res.send({message:"Invalid Auth0 User Token!",success:false});
      }
      const user = await Users.findOne({ where: { external_id: req?.auth?.payload?.sub },
        include: [{
          model: Roles,
          as: "role",
          attributes: ['name']
        }]
       })
        if(!user){
          return res.send({message:"Invalid User Token!",success:false});
        } else {
          req.user = user;
          req.user.user_id = user.id
          // todo- we need to change the above line , only send perticular data to frontend
          // Proceed to next middleware/route handler if token is valid
          return next();
        }
    });
  } catch (error) {
    // Catch unexpected errors (e.g., server errors) and respond with 500
    console.error('Unexpected error during token validation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while processing your request.',
    });
  }
  // const token =
  //   req.body.token || req.query.token || req.headers["authorization"];
  //   const bearer = token?.split(' ');
  //   const bearerToken = bearer?.[1];
  // if (!bearerToken) {
  //   return res.send({message:"A token is required for authentication",success:false});
  // }
  // try {
  //   const decoded = jwt.verify(bearerToken, config.TOKEN_KEY);
  //   const user = await Users.findByPk(decoded?.user_id);
  //   if(!user){
  //     return res.send({message:"Invalid User Token!",success:false});
  //   }
  //   req.user = decoded;
  // } catch (err) {
  //   return res.send({message:"Invalid Token",success:false});
  // }
  // return next();
};

export const verifyAdminToken = async(req,res,next) => {
  if(!((req?.user?.role?.name === 'Adminstrator') || (req?.user?.role?.name === 'Super Admin'))) {
    return res.status(401).json({
      success: false,
      error: 'Invalid User',
      message: 'Unauthorized user',
    });
  }
}

// export default verifyToken;