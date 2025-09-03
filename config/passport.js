const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find user by githubId
        let user = await User.findOne({ githubId: profile.id });

        // try to discover primary email from profile.emails
        const primaryEmail =
          Array.isArray(profile.emails) && profile.emails.length
            ? profile.emails.find(e => e.primary)?.value || profile.emails[0].value
            : undefined;

        if (!user) {
          // If email exists, try to find user by email (link accounts)
          if (primaryEmail) {
            user = await User.findOne({ email: primaryEmail });
            if (user) {
              user.githubId = profile.id;
              await user.save();
            }
          }
        }

        // If still not found, create new user
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username || profile.displayName || `gh_${profile.id}`,
            email: primaryEmail
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;