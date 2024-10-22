import mongoose from "mongoose";

// Schema for the ingredients
const IngredientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            max: 25,
        },
        description: {
            type: String,
            required: true,
            max: 100,
        },
        hasAlcohol: {
            type: Boolean,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    }
);

export const IngredientModel = mongoose.model("ingredients", IngredientSchema);

// Export functions to interact with the ingredients collection
export const getIngredientsFilterAndSort = (filterCriteria: Record<string, any>, sortCriteria: Record<string, any>) => IngredientModel.find(filterCriteria).sort(sortCriteria);
export const getIngredientById = (id: string) => IngredientModel.findById(id);
export const createNewIngredient = (values: Record<string, any>) => new IngredientModel(values).save().then((ingredient) => ingredient.toObject());
export const deleteIngredientById = (id: string) => IngredientModel.findOneAndDelete({ _id: id });