import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // все состояния 
  const [images, setImages] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [favoriteCats, setFavoriteCats] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // массив с котиками 
  const catsData = [
    { id: 1, src: "/images/cat1.jpg", name: "Рыжик", tags: ["рыжий", "игривый", "молодой"], fav: false },
    { id: 2, src: "/images/cat2.jpg", name: "Мурка", tags: ["серый", "спокойный", "взрослый"], fav: false },
    { id: 3, src: "/images/cat3.jpg", name: "Барсик", tags: ["полосатый", "ласковый", "домашний"], fav: false },
    { id: 4, src: "/images/cat4.jpg", name: "Снежок", tags: ["белый", "пушистый", "нежный"], fav: false },
    { id: 5, src: "/images/cat5.jpg", name: "Васька", tags: ["черный", "хитрый", "ночной"], fav: false },
    { id: 6, src: "/images/cat6.jpg", name: "Дымок", tags: ["дымчатый", "элегантный", "спокойный"], fav: false },
    { id: 7, src: "/images/cat7.jpg", name: "Персик", tags: ["рыжий", "ласковый", "молодой"], fav: false },
    { id: 8, src: "/images/cat8.jpg", name: "Зефирка", tags: ["белый", "пушистый", "сладкий"], fav: false },
    { id: 9, src: "/images/cat9.jpg", name: "Тигра", tags: ["полосатый", "дикий", "активный"], fav: false },
    { id: 10, src: "/images/cat10.jpg", name: "Серафима", tags: ["серый", "мудрая", "спокойная"], fav: false },
    { id: 11, src: "/images/cat11.jpg", name: "Ночка", tags: ["черный", "загадочный", "ночная"], fav: false },
    { id: 12, src: "/images/cat12.jpg", name: "Пушок", tags: ["белый", "пушистый", "добрый"], fav: false }
  ];

  // загружаем избранное когда сайт открывается
  useEffect(() => {
    const savedFavs = localStorage.getItem('myCatFavorites');
    if (savedFavs) {
      try {
        setFavoriteCats(JSON.parse(savedFavs));
      } catch (e) {
        console.log('Ошибка при загрузке избранного:', e);
      }
    }
    // показываем всех котиков сначала
    setImages(catsData);
  }, []);

  // сохраняем избранное когда оно меняется
  useEffect(() => {
    localStorage.setItem('myCatFavorites', JSON.stringify(favoriteCats));
  }, [favoriteCats]);

  // функция поиска котиков
  const handleSearch = () => {
    if (!searchText.trim()) {
      setImages(catsData);
      setErrorMessage('');
      return;
    }

    setIsLoading(true);
    
    // делаем задержку как будто ищем
    setTimeout(() => {
      const foundCats = catsData.filter(cat => {
        const nameMatch = cat.name.toLowerCase().includes(searchText.toLowerCase());
        const tagMatch = cat.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
        return nameMatch || tagMatch;
      });
      
      setImages(foundCats);
      
      if (foundCats.length === 0) {
        setErrorMessage('К сожалению, таких котиков нет :(');
      } else {
        setErrorMessage('');
      }
      
      setIsLoading(false);
    }, 600);
  };

  // показать всех котиков
  const showAll = () => {
    setImages(catsData);
    setSearchText('');
    setErrorMessage('');
    setShowOnlyFavorites(false);
  };

  // показать избранных котиков
  const toggleFavoritesView = () => {
    const newShowFavorites = !showOnlyFavorites;
    setShowOnlyFavorites(newShowFavorites);
    if (newShowFavorites) {
      setImages(favoriteCats);
    } else {
      setImages(catsData);
    }
  };

  // добавить или убрать из избранного
  const handleFavoriteClick = (cat) => {
    const alreadyFavorite = favoriteCats.find(f => f.id === cat.id);
    
    if (alreadyFavorite) {
      // убираем из избранного
      setFavoriteCats(favoriteCats.filter(f => f.id !== cat.id));
    } else {
      // добавляем в избранное
      setFavoriteCats([...favoriteCats, { ...cat, fav: true }]);
    }

    // обновляем картинку в основном списке
    const updatedImages = images.map(img => 
      img.id === cat.id ? { ...img, fav: !alreadyFavorite } : img
    );
    setImages(updatedImages);
  };

  // проверка - в избранном ли котик
  const checkIfFavorite = (catId) => {
    return favoriteCats.some(f => f.id === catId);
  };

  // котики для показа
  const catsToShow = showOnlyFavorites ? favoriteCats : images;

  return (
    <div className="app">
      <header className="header">
        <h1> Галерея милых котиков</h1>
        <p>Здесь я храню фотографии милых котиков - всего {catsData.length} фото!</p>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Искать по имени или описанию..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="search-input"
        />
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="search-btn"
        >
          {isLoading ? 'Ищем...' : 'Найти котика'}
        </button>
        <button 
          onClick={showAll}
          className="search-btn"
        >
          Все котики
        </button>
        <button 
          onClick={toggleFavoritesView}
          className={showOnlyFavorites ? 'search-btn active-fav' : 'search-btn'}
        >
          {showOnlyFavorites ? 'Показать всех' : `Избранные (${favoriteCats.length})`}
        </button>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {isLoading && <div className="loading-message">Загружаем котиков... 🐾</div>}

      {!isLoading && catsToShow.length > 0 && (
        <section className="cats-section">
          <h2 className="section-title">
            {showOnlyFavorites ? 'Мои любимые котики' : 'Все котики в галерее'} ({catsToShow.length})
          </h2>
          <div className="cats-grid">
            {catsToShow.map((cat) => (
              <div key={cat.id} className="cat-card">
                <img 
                  src={cat.src} 
                  alt={cat.name}
                  onClick={() => window.open(cat.src, '_blank')}
                  className="cat-image"
                />
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <div className="tags-container">
                    {cat.tags.map((tag, idx) => (
                      <span key={idx} className="cat-tag">{tag}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleFavoriteClick(cat)}
                    className="favorite-button"
                  >
                    {checkIfFavorite(cat.id) ? '❤️ Уже в избранном' : '🤍 Добавить в избранное'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isLoading && catsToShow.length === 0 && !errorMessage && (
        <div className="empty-message">
          <p>Тут пока нет котиков...</p>
        </div>
      )}
    </div>
  );
}

export default App;
