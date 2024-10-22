import express from 'express';

import { getAllCocktails, getCocktail, deleteCocktail, updateCocktail, createCocktail } from '../controllers/cocktails';

export default (router: express.Router) => {
    router.get('/cocktails', getAllCocktails);
    router.get('/cocktails/:id', getCocktail);
    router.delete('/cocktails/:id', deleteCocktail);
    router.post('/cocktails/:id', updateCocktail);
    router.post('/cocktails', createCocktail);
}