import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const localCatImages = [
    {
      id: 1,
      url: "/images/cat1.jpg",
      name: "Рыжик",
      tags: ["рыжий", "игривый", "молодой"],
      favorite: false
    },
    {
      id: 2,
      url: "/images/cat2.jpg", 
      name: "Мурка",
      tags: ["серый", "спокойный", "взрослый"],
      favorite: false
    },
    {
      id: 3,
      url: "/images/cat3.jpg",
      name: "Барсик",
      tags: ["полосатый", "ласковый", "домашний"],
      favorite: false
    },
    {
      id: 4,
      url: "/images/cat4.jpg",
      name: "Снежок",
      tags: ["белый", "пушистый", "нежный"],
      favorite: false
    },
    {
      id: 5,
      url: "/images/cat5.jpg",
      name: "Васька",
      tags: ["черный", "хитрый", "ночной"],
      favorite: false
    },
    {
      id: 6,
      url: "/images/cat6.jpg",
      name: "Дымок",
      tags: ["дымчатый", "элегантный", "спокойный"],
      favorite: false
    },
    {
      id: 7,
      url: "/images/cat7.jpg",
      name: "Персик",
      tags: ["рыжий", "ласковый", "молодой"],
      favorite: false
    },
    {
      id: 8,
      url: "/images/cat8.jpg",
      name: "Зефирка",
      tags: ["белый", "пушистый", "сладкий"],
      favorite: false
    },
    {
      id: 9,
      url: "/images/cat9.jpg",
      name: "Тигра",
      tags: ["полосатый", "дикий", "активный"],
      favorite: false
    },
    {
      id: 10,
      url: "/images/cat10.jpg",
      name: "Серафима",
      tags: ["серый", "мудрая", "спокойная"],
      favorite: false
    },
    {
      id: 11,
      url: "/images/cat11.jpg",
      name: "Ночка",
      tags: ["черный", "загадочный", "ночная"],
      favorite: false
    },
    {
      id: 12,
      url: "/images/cat12.jpg",
      name: "Пушок",
      tags: ["белый", "пушистый", "добрый"],
      favorite: false
    }
  ];

  // Загрузка избранного из localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('catFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    // Показываем локальные картинки при загрузке
    setImages(localCatImages);
  }, []);

  // Сохранение избранного в localStorage
  useEffect(() => {
    localStorage.setItem('catFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Функция поиска по вашим картинкам
  const searchImages = () => {
    if (!searchTerm.trim()) {
      setImages(localCatImages);
      setError('');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const filteredImages = localCatImages.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      setImages(filteredImages);
      
      if (filteredImages.length === 0) {
        setError('Котики по вашему запросу не найдены');
      } else {
        setError('');
      }
      
      setLoading(false);
    }, 500);
  };

  // Показать все картинки
  const showAllCats = () => {
    setImages(localCatImages);
    setSearchTerm('');
    setError('');
    setShowFavorites(false);
  };

  // Показать только избранное
  const showFavoritesOnly = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setImages(favorites);
    } else {
      setImages(localCatImages);
    }
  };

  // Добавление/удаление из избранного
  const toggleFavorite = (image) => {
    const isFavorite = favorites.find(fav => fav.id === image.id);
    
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== image.id));
    } else {
      setFavorites([...favorites, { ...image, favorite: true }]);
    }

    // Обновляем состояние в основном массиве
    const updatedImages = images.map(img => 
      img.id === image.id ? { ...img, favorite: !isFavorite } : img
    );
    setImages(updatedImages);
  };

  // Проверка, находится ли изображение в избранном
  const isFavorite = (imageId) => {
    return favorites.some(fav => fav.id === imageId);
  };

  // Отображение картинок в зависимости от состояния
  const displayedImages = showFavorites ? favorites : images;

  return (
    <div className="app">
      <div className="header">
        <h1>🐱 Моя галерея котиков</h1>
        <p>Мои любимые котики - {localCatImages.length} фото</p>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Поиск по имени или описанию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchImages()}
          className="search-input"
        />
        <button 
          onClick={searchImages}
          disabled={loading}
          className="search-btn"
        >
          {loading ? 'Поиск...' : 'Найти котика'}
        </button>
        <button 
          onClick={showAllCats}
          className="search-btn"
        >
          Все котики
        </button>
        <button 
          onClick={showFavoritesOnly}
          className={showFavorites ? 'search-btn active' : 'search-btn'}
        >
          {showFavorites ? 'Все котики' : `Избранные (${favorites.length})`}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Ищем котиков... 🐾</div>}

      {!loading && displayedImages.length > 0 && (
        <div className="images-section">
          <h2 className="section-title">
            {showFavorites ? 'Любимые котики' : 'Все котики'} ({displayedImages.length})
          </h2>
          <div className="images-grid">
            {displayedImages.map((image) => (
              <div key={image.id} className="image-card">
                <img 
                  src={image.url} 
                  alt={image.name}
                  onClick={() => window.open(image.url, '_blank')}
                />
                <div className="image-info">
                  <h3>{image.name}</h3>
                  <div className="image-tags">
                    {image.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => toggleFavorite(image)}
                    className="favorite-btn"
                  >
                    {isFavorite(image.id) ? '❤️ Убрать' : '🤍 В избранное'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && displayedImages.length === 0 && !error && (
        <div className="no-results">
          <p>Котики не найдены</p>
        </div>
      )}
    </div>
  );
}

export default App;