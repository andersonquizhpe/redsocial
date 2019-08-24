const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/persona');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


passport.use('local-signin', new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'clave',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({ correo: email });
  console.log(user);
  if (!user) {
    return done(null, false, req.flash('error', 'No existe el usuario'));
  }
  if (user.clave !== password) {
    return done(null, false, { message: 'la contraseña es incorrecta' });
  }
  // 3) Check if email has been verified
  if (!user.activo) {
    return done(null, false, { message: 'Lo siento, primero valida tu correo' });
  }
  return done(null, user);
}));