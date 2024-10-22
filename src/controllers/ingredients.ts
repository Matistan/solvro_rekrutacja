import express from 'express';

import { deleteIngredientById, getIngredientById, createNewIngredient, getIngredientsFilterAndSort } from '../db/ingredients';

// Get all ingredients with optional filters and sorting
export const getAllIngredients = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const name = (req.query.name || "") as string;
        const hasAlcohol = (req.query.hasAlcohol || false) as boolean;
        const description = (req.query.description || "") as string;
        const image = (req.query.image || "") as string;
        const sortBy = (req.query.sortBy || "name") as string;
        const sortOrder = (req.query.sortOrder || "asc") as string;

        let sortCriteria: Record<string, any> = {};
        sortCriteria[sortBy] = sortOrder;

        const filterCriteria: Record<string, any> = {
            name: { $regex: name, $options: "i" },
            description: { $regex: description, $options: "i" },
            image: { $regex: image, $options: "i" },
        };

        if (hasAlcohol) {
            filterCriteria.hasAlcohol = hasAlcohol;
        }

        const ingredients = await getIngredientsFilterAndSort(filterCriteria, sortCriteria);

        res.status(200).json(ingredients).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
};

// Get a single ingredient by ID
export const getIngredient = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const ingredient = await getIngredientById(id);

        if (!ingredient) {
            res.sendStatus(404);
            return;
        }

        res.status(200).json(ingredient).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
};

// Delete an ingredient by ID and return the deleted ingredient
export const deleteIngredient = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const deletedIngredient = await deleteIngredientById(id);

        if (!deletedIngredient) {
            res.sendStatus(404);
            return;
        }

        res.json(deletedIngredient).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};

// Create a new ingredient
export const createIngredient = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { name, description, hasAlcohol, image } = req.body;

        if (!name || !description || !hasAlcohol || !image) {
            res.sendStatus(400);
            return;
        }

        const ingredient = await createNewIngredient(
            {
                name,
                description,
                hasAlcohol,
                image
            }
        );

        res.status(201).json(ingredient).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
};

// Update an ingredient by ID with optional fields to update
export const updateIngredient = async (req: express.Request, res: express.Response): Promise<void> => {
    try { 
        const { id } = req.params;
        const { name, description, hasAlcohol, image } = req.body;

        if (!name && !description && !hasAlcohol && !image) {
            res.sendStatus(403);
            return;
        }

        const ingredient = await getIngredientById(id);

        if (!ingredient) {
            res.sendStatus(404);
            return;
        }

        if (name) {
            ingredient.name = name;
        }

        if (description) {
            ingredient.description = description;
        }

        if (hasAlcohol) {
            ingredient.hasAlcohol = hasAlcohol;
        }

        if (image) {
            ingredient.image = image;
        }
        
        await ingredient.save();

        res.status(200).json(ingredient).end();
        return
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};