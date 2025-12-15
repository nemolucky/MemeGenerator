import express from 'express';
import * as memeController from '../controllers/memeController.ts';

const router = express.Router();

router.get('/test', memeController.testRoute);
router.get('/memes/new', memeController.getMeme);
router.get('/memes', memeController.getSavedMemes);
router.post('/memes', memeController.saveMeme);
router.delete('/memes/:id', memeController.deleteMeme);

export default router;
