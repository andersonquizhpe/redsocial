'use strict';
require('dotenv').config();
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
var Persona = require('../models/persona');
var Cuenta = require('../models/cuenta');
var randomstring = require('randomstring');
var smtpTransport = require('nodemailer-smtp-transport');
var md5 = require('md5');

class cuentaController {
    signUp(req, res) {
        Persona.findOne({ 'correo': req.body.correo }, (err, person) => {
            if (err) {
                res.redirect('/registro');
            } else if (person) {
                req.flash('error', 'El correo ya fue usado con anterioridad')
                res.redirect('/registro');
            } else {
                //const hash = Cuenta.hashPassword(req.body.clave);
                const secretToken = randomstring.generate();
                console.log('secretToken', secretToken);
                new Persona({
                    id: new mongoose.Types.ObjectId(),
                    external_id: uuidv4(),
                    apellido: req.body.apellido,
                    nombre: req.body.nombre,
                    area: req.body.area,
                    carrera: req.body.carrera
                }).save(function (err, newP) {
                    if (err) {
                        res.redirect('/registro');
                        console.log(err);
                    } else if (newP) {
                        const newPersona=  newP;
                        newPersona.foto = md5(newPersona.nombre);
                        newPersona.save();
                        console.log(newP);
                        new Cuenta({
                            id: new mongoose.Types.ObjectId(),
                            external_id: uuidv4(),
                            correo: req.body.correo,
                            clave: req.body.clave,
                            persona: newP.id,
                            secretToken: secretToken,
                            active: false
                        }).save(function (err, newC) {
                            if (err) {
                                res.redirect('/registro');
                                console.log(err);
                            } else {
                                console.log(newC);
                                const html = `Hola,
                                <br/>
                                Gracias por registrarte!
                                <br/><br/>
                                Por favor para verificar tu cuenta escribe o copia el siguiente codigo:
                                <br/>
                                Codigo: <b>${secretToken}</b>
                                <br/>
                                En el siguiente link:
                                <a href="http://localhost:3000/verificar">Verificar</a>
                                <br/><br/>
                                Ten un grandioso dia.`;
                                let transporte = nodemailer.createTransport(smtpTransport({
                                    service: 'gmail',
                                    host: 'smtp.gmail.com',
                                    auth: {
                                        user: process.env.EMAIL, // TODO: your gmail account
                                        pass: process.env.PASSWORD // TODO: your gmail password
                                    }
                                }));
                                let mailOption = {
                                    from: process.env.EMAIL,
                                    to: req.body.correo,
                                    subject: 'Verificacion de cuenta',
                                    text: 'verificar',
                                    html: html
                                };
                                transporte.sendMail(mailOption, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('mensaje enviado con exito');
                                        res.redirect('/verificar');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    getVerification(req, res){
        res.render('fragmentos/verificar', {
            title: 'Universidad Nacional de Loja'
            //error: req.flash("err_cred")
        });
    }
    verificarCuenta(req, res) {
        Cuenta.findOne({'secretToken': req.body.token}, (err, user)=>{
            console.log(user);
            if(!user){
                //req.flash('error', 'Usuario no encontrado.');
                res.redirect('/verificar');
            }else{
                user.activo = true;
                user.secretToken= '';
                user.save();
                //req.flash('info', 'Se ha verificado tu cuenta. Ahora puedes inicar sesion');
                res.redirect('/login');
            }
        });
    }
}
module.exports = cuentaController;