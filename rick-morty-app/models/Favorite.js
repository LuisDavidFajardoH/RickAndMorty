// models/Favorite.js
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  itemId: String, // ID del personaje, locación o episodio
  name: String,
  image: String, // URL de la imagen del favorito
  type: { type: String, enum: ['character', 'location', 'episode'] }, // tipo de favorito
  dateAdded: { type: Date, default: Date.now },
});

export default mongoose.model('Favorite', favoriteSchema);
