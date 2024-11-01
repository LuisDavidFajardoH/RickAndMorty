import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = ({ title }) => {
  const [isMenuOpen, setMenuOpen] = useState(true);
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
 

  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const storedId = localStorage.getItem('usuario_id');
    if (storedId) {
      setUserId(storedId);
    }

    // Función para manejar el cambio de tamaño de la ventana
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);

      // Si el ancho supera los 768px (vista normal), abrimos el menú automáticamente
      if (!mobileView) {
        setMenuOpen(true);
      }
    };

    // Detectar clic fuera de la barra de navegación solo en pantallas móviles
    const handleClickOutside = (event) => {
      if (isMobile && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    // Añadir el evento de clic y redimensionamiento de la ventana
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    // Limpiar eventos al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleSubMenu = () => {
    setSubMenuOpen(!isSubMenuOpen);
  };

  
  

  return (
    <>
      <div className="navbar-top">
        <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
        <div className="navbar-tittle">
          <p>{title}</p>
        </div>
        <div className="user-info">
          <p>¡Hola Rick!</p>
          <div className="user-avatar">
            <img src="/Images/perfil.jpeg" alt="Avatar" />
          </div>
        </div>
      </div>
      <div className={`navbar-container ${isMenuOpen ? 'show' : 'hide'}`} ref={menuRef}>
        <div className="close-btn" onClick={toggleMenu}>X</div>
        <div className="navbar-title">
          <img src="/Images/navbar.png" alt="Download" className="logo" />
        </div>
        <div className="navbar-menu">
          <ul>
            <li>
              <NavLink to="/episodios" activeClassName="active">
                <span className="material-icons">dashboard</span>Episodios
              </NavLink>
            </li>
            {/* personajes */}
            <li>
              <NavLink to="/personajes" activeClassName="active">
                <span className="material-icons">people</span>Personajes
              </NavLink>
            </li>
            {/* Locaciones */}
            <li>
              <NavLink to="/locaciones" activeClassName="active">
                <span className="material-icons">location_city</span>Locaciones
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;