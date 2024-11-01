import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import Favorite from './models/Favorite.js'; 

const app = express();

// Configuración del middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
const mongoUri = 'mongodb://localhost:27017/Rick';
mongoose.connect(mongoUri)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Ruta para añadir un favorito
app.post('/favorites', async (req, res) => {
  try {
    const { itemId, name, image, type } = req.body;
    const newFavorite = new Favorite({ itemId, name, image, type });
    await newFavorite.save();
    res.status(201).json({ message: 'Favorito guardado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el favorito' });
  }
});

// Ruta para obtener todos los favoritos
app.get('/favorites', async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// Ruta para eliminar un favorito por su itemId
app.delete('/favorites/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedFavorite = await Favorite.findOneAndDelete({ itemId });

    if (deletedFavorite) {
      res.status(200).json({ message: 'Favorito eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Favorito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el favorito' });
  }
});

// Puerto y conexión
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
