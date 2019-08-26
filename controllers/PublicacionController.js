'use strict';
const uuidv4 = require('uuid');
var mongoose = require('mongoose');
var fs = require('fs-extra');
var path = require('path');
var md5 = require('md5');
var moment = require('moment');
var Publicacion = require('../models/publicacion');
var Comentario = require('../models/comentario');
var Cuenta = require('../models/persona');

class PublicacionController {
    /**
     * 
     * @api {post} /publicar Permite guardar la publicacion
     * @apiName guardar
     * @apiGroup PublicacionController
     *
     * @apiParam {req} req el objeto de peticion
     * @apiParam {res} res Devuelve la pagina y lista de publicaciones realizadas 
     * 
     */
    guardar(req, res) {

		//Persona.findOne({}, (err, person)=>{
      new Publicacion({
        id: new mongoose.Types.ObjectId(),
                      
              publish: req.body.publicacion,
              
              external_id: uuidv4(),
              //persona_id: person.id
          }).save(function (err, newPublicacion) {
               
              if(err) {
          req.flash('error', 'No se pudo subir su publicacion!');
          res.send(err);
              }else if(newPublicacion) {
          req.flash('info', 'Publicacion subida exitosamente!');
                res.redirect('/principal');           
        }
                      
          });
    //});
    }
    /**
     * 
     * @api {post} /publicarFile Permite subir archivos
     * @apiName guardarFile
     * @apiGroup PublicacionController
     *
     * @apiParam {req} req el objeto de peticion
     * @apiParam {res} res Devuelve la pagina y lista de archivos subidos 
     * 
     */
    guardarFile(req, res) {
		
		var imgUrl = uuidv4();
		var imageTempPath = req.file.path;
		var ext = path.extname(req.file.originalname).toLowerCase();
		var targetPath = path.resolve(`public/upload/${imgUrl}${ext}`);
		fs.rename(imageTempPath, targetPath);

		new Publicacion({
			id: new mongoose.Types.ObjectId(),
            
      title: req.body.title,
			description: req.body.description,
			filename: imgUrl + ext,
			ext: ext,
					
            external_id: uuidv4()
        }).save(function (err, newPublicacion) {
             
            if(err) {
				res.send(err);
            }else if(newPublicacion) {
			    res.redirect('/principal');           
			}
                    
        });
    }
    /**
     * 
     * @api {get} /principal Visualizacion de las publicaciones
     * @apiName visualizar
     * @apiGroup PublicacionController
     *
     * @apiParam {req} req el objeto de peticion
     * @apiParam {res} res Devuelve la pagina y lista de publicaciones y archivos subidos
     * 
     */
    visualizar(req, res) {
		
		Publicacion.find({}, (error, publish) => {
      res.render('main', {publish, title: 'Uneleate', 
      sesion: true,
        msg: {error: req.flash('error'), info: req.flash('info')},
        
      });
		}).sort({ timestamp: -1 });
    }
    /**
     * 
     * @api {get} /publicacion/:external Visualizacion personalizada de cada publicacion
     * @apiName verPublicacion
     * @apiGroup PublicacionController
     *
     * @apiParam {req} req el objeto de peticion
     * @apiParam {res} res Devuelve la pagina y la publicacion a la cual queremos acceder
     * 
     */
    verPersona(req, res) {
      var session = req.user;
      Cuenta.findOne({}, (error, logeado) => {
        if(logeado){
          console.log("Persona identificada" + logeado);
        }else{
          res.redirect('/principal');
        }
      });
      }
    verPublicacion(req, res) {
		Publicacion.findOne({external_id: req.params.external}, (error, publish) => {
			if(publish){
				publish.views = publish.views + 1;
				publish.save();
				Comentario.find({publish_id: req.params.external}, (error, comment) => {
					var timeago = moment(publish.timestamp).startOf('minute').fromNow();
					res.render('usuario/publicacion', {timeago, publish, comment, title: publish.title});
				});
			}else{
				res.redirect('/principal');
			}
		});
    }
	
    comment (req, res) {
      Publicacion.findOne({external_id: req.params.external},(err, publica)=>{
        if(publica){
          const newcomentario = new Comentario(req.body);
          newcomentario.publish_id = publica.external_id;
          newcomentario.save();
          res.redirect('/publicacion/'+ publica.external_id);
        }else{
          res.redirect('/principal');
        }
      });
		
		 /*const publicacion = await Publicacion.findOne({external_id: req.params.external});
			if(publicacion){
				const newcomentario = new Comentario(req.body);
				newcomentario.publish_id = publicacion.external_id;
				await newcomentario.save();
				console.log(newcomentario);
				res.redirect('/publicacion/' + publicacion.external_id);
			}else{
				res.redirect('/principal');
			}*/
    };
	getVis(req, res){
    Persona.findOne();
  }
	/**
     * 
     * @api {post} /like/:external Dar like a las publicaciones
     * @apiName like
     * @apiGroup PublicacionController
     *
     * @apiParam {req} req el objeto de peticion
     * @apiParam {res} res Devuelve la pagina y el like dado por el usuario
     * 
     */
    
    like1(req, res) {
		Publicacion.findOne({external_id: req.params.external}, function (err, publish){
			publish.likes = publish.likes + 1;
			publish.save(function (err, publish) {     
				if(err) {
					res.send(err);
				}else if(publish) {
					res.json({likes: publish.likes});           
				}
			}); 
		});
    }

    eliminar(req, res) {
		Publicacion.findOne({external_id: req.params.external}, function (err, publish){
			if(publish.ext){
				fs.unlink(path.resolve('./public/upload/'+publish.filename));
				Comentario.deleteOne({publish_id: req.params.external}, function (err, comment){});
				publish.remove(function (err, publish) {}); 
				res.redirect('/principal');
			}else{
				Comentario.deleteOne({publish_id: req.params.external}, function (err, comment){});
				publish.remove(function (err, publish) {});
				res.redirect('/principal');
			}
		});
    }
}
module.exports = PublicacionController;



