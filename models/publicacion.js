'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PublicacionSchema = Schema({
    id: mongoose.Schema.Types.ObjectId,
    external_id: String,
    title: String,
    description: String,
    filename: String,
    ext: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    publish: String,
    timestamp: { type: Date, default: Date.now },
    persona_id: String    
}, false);

module.exports = mongoose.model("Publicacion", PublicacionSchema);
