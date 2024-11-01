import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Avatar } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import Header from '../../components/Header/Header';
import './Characters.css';

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favoriteCharacters')) || []);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('https://rickandmortyapi.com/api/character');

  useEffect(() => {
    fetchCharacters(currentUrl);
  }, [currentUrl]);

  const fetchCharacters = async (url) => {
    try {
      const response = await axios.get(url);
      setCharacters(response.data.results);
      setNextPageUrl(response.data.info.next);
      setPrevPageUrl(response.data.info.prev);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const toggleFavorite = async (character) => {
    const isFavorite = favorites.some((fav) => fav.itemId === character.id);
    let updatedFavorites;

    if (isFavorite) {
      // Si el personaje está en favoritos, envía una solicitud DELETE
      try {
        await axios.delete(`http://localhost:5000/favorites/${character.id}`);
        updatedFavorites = favorites.filter((fav) => fav.itemId !== character.id);
      } catch (error) {
        console.error('Error al eliminar el favorito:', error);
        alert('Hubo un problema al eliminar el favorito.');
        return;
      }
    } else {
      // Si el personaje no está en favoritos, envía una solicitud POST
      const newFavorite = {
        itemId: character.id,
        name: character.name,
        image: character.image,
        type: 'character',
      };

      try {
        await axios.post('http://localhost:5000/favorites', newFavorite);
        updatedFavorites = [...favorites, newFavorite];
      } catch (error) {
        console.error('Error al guardar el favorito:', error);
        alert('Hubo un problema al guardar el favorito.');
        return;
      }
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteCharacters', JSON.stringify(updatedFavorites));
  };

  const showDetails = (character) => {
    setSelectedCharacter(character);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedCharacter(null);
  };

  const goToNextPage = () => {
    if (nextPageUrl) {
      setCurrentUrl(nextPageUrl);
    }
  };

  const goToPrevPage = () => {
    if (prevPageUrl) {
      setCurrentUrl(prevPageUrl);
    }
  };

  return (
    <>
      <Header title="Personajes" />
      <div className="characters-container">
        {characters.map((character) => (
          <Card
            key={character.id}
            hoverable
            style={{ width: 260 }}
            cover={<img alt="character" src={character.image} />}
          >
            <Card.Meta title={character.name} />
            <p className="character-details"><strong>Especie:</strong> {character.species}</p>
            <p className="character-details"><strong>Género:</strong> {character.gender}</p>
            <p className="character-details"><strong>Estado:</strong> {character.status}</p>
            <div className="actions-container">
              <Button
                icon={favorites.some((fav) => fav.itemId === character.id) ? <StarFilled className="star-icon" /> : <StarOutlined />}
                onClick={() => toggleFavorite(character)}
              >
                {favorites.some((fav) => fav.itemId === character.id) ? 'Favorito' : 'Agregar a fav'}
              </Button>
              <Button onClick={() => showDetails(character)}>Ver detalles</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination-buttons" style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button onClick={goToPrevPage} disabled={!prevPageUrl} style={{ marginRight: '10px' }}>
          Página Anterior
        </Button>
        <Button onClick={goToNextPage} disabled={!nextPageUrl}>
          Página Siguiente
        </Button>
      </div>

      {/* Modal de Detalles del Personaje */}
      <Modal
        title={selectedCharacter?.name}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {selectedCharacter && (
          <div className="modal-content">
            <Avatar src={selectedCharacter.image} size={100} />
            <p><strong>Especie:</strong> {selectedCharacter.species}</p>
            <p><strong>Género:</strong> {selectedCharacter.gender}</p>
            <p><strong>Estado:</strong> {selectedCharacter.status}</p>
            <p><strong>Origen:</strong> {selectedCharacter.origin.name}</p>
            <p><strong>Ubicación actual:</strong> {selectedCharacter.location.name}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Characters;
