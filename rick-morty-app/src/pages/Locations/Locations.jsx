import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, List, Avatar } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import Header from '../../components/Header/Header';
import './Locations.css';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favoriteLocations')) || []);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [residents, setResidents] = useState([]);
  const [visibleResidents, setVisibleResidents] = useState(5);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('https://rickandmortyapi.com/api/location');
  const [selectedResident, setSelectedResident] = useState(null);
  const [isResidentModalVisible, setIsResidentModalVisible] = useState(false);

  useEffect(() => {
    fetchLocations(currentUrl);
  }, [currentUrl]);

  const fetchLocations = async (url) => {
    try {
      const response = await axios.get(url);
      setLocations(response.data.results);
      setNextPageUrl(response.data.info.next);
      setPrevPageUrl(response.data.info.prev);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const toggleFavorite = async (location) => {
    const isFavorite = favorites.some((fav) => fav.itemId === location.id);
    let updatedFavorites;

    if (isFavorite) {
      // Eliminar de favoritos en el servidor
      try {
        await axios.delete(`http://localhost:5000/favorites/${location.id}`);
        updatedFavorites = favorites.filter((fav) => fav.itemId !== location.id);
      } catch (error) {
        console.error('Error al eliminar el favorito:', error);
        alert('Hubo un problema al eliminar el favorito.');
        return;
      }
    } else {
      // Añadir a favoritos en el servidor
      const newFavorite = {
        itemId: location.id,
        name: location.name,
        image: 'https://rickandmortyapi.com/api/character/avatar/' + location.id + '.jpeg', // Ajusta la URL de la imagen
        type: 'location',
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
    localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
  };

  const showDetails = async (location) => {
    setSelectedLocation(location);
    setIsModalVisible(true);
    setVisibleResidents(5);

    const residentPromises = location.residents.map((url) => axios.get(url));
    const residentResponses = await Promise.all(residentPromises);

    const residentData = residentResponses.map((response) => ({
      id: response.data.id,
      name: response.data.name,
      image: response.data.image,
      status: response.data.status,
      species: response.data.species,
      gender: response.data.gender,
      origin: response.data.origin.name,
      location: response.data.location.name,
    }));

    setResidents(residentData);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedLocation(null);
    setResidents([]);
  };

  const loadMoreResidents = () => {
    setVisibleResidents((prevVisible) => prevVisible + 5);
  };

  const showResidentDetails = async (residentId) => {
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${residentId}`);
    setSelectedResident(response.data);
    setIsResidentModalVisible(true);
  };

  const closeResidentModal = () => {
    setIsResidentModalVisible(false);
    setSelectedResident(null);
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
      <Header title="Locaciones" />
      <div className="locations-container">
        {locations.map((location) => (
          <Card key={location.id} hoverable style={{ width: 260 }}>
            <Card.Meta title={location.name} />
            <p className="location-details"><strong>Tipo:</strong> {location.type}</p>
            <p className="location-details"><strong>Dimensión:</strong> {location.dimension}</p>
            <Button
              icon={favorites.some((fav) => fav.itemId === location.id) ? <StarFilled /> : <StarOutlined />}
              onClick={() => toggleFavorite(location)}
              style={{ marginBottom: '10px' }}
            >
              {favorites.some((fav) => fav.itemId === location.id) ? 'Favorito' : 'Agregar a fav'}
            </Button>
            <Button onClick={() => showDetails(location)}>Ver detalles</Button>
          </Card>
        ))}
      </div>

      <div className="pagination-buttons" style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button onClick={goToPrevPage} disabled={!prevPageUrl} style={{ marginRight: '10px' }}>
          Página Anterior
        </Button>
        <Button onClick={goToNextPage} disabled={!nextPageUrl}>
          Página Siguiente
        </Button>
      </div>

      {/* Modal de Detalles de la Locación */}
      <Modal
        title={selectedLocation?.name}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {selectedLocation && (
          <div className="modal-content">
            <p><strong>Tipo:</strong> {selectedLocation.type}</p>
            <p><strong>Dimensión:</strong> {selectedLocation.dimension}</p>
            <p><strong>Cantidad de Residentes:</strong> {selectedLocation.residents.length}</p>
            <p><strong>Residentes:</strong></p>

            <List
              itemLayout="horizontal"
              dataSource={residents.slice(0, visibleResidents)}
              renderItem={(resident) => (
                <List.Item
                  className="resident-item"
                  onClick={() => showResidentDetails(resident.id)}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={resident.image} />}
                    title={<span style={{ cursor: 'pointer', color: '#1890ff' }}>{resident.name}</span>}
                  />
                </List.Item>
              )}
            />
            {visibleResidents < residents.length && (
              <Button type="link" onClick={loadMoreResidents} style={{ marginTop: '10px' }}>
                Ver más
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de Detalles del Residente */}
      <Modal
        title={selectedResident?.name}
        visible={isResidentModalVisible}
        onCancel={closeResidentModal}
        footer={null}
      >
        {selectedResident && (
          <div className="modal-content">
            <Avatar src={selectedResident.image} size={100} />
            <p><strong>Especie:</strong> {selectedResident.species}</p>
            <p><strong>Género:</strong> {selectedResident.gender}</p>
            <p><strong>Estado:</strong> {selectedResident.status}</p>
            <p><strong>Origen:</strong> {selectedResident.origin?.name}</p>
            <p><strong>Ubicación Actual:</strong> {selectedResident.location?.name}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Locations;
