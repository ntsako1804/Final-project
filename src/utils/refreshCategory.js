// src/utils/refreshCategory.js
import { fetchRecipes } from '../../services/fetchRecipes';

export const refreshCategory = async (mealType, dietType, carbLimits, setMeals, setLoading) => {
    setLoading(true);
    try {
        const recipes = await fetchRecipes(mealType, dietType, carbLimits[mealType]);
        if (recipes && recipes.length > 0) {
            const selectedRecipes = recipes
                .filter((recipe) => recipe.totalNutrients.CHOCDF.quantity <= carbLimits[mealType])
                .slice(0, 2);

            setMeals((prevMeals) => ({
                ...prevMeals,
                [mealType]: selectedRecipes,
            }));
        } else {
            console.warn(`No recipes found for ${mealType} with ${dietType} diet`);
        }
    } catch (error) {
        console.error('Error refreshing category:', error);
    } finally {
        setLoading(false);
    }
};

