const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
        };

        try {
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Update user with googleId if it doesn't have one
                if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }
                done(null, user);
            } else {
                // Password is required in model, so we give it a random one or make it optional
                // Since I'm using the existing User model, I'll generate a random password
                newUser.password = Math.random().toString(36).slice(-10);
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
};
