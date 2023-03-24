const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  }

  async allUser(req, res) {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  }

  /* User Registration/Signup controller  */
  async postSignup(req, res) {
    let { name, email, password, cPassword } = req.body;
    let error = {};
    if (!name || !email || !password || !cPassword) {
      error = {
        ...error,
        name: "Filed must not be empty",
        email: "Filed must not be empty",
        password: "Filed must not be empty",
        cPassword: "Filed must not be empty",
      };
      return res.json({ error });
    }
    if (name.length < 3 || name.length > 25) {
      error = { ...error, name: "Name must be 3-25 charecter" };
      return res.json({ error });
    } else {
      if (validateEmail(email)) {
        name = toTitleCase(name);
        if ((password.length > 255) | (password.length < 8)) {
          error = {
            ...error,
            password: "Password must be 8 charecter",
            name: "",
            email: "",
          };
          return res.json({ error });
        } else {
          // If Email & Number exists in Database then:
          try {
            password = bcrypt.hashSync(password, 10);
            const data = await userModel.findOne({ email: email });
            if (data) {
              error = {
                ...error,
                password: "",
                name: "",
                email: "Email already exists",
              };
              return res.json({ error });
            } else {
              let newUser = new userModel({
                name,
                email,
                password,
                // ========= Here role 1 for admin signup role 0 for customer signup =========
                userRole: 1, // Field Name change to userRole from role
              });
              newUser
                .save()
                .then((data) => {
                  return res.json({
                    success: "Account create successfully. Please login",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        error = {
          ...error,
          password: "",
          name: "",
          email: "Email is not valid",
        };
        return res.json({ error });
      }
    }
  }

  /* User Login/Signin controller  */
  async postSignin(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Fields must not be empty",
      });
    }
    try {
      const data = await userModel.findOne({ email: email });
      if (!data) {
        return res.json({
          error: "Invalid email or password",
        });
      } else {
        const login = await bcrypt.compare(password, data.password);
        if (login) {
          const token = jwt.sign(
            { _id: data._id, role: data.userRole },
            JWT_SECRET
          );
          const encode = jwt.verify(token, JWT_SECRET);
          return res.json({
            token: token,
            user: encode,
          });
        } else {
          return res.json({
            error: "Invalid email or password",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // // Configure Google OAuth 2.0 strategy
  //   passport.use(new GoogleStrategy({
  //     clientID: 'your-client-id',
  //     clientSecret: 'your-client-secret',
  //     callbackURL: 'http://localhost:3000/auth/google/callback'
  //   },
  //   function(accessToken, refreshToken, profile, done) {
  //     // Look up the user in the database
  //     User.findOne({ email: profile.emails[0].value }, function(err, user) {
  //       if (err) { return done(err); }
  //       if (user) {
  //         // If the user already exists, update their profile and return it
  //         user.name = profile.displayName;
  //         user.updatedAt = Date.now();
  //         user.save(function(err) {
  //           if (err) { return done(err); }
  //           return done(null, user);
  //         });
  //       } else {
  //         // If the user doesn't exist, create a new user and return it
  //         const newUser = new User({
  //           name: profile.displayName,
  //           email: profile.emails[0].value,
  //           userRole: 2
  //         });
  //         newUser.save(function(err) {
  //           if (err) { return done(err); }
  //           return done(null, newUser);
  //         });
  //       }
  //     });
  
  //     return done(null, profile);
  //   }
  // ));

  // // Configure session management
  //   passport.serializeUser(function(user, done) {
  //   done(null, user);
  //   });

  //   passport.deserializeUser(function(id, done) {
  //     User.findById(id, function(err, user) {
  //       done(err, user);
  //     });
  //   });

  // // Configure authentication routes
  //   app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  //   app.get('/auth/google/callback', 
  //   passport.authenticate('google', { failureRedirect: '/login' }),
  //   function(req, res) {
  //   // redirect the user to the homepage or to dashboard
  //   res.redirect('/home');
  // });
}

const authController = new Auth();
module.exports = authController;
