import mongoose from "mongoose";

const IIngredient = new mongoose.Schema(
    {
        ingredientId: {
            type: String,
            required: true,
            max: 50,
        },
        amount: {
            type: String,
            required: true,
            max: 100,
        }
    }
);

const CocktailSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            max: 25,
        },
        category: {
            type: String,
            required: true,
            max: 25,
        },
        instruction: {
            type: String,
            required: true,
            max: 500,
        },
        ingredients: {
            type: [IIngredient],
            required: true,
        }
    }
);

export const CocktailModel = mongoose.model("cocktails", CocktailSchema);

export const getCocktailsFilterAndSort = (filterCriteria: Record<string, any>, sortCriteria: Record<string, any>) => CocktailModel.find(filterCriteria).sort(sortCriteria);
export const getCocktailById = (id: string) => CocktailModel.findById(id);
export const createNewCocktail = (values: Record<string, any>) => new CocktailModel(values).save().then((cocktail) => cocktail.toObject());
export const deleteCocktailById = (id: string) => CocktailModel.findOneAndDelete({ _id: id });