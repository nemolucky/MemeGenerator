import { useEffect, useState } from 'react';
import './Library.css';

interface Meme {
  id: string;
  name: string;
  url: string;
}

const Library = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('/api/memes');
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        const data: Meme[] = await response.json();
        setMemes(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Произошла неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/memes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Не удалось удалить мем.');
      }

      // Update UI by removing the deleted meme
      setMemes((prevMemes) => prevMemes.filter((meme) => meme.id !== id));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Произошла неизвестная ошибка при удалении');
      }
    }
  };

  if (loading) return <p>Загрузка библиотеки...</p>;
  if (error) return <p className="error">Ошибка: {error}</p>;

  return (
    <div className="library-container">
      <h1>Сохраненные Мемы</h1>
      {memes.length === 0 ? (
        <p>Пока нет сохраненных мемов.</p>
      ) : (
        <div className="meme-grid">
          {memes.map((meme) => (
            <div key={meme.id} className="grid-item">
              <img src={meme.url} alt={meme.name} />
              <p>{meme.name}</p>
              <button onClick={() => handleDelete(meme.id)}>Удалить</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
