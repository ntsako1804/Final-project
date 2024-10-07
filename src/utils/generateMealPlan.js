// src/utils/generateMealPlan.js
import { fetchRecipes } from '../../services/fetchRecipes';

export const generateMealPlan = async (dietType, setMeals, setLoading) => {
    setLoading(true);
    
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const mealRequests = mealTypes.map((mealType) => 
        fetchRecipes(mealType, dietType) // Removed carbLimits, so not passing it here
    );
    
    try {
        const mealResponses = await Promise.all(mealRequests);
        const mealPlan = { breakfast: [], lunch: [], dinner: [], snack: [] };
        
        mealTypes.forEach((mealType, index) => {
            const recipes = mealResponses[index];
            if (recipes && recipes.length > 0) {
                // Ensure that lunch and dinner are not the same recipe
                let selectedRecipes;
                if (mealType === 'dinner' && mealPlan.lunch.length > 0) {
                    selectedRecipes = recipes.filter(recipe => recipe.label !== mealPlan.lunch[0].title);
                } else {
                    selectedRecipes = recipes;
                }
                
                const randomRecipe = selectedRecipes[Math.floor(Math.random() * selectedRecipes.length)];
                mealPlan[mealType] = [{ // Assigning the meal plan for each type
                    title: randomRecipe.label,
                    servings: randomRecipe.yield,
                    calories: randomRecipe.calories,
                    protein: randomRecipe.totalNutrients.PROCNT.quantity.toFixed(1),
                    fat: randomRecipe.totalNutrients.FAT.quantity.toFixed(1),
                    carb: randomRecipe.totalNutrients.CHOCDF.quantity.toFixed(1),
                    image: randomRecipe.image,
                    dietLabels: randomRecipe.dietLabels || [],
                    cholesterol: randomRecipe.totalNutrients.CHOLE.quantity.toFixed(1),
                    sodium: randomRecipe.totalNutrients.NA.quantity.toFixed(1),
                    calcium: randomRecipe.totalNutrients.CA.quantity.toFixed(1),
                    magnesium: randomRecipe.totalNutrients.MG.quantity.toFixed(1),
                    potassium: randomRecipe.totalNutrients.K.quantity.toFixed(1),
                    iron: randomRecipe.totalNutrients.FE.quantity.toFixed(1),
                }];
            } else {
                console.warn(`No recipes found for ${mealType} with ${dietType} diet`);
            }
        });
        
        setMeals(mealPlan); // Now correctly updating the state with the new meal plan object
    } catch (error) {
        console.error('Error generating meal plan:', error);
    } finally {
        setLoading(false);
    }
};
