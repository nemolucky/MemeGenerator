import { useMemes } from '../../hooks/useMemes';
import './Home.css';

const Home = () => {
  const { meme, loading, error, getNewMeme, saveMeme } = useMemes();

  return (
    <div className="home-container">
      <h1>Генератор Мемов</h1>
      <div className="buttons-container">
        <button onClick={getNewMeme} disabled={loading}>
          {loading ? 'Загрузка...' : 'Новый мем'}
        </button>
        <button onClick={saveMeme} disabled={!meme || loading}>
          Сохранить
        </button>
      </div>

      {error && <p className="error">Ошибка: {error}</p>}

      {meme && (
        <div className="meme-container">
          <h2>{meme.name}</h2>
          <img src={meme.url} alt={meme.name} />
        </div>
      )}
    </div>
  );
};

export default Home;
