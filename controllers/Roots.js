'use strict';
class Roots {
    /**
     * @api {get} /login Interfaz de inicio sesion
     * @apiName getLogin
     * @apiGroup CuentaController
     *
     * @apiParam {req} req el objeto de peticion
     * @apiParam {res} res Devuelve la pagina para ingresar 
     * 
     */
     getMsj(req, res) {
        res.render('fragmentos/mensajes', {
            partial: 'mensajes'
            //error: req.flash("err_cred")
        });
    }
    getLogin(req, res) {
        res.render('fragmentos/login', {
            title: 'Universidad Nacional de Loja'
            //error: req.flash("err_cred")
        });
    }
    getReg(req, res) {
        res.render('fragmentos/registro', {
            title: 'Universidad Nacional de Loja'
            //error: req.flash("err_cred")
        });
    }
    //PROVISIONALES
    //USER TEMPLATES
    perfil(req, res) {
        res.render('usuario/perfil', {
            title: "Perfil"
            //error: req.flash("err_cred")
        });
        
    }
    mensajes(req, res) {
        res.render('fragmentos/mensajes', {
            title: "Mensajes"
            //error: req.flash("err_cred")
        });
        
    }
    cloud(req, res) {
        res.render('cloud', {
            title: "Share UNL"
            //error: req.flash("err_cred")
        });
        
    }
   
    chat(req, res) {
        res.render('Usuario/chat', {
            title: "Chat"
            //error: req.flash("err_cred")
        });
    }
    main(req, res) {
        res.render('main', {
            title: "Muro"
            //error: req.flash("err_cred")
        });
    }
    /**
     * @api {get} / Interfaz principal
     * @apiName getPrincipal
     * @apiGroup CuentaController
     *
     * @apiParam {req} req el objeto de peticion
     * @apiParam {res} res Devuelve la pagina principal de la aplicacion
     * 
     */
    getPrincipal(req, res) {
        res.render('index', {
            title: 'Universidad Nacional de Loja',
            fragmento: 'fragmentos/login'
            //error: req.flash("err_cred")
        });
    }

    /**
     * @api {get} /cerrar Cierra la sesion
     * @apiName cerrar
     * @apiGroup CuentaController
     *
     * @apiParam {req} req es la sesion a destruir
     * @apiParam {res} res el objeto de respuetas
     * 
     */
    cerrar(req, res) {
        req.session.destroy();
        res.redirect("/");
    }


}
module.exports = Roots;