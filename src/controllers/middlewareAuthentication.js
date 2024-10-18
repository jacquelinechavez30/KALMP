const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const DataUsers = require('../models/userSchema');

//Middleware para verificar si el usuario está logueado
const jwt = require('jsonwebtoken');

let blacklistedTokens = []; // Lista de tokens inválidos
const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

        // Check if the token is blacklisted
        if (blacklistedTokens.includes(token)) {
          return res.status(403).json({
            success: false,
            message: 'Token has been invalidated',
          });
        }
    
    jwt.verify(token, process.env.SECRET_KEY , (err, payload) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid token',
        });
      } else if(!err && payload) {
        req.user = payload; // Attach the decoded token payload (user info) to the request
        next(); // Continue with the request processing
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Token is not provided',
    });
  }
};


const logout = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const { email } = req.body;
  const user = await DataUsers.findOne({ email: email });

  if(authHeader) {
      const token = authHeader.split(' ')[1];
      blacklistedTokens.push(token);
      user.activity = false; //cambiar el estado a falso porque su estado de activo ya no es cierto. Entonces sacar del dashboard
      await user.save();
      res.json({ message: "User logged out"});
  } else {
      res.status(400).json({ message: "Token is not provided" });
  }
};


module.exports = {
    validateToken,
    logout,
};

