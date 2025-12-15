import axios from 'axios'
import type { Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'src/server/data/db.json')

interface Meme {
	id: string
	name: string
	url: string
	width: number
	height: number
	box_count: number
}

export const testRoute = (req: Request, res: Response) => {
	res.send('Test route from memeController!')
}

export const getMeme = async (req: Request, res: Response) => {
	try {
		const response = await axios.get('https://api.imgflip.com/get_memes')
		const memes = response.data.data.memes
		const randomMeme = memes[Math.floor(Math.random() * memes.length)]
		res.json(randomMeme)
	} catch (error) {
		console.error('Error fetching meme:', error)
		res.status(500).send('Error fetching meme')
	}
}

export const saveMeme = async (req: Request, res: Response) => {
	try {
		const newMeme: Meme = req.body

		if (!newMeme || !newMeme.id) {
			return res.status(400).send('Invalid meme data.')
		}

		const dbData = await fs.readFile(dbPath, 'utf-8')
		const db = JSON.parse(dbData)

		if (db.memes.some((meme: Meme) => meme.id === newMeme.id)) {
			return res.status(409).send('Meme already exists.')
		}

		db.memes.push(newMeme)

		await fs.writeFile(dbPath, JSON.stringify(db, null, 2))

		res.status(201).json(newMeme)
	} catch (error) {
		console.error('Error saving meme:', error)
		res.status(500).send('Error saving meme')
	}
}

export const getSavedMemes = async (req: Request, res: Response) => {
  try {
    const dbData = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(dbData);
    res.json(db.memes);
  } catch (error) {
    console.error('Error fetching saved memes:', error);
    res.status(500).send('Error fetching saved memes');
  }
};

export const deleteMeme = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dbData = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(dbData);

    const initialLength = db.memes.length;
    db.memes = db.memes.filter((meme: Meme) => meme.id !== id);

    if (db.memes.length === initialLength) {
      return res.status(404).send('Meme not found.');
    }

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting meme:', error);
    res.status(500).send('Error deleting meme');
  }
};
