// services/fetchRecipes.js
const APP_ID = '9925f74c';
const APP_KEY = 'f4fd6bcb931446525fafd7e5e8434dbe';

export const fetchRecipes = async (mealType, diet, carbLimit) => {
    try {
        const response = await fetch(
            `https://api.edamam.com/search?q=&diet=${diet}&mealType=${mealType}&app_id=${APP_ID}&app_key=${APP_KEY}&maxCarbs=${carbLimit}`
        );
        const data = await response.json();
        return data.hits.map((hit) => hit.recipe);
    } catch (error) {
        console.error(error);
        return [];
    }
};
