
var cuenta = require('../models/cuenta');
module.exports = function (passport) {
    var Cuenta = cuenta;//modelo   
    var LocalStrategy = require('passport-local').Strategy;
    //Permite serializar los datos de cuenta
    passport.serializeUser(function (cuenta, done) {
        done(null, cuenta.id);
    });
    // Permite deserialize la cuenta de usuario
    passport.deserializeUser(function (id, done) {
        Cuenta.findById(id, (err, user) => {
            done(err, user);
        });
    });
    //inicio de sesion
    passport.use('local-signin', new LocalStrategy(
            {
                usernameField: 'usuario',
                passwordField: 'clave',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            }, async (req, email, password, done) => {
        try {
            const user = await Cuenta.findOne({correo: email});
            if (!user) {
                console.log("usuario no existe");
                return done(null, false, {message: 'Usuario no registrado'});
            }

            // 2) Check if the password is correct
            console.log("clave    "+user.clave);
            
            if(user.clave !== password ){
                return done(null, false, {message: 'la contraseña es incorrecta'});
            }
            // 3) Check if email has been verified
            if (!user.activo) {
                return done(null, false, {message: 'Lo siento, primero valida tu correo'});
            }

            return done(null, user);
        } catch (e) {
            return done(error, false);
        }
    }
    ));
};
