'use strict';
require('dotenv').config();
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
var Usuario = require('../models/persona');
//var Usuario = require('../models/cuenta');
var randomstring = require('randomstring');
var smtpTransport = require('nodemailer-smtp-transport');
var md5 = require('md5');

class cuentaController {
    /**
     * 
     * @api {post} /registro/save Permite guardar el nuevo usuario
     * @apiName signUp
     * @apiGroup cuentaController
     *
     * @apiParam {req} req el objeto de peticion
     * @apiParam {res} res Devuelve la pagina para iniciar sesion y envia enlace de verificacion al correo 
     * 
     */
    signUp(req, res) {
        Usuario.findOne({ 'correo': req.body.correo }, (err, person) => {
            if (err) {
                req.flash('error', 'Ha ocurrido un error en el servidor');
                res.redirect('/');
            } else if (person) {
                req.flash('error', 'El correo ya fue usado con anterioridad')
                res.redirect('/registro');
            } else {
                //const hash = Usuario.hashPassword(req.body.clave);
                const secretToken = randomstring.generate();
                console.log('secretToken', secretToken);
                new Usuario({
                    id: new mongoose.Types.ObjectId(),
                    external_id: uuidv4(),
                    apellido: req.body.apellido,
                    nombre: req.body.nombre,
                    area: req.body.area,
                    carrera: req.body.carrera,
                    correo: req.body.correo,
                    clave: req.body.clave,
                    secretToken: secretToken,
                    active: false
                }).save(function (err, newP) {
                    if (err) {
                        req.flash('error', 'Ha ocurrido un error');
                        res.redirect('/registro');
                        console.log(err);
                    } else if (newP) {
                        const newPersona = newP;
                        newPersona.foto = md5(newPersona.nombre);
                        newPersona.save(function (err, newC) {
                            if (err) {
                                req.flash('error', 'Ha ocurrido un error al registrar tu cuenta');
                                res.redirect('/registro');
                                console.log(err);
                            } else {
                                console.log(newC);
                                const html = `Hola,
                                <br/>
                                Gracias por registrarte!
                                <br/><br/>
                                Por favor para verificar tu cuenta ingresa al siguiente enlace:
                                <br/>
                                <br/>
                                En el siguiente link:
                                <a href="http://localhost:3000/verificar/update/${secretToken}">Verificar</a>
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
                                        req.flash('info', 'Dirigete a tu correo y verifica tu cuenta');
                                        res.redirect('/login');
                                    }
                                });
                            }
                        });
                        console.log(newP);

                    }
                });
            }
        });
    }
    /**
     * 
     * @api {get} /verificar/update/:token Verifica tu cuenta a traves de un enlace
     * @apiName verificarCuenta
     * @apiGroup cuentaController
     *
     * @apiParam {req} token token secreto para activar la cuenta
     * @apiParam {res} res Devuelve la pagina para iniciar sesion
     * 
     */
    verificarCuenta(req, res) {
        Usuario.findOne({ 'secretToken': req.params.token }, (err, user) => {
            console.log(user);
            if (!user) {
                req.flash('error', 'Codigo no valido');
                res.redirect('/registro');
            } else {
                user.activo = true;
                user.secretToken = '';
                user.save();
                req.flash('info', 'Se ha verificado tu cuenta. Ahora puedes inicar sesion');
                res.redirect('/login');
            }
        });
    }
}
module.exports = cuentaController;