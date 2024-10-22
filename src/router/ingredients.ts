import express from 'express';

import { getAllIngredients, getIngredient, deleteIngredient, updateIngredient, createIngredient } from '../controllers/ingredients';

// Export the routes for the ingredients
export default (router: express.Router) => {
    router.get('/ingredients', getAllIngredients);
    router.get('/ingredients/:id', getIngredient);
    router.delete('/ingredients/:id', deleteIngredient);
    router.post('/ingredients/:id', updateIngredient);
    router.post('/ingredients', createIngredient);
}