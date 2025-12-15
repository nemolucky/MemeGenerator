import { useState, useCallback } from 'react';

interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export const useMemes = () => {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNewMeme = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/memes/new');
      if (!response.ok) {
        throw new Error('Ошибка сети');
      }
      const data: Meme = await response.json();
      setMeme(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMeme = useCallback(async () => {
    if (!meme) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/memes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meme),
      });
      if (!response.ok) {
        // You might want to handle different statuses differently
        const errorText = await response.text();
        throw new Error(errorText || 'Не удалось сохранить мем');
      }
      // Maybe show a success message to the user
      alert('Мем сохранен!');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Произошла неизвестная ошибка при сохранении');
      }
    } finally {
      setLoading(false);
    }
  }, [meme]);

  return {
    meme,
    loading,
    error,
    getNewMeme,
    saveMeme,
  };
};
