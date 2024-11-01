import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Modal, List, Avatar } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import Header from "../../components/Header/Header";
import "./Episodes.css";

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [visibleCharacters, setVisibleCharacters] = useState(5);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    "https://rickandmortyapi.com/api/episode"
  );

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isCharacterModalVisible, setIsCharacterModalVisible] = useState(false);

  useEffect(() => {
    fetchEpisodes(currentUrl);
  }, [currentUrl]);

  const fetchEpisodes = async (url) => {
    try {
      const response = await axios.get(url);
      setEpisodes(response.data.results);
      setNextPageUrl(response.data.info.next);
      setPrevPageUrl(response.data.info.prev);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

  const toggleFavorite = async (episode) => {
    const isFavorite = favorites.some((fav) => fav.itemId === episode.id);
    let updatedFavorites;

    if (isFavorite) {
      // Si el episodio está en favoritos, envía una solicitud DELETE
      try {
        await axios.delete(`http://localhost:5000/favorites/${episode.id}`);
        updatedFavorites = favorites.filter((fav) => fav.itemId !== episode.id);
      } catch (error) {
        console.error("Error al eliminar el favorito:", error);
        alert("Hubo un problema al eliminar el favorito.");
        return;
      }
    } else {
      // Si el episodio no está en favoritos, envía una solicitud POST
      const newFavorite = {
        itemId: episode.id,
        name: episode.name,
        image: `https://rickandmortyapi.com/api/character/avatar/${episode.id}.jpeg`,
        type: "episode",
      };

      try {
        await axios.post("http://localhost:5000/favorites", newFavorite);
        updatedFavorites = [...favorites, newFavorite];
      } catch (error) {
        console.error("Error al guardar el favorito:", error);
        alert("Hubo un problema al guardar el favorito.");
        return;
      }
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const showDetails = async (episode) => {
    setSelectedEpisode(episode);
    setIsModalVisible(true);
    setVisibleCharacters(5);

    const characterPromises = episode.characters.map((url) => axios.get(url));
    const characterResponses = await Promise.all(characterPromises);

    const characterData = characterResponses.map((response) => ({
      id: response.data.id,
      name: response.data.name,
      status: response.data.status,
      origin: response.data.origin.name,
      image: response.data.image,
    }));

    setCharacters(characterData);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedEpisode(null);
    setCharacters([]);
  };

  const loadMoreCharacters = () => {
    setVisibleCharacters((prevVisible) => prevVisible + 5);
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

  const showCharacterDetails = async (characterId) => {
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/${characterId}`
      );
      setSelectedCharacter(response.data);
      setIsCharacterModalVisible(true);
    } catch (error) {
      console.error("Error fetching character details:", error);
    }
  };

  const closeCharacterModal = () => {
    setIsCharacterModalVisible(false);
    setSelectedCharacter(null);
  };

  return (
    <>
      <Header title="Episodios" />
      <div className="episodes-container">
        {episodes.map((episode) => (
          <Card
            key={episode.id}
            hoverable
            style={{ width: 260 }}
            cover={
              <img
                alt="thumbnail"
                src={`https://rickandmortyapi.com/api/character/avatar/${episode.id}.jpeg`}
              />
            }
          >
            <Card.Meta
              title={episode.name}
              description={`Episodio: ${episode.episode}`}
            />
            <p className="episode-details">
              Fecha de emisión: {episode.air_date}
            </p>
            <div className="actions-container">
              <Button
                icon={
                  favorites.some((fav) => fav.itemId === episode.id) ? (
                    <StarFilled className="star-icon" />
                  ) : (
                    <StarOutlined />
                  )
                }
                onClick={() => toggleFavorite(episode)}
              >
                {favorites.some((fav) => fav.itemId === episode.id)
                  ? "Favorito"
                  : "Agregar a fav"}
              </Button>
              <Button onClick={() => showDetails(episode)}>Ver detalles</Button>
            </div>
          </Card>
        ))}
      </div>

      <div
        className="pagination-buttons"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        <Button
          onClick={goToPrevPage}
          disabled={!prevPageUrl}
          style={{ marginRight: "10px" }}
        >
          Página Anterior
        </Button>
        <Button onClick={goToNextPage} disabled={!nextPageUrl}>
          Página Siguiente
        </Button>
      </div>

      {/* Modal de Detalles del Episodio */}
      <Modal
        title={selectedEpisode?.name}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {selectedEpisode && (
          <>
            <p>
              <strong>Episodio:</strong> {selectedEpisode.episode}
            </p>
            <p>
              <strong>Fecha de emisión:</strong> {selectedEpisode.air_date}
            </p>
            <p>
              <strong>Personajes:</strong>
            </p>

            <List
              itemLayout="horizontal"
              dataSource={characters.slice(0, visibleCharacters)}
              renderItem={(character) => (
                <List.Item
                  className="character-item"
                  onClick={() => showCharacterDetails(character.id)}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={character.image} />}
                    title={<span style={{ cursor: 'pointer', color: '#1890ff' }}>{character.name}</span>}
                    description={`Estado: ${character.status} | Origen: ${character.origin}`}
                  />
                </List.Item>
              )}
            />

            {visibleCharacters < characters.length && (
              <Button
                type="link"
                onClick={loadMoreCharacters}
                style={{ marginTop: "10px" }}
              >
                Ver más
              </Button>
            )}
          </>
        )}
      </Modal>

      {/* Modal de Detalles del Personaje */}
      <Modal
        title={selectedCharacter?.name}
        visible={isCharacterModalVisible}
        onCancel={closeCharacterModal}
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
            <p><strong>Participaciones en episodios:</strong> {selectedCharacter.episode.length}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Episodes;
