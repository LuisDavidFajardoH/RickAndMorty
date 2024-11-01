# Rick and Morty App

Este proyecto es una aplicación web construida con React y Express que permite explorar, agregar y gestionar personajes, locaciones y episodios de la serie Rick and Morty. Los usuarios pueden guardar favoritos en una base de datos MongoDB y eliminarlos según lo deseen.

## Contenido

1. [Características](#características)
2. [Instalación](#instalación)
3. [Uso](#uso)
4. [Estructura de archivos](#estructura-de-archivos)
5. [Rutas de API](#rutas-de-api)
6. [Funciones principales](#funciones-principales)

## Características

- **Frontend** desarrollado en React, ant e iconos de google, para personajes, locaciones y episodios.
- **Backend** con Express y MongoDB para almacenar y gestionar los favoritos de los usuarios.
- **Persistencia** de favoritos con almacenamiento en local y sincronización con la base de datos.
- **Desmarcado automático**: al quitar un favorito en la interfaz, se elimina también de la base de datos.
- **API REST** para interactuar con la base de datos y gestionar favoritos.

## Instalación

### Requisitos

- Node.js y npm
- MongoDB instalado y en funcionamiento

### Paso a paso

1. Clona el repositorio en tu máquina local:
    ```bash
    git clone https://github.com/tu-usuario/rick-and-morty-app.git
    cd rick-and-morty-app
    ```

2. Instala las dependencias del backend y del frontend:

    Para el backend:
    ```bash
    cd server
    npm install
    ```

    Para el frontend:
    ```bash
    cd client
    npm install
    ```

3. Configura la conexión a MongoDB en el archivo `server.js` del backend, en la variable `mongoUri`:
    ```javascript
    const mongoUri = 'mongodb://localhost:27017/Rick'; // Cambia a la URI de tu MongoDB
    ```

4. Inicia el servidor backend:
    ```bash
    cd server
    node server.js
    ```

5. Inicia el servidor frontend:
    ```bash
    cd client
    npm start
    ```

6. Accede a la aplicación en [http://localhost:3000](http://localhost:3000).

## Uso

- **Explorar personajes, locaciones y episodios**: Navega por las distintas secciones para ver la información.
- **Agregar a favoritos**: Usa el ícono de estrella en cada tarjeta para marcar un elemento como favorito. Esto guarda el favorito en la base de datos y en `localStorage`.
- **Eliminar de favoritos**: Haz clic en la estrella nuevamente para desmarcar y eliminar automáticamente el favorito de la base de datos y `localStorage`.

## Estructura de archivos

```plaintext
rick-and-morty-app/
├── client/                 # Código del frontend en React
│   ├── public/             # Archivos públicos (imágenes, favicon, etc.)
│   └── src/                # Código fuente de la aplicación React
│       ├── components/     # Componentes reutilizables
│       ├── pages/          # Páginas principales (Characters, Episodes, Locations)
│       └── App.js          # Punto de entrada de la app
├── server/                 # Código del backend en Express
│   ├── models/             # Modelos de datos (MongoDB)
│   │   └── Favorite.js     # Modelo de favoritos
│   └── server.js           # Configuración y rutas del servidor Express
└── README.md               # Documentación del proyecto
```


## Rutas de API

### POST `/favorites`
Guarda un nuevo favorito en la base de datos.

- **Body**: `{ itemId, name, image, type }`
- **Respuesta**: Mensaje de éxito o error.

### GET `/favorites`
Obtiene todos los favoritos guardados en la base de datos.

- **Respuesta**: Lista de objetos favoritos.

### DELETE `/favorites/:itemId`
Elimina un favorito de la base de datos por `itemId`.

- **Respuesta**: Mensaje de éxito o error.

---

# Funciones Principales

## Frontend

### Componentes

- **Characters**: Permite ver y agregar personajes a favoritos. Al quitar un personaje de favoritos, se envía una solicitud `DELETE` a la API para eliminarlo.
- **Locations**: Permite ver y agregar locaciones a favoritos, con la misma lógica de eliminación automática en la base de datos.
- **Episodes**: Permite ver y agregar episodios a favoritos. Incluye la opción de ver detalles de los personajes en cada episodio.

### Funcionalidades de Favoritos

- **Agregar a favoritos**: Cuando se hace clic en el ícono de estrella, se llama a `toggleFavorite`, que verifica si el elemento ya está en favoritos. Si no lo está, se guarda en la base de datos y en `localStorage`.
- **Eliminar de favoritos**: Si el elemento está en favoritos, `toggleFavorite` envía una solicitud `DELETE` al backend y actualiza `localStorage`.

## Backend

### Modelo de Favorito (`Favorite.js`)

- **itemId**: ID del elemento (personaje, locación o episodio).
- **name**: Nombre del elemento.
- **image**: URL de la imagen del elemento.
- **type**: Tipo de elemento (`character`, `location`, o `episode`).

### Rutas de API

- **POST `/favorites`**: Guarda un favorito en MongoDB.
- **GET `/favorites`**: Recupera todos los favoritos de MongoDB.
- **DELETE `/favorites/:itemId`**: Elimina un favorito específico de MongoDB según el `itemId`.

---

# Notas Adicionales

- La API de Rick and Morty se utiliza para obtener la información de personajes, episodios y locaciones.
- MongoDB se utiliza como base de datos para almacenar los favoritos del usuario.
- La aplicación sincroniza automáticamente el estado de favoritos en el frontend y el backend para mantener los datos consistentes.
