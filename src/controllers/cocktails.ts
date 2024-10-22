import express from 'express';
import mongoose from 'mongoose';
import { getCocktailById, deleteCocktailById, createNewCocktail, getCocktailsFilterAndSort } from '../db/cocktails';
import { getIngredientById } from '../db/ingredients';

// Get all cocktails with optional filters and sorting
export const getAllCocktails = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const name = (req.query.name || "") as string;
        const category = (req.query.category || "") as string;
        const instruction = (req.query.instruction || "") as string;
        const sortBy = (req.query.sortBy || "name") as string;
        const sortOrder = (req.query.sortOrder || "asc") as string;

        let sortCriteria: Record<string, any> = {};
        sortCriteria[sortBy] = sortOrder;

        const filterCriteria: Record<string, any> = {
            name: { $regex: name, $options: "i" },
            category: { $regex: category, $options: "i" },
            instruction: { $regex: instruction, $options: "i" },
        };

        const cocktails = await getCocktailsFilterAndSort(filterCriteria, sortCriteria);

        res.status(200).json(cocktails).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
};

// Get a single cocktail by ID
export const getCocktail = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const cocktail = await getCocktailById(id);

        if (!cocktail) {
            res.sendStatus(404);
            return;
        }

        res.status(200).json(cocktail).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
};

// Create a new cocktail
export const createCocktail = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { name, category, instruction, ingredients } = req.body;

        if (!name || !category || !instruction || !ingredients) {
            res.sendStatus(401);
            return;
        }
        
        // Check that ingredients is an array
        if (!Array.isArray(ingredients)) {
            res.status(400).send({ error: 'Ingredients should be an array' });
            return;
        }

        // Check that each ingredient has the required fields and exists in the DB
        for (let i = 0; i < ingredients.length; i++) {
            const ingredient = ingredients[i];
            const { ingredientId, amount } = ingredient;
            
            if (!ingredientId || !amount) {
                res.sendStatus(400);
                return;
            }

            // Check if ingredientId is valid
            if (!mongoose.isValidObjectId(ingredientId)) {
                res.status(400).send({ error: `Invalid ingredientId: ${ingredientId}` });
                return;
            }

            // Ensure no duplicate ingredients
            for (let j = i + 1; j < ingredients.length; j++) {
                if (ingredients[j].ingredientId === ingredientId) {
                    res.status(400).send({ error: `Duplicate ingredientId: ${ingredientId}` });
                    return;
                }
            }

            const foundIngredient = await getIngredientById(ingredientId);
            
            if (!foundIngredient) {
                res.sendStatus(404); // Not found if the ingredientId is invalid
                return;
            }
        }

        const newCocktail = await createNewCocktail({ name, category, instruction, ingredients });

        res.status(201).json(newCocktail).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(405);
        return;
    }
};

// Update a cocktail by ID with optional fields to update
export const updateCocktail = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, category, instruction, ingredients } = req.body;

        if (!name && !category && !instruction && !ingredients) {
            res.sendStatus(400);
            return;
        }

        const updatedCocktail = await getCocktailById(id);

        if (!updatedCocktail) {
            res.sendStatus(404);
            return;
        }

        if (name) {
            updatedCocktail.name = name;
        }

        if (category) {
            updatedCocktail.category = category;
        }

        if (instruction) {
            updatedCocktail.instruction = instruction;
        }

        if (ingredients) {
            updatedCocktail.ingredients = ingredients;
        }

        await updatedCocktail.save();

        res.json(updatedCocktail).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};

// Delete a cocktail by ID and return the deleted cocktail
export const deleteCocktail = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.sendStatus(400);
            return;
        }

        const deletedCocktail = await deleteCocktailById(id);

        if (!deletedCocktail) {
            res.sendStatus(404);
            return;
        }

        res.json(deletedCocktail).end();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};