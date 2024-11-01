import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Row, Col, Avatar, Button } from 'antd';
import { StarOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Header from '../../components/Header/Header';
import './Home.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  const [favorites, setFavorites] = useState([]);

  // Obtener favoritos desde el backend cuando se carga la página
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:5000/favorites');
        setFavorites(response.data);
      } catch (error) {
        console.error('Error al obtener favoritos:', error);
      }
    };
    fetchFavorites();
  }, []);

  // Función para eliminar un favorito
  const removeFavorite = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/favorites/${itemId}`);
      setFavorites(favorites.filter((fav) => fav.itemId !== itemId));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  return (
    <>
      <Header title="Bienvenido a la App de Rick y Morty" />
      <div className="home-container">
        {/* Introducción */}
        <Card className="intro-card">
          <Title level={2}>¿Cómo funciona esta aplicación?</Title>
          <Paragraph>
            Esta aplicación te permite explorar los personajes, episodios y locaciones de Rick y Morty. Puedes marcar tus favoritos y gestionar tu lista personal, 
            todo almacenado de manera segura en una base de datos.
          </Paragraph>
        </Card>

        {/* Guía Rápida en formato de tarjetas */}
        <div className="quick-guide-container">
          <Title level={3} style={{ textAlign: 'center' }}>Guía Rápida</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Card className="guide-card" hoverable>
                <StarOutlined style={{ fontSize: '24px', color: '#FFD700' }} />
                <Title level={4}>Agregar a Favoritos</Title>
                <Paragraph>
                  Haz clic en el ícono de estrella para agregar un personaje, locación o episodio a favoritos. Se añadirá automáticamente a tu lista y se guardará en la base de datos.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="guide-card" hoverable>
                <DeleteOutlined style={{ fontSize: '24px', color: '#FF6347' }} />
                <Title level={4}>Eliminar de Favoritos</Title>
                <Paragraph>
                  Haz clic nuevamente en el ícono de estrella para eliminar un favorito de tu lista y de la base de datos.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="guide-card" hoverable>
                <EyeOutlined style={{ fontSize: '24px', color: '#87CEEB' }} />
                <Title level={4}>Ver Favoritos Actuales</Title>
                <Paragraph>
                  Ven a esta sección y al final podras administrar tus favoritos
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Favoritos Actuales en formato de grilla */}
        <div className="favorites-section">
          <Title level={3} style={{ textAlign: 'center' }}>Tus Favoritos</Title>
          <Row gutter={16}>
            {favorites.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.itemId}>
                <Card
                  className="favorite-card"
                  hoverable
                  cover={<Avatar src={item.image} size={120} style={{ margin: '20px auto' }} />}
                  actions={[
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => removeFavorite(item.itemId)}
                    >
                      Eliminar
                    </Button>,
                  ]}
                >
                  <Card.Meta title={item.name} description={`Tipo: ${item.type}`} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home;
