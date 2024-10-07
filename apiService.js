// apiService.js
export const searchRecipes = async (query) => {
  const url = 'https://recipe-food-nutrition15.p.rapidapi.com/recipee-search';
  const options = {
      method: 'POST',
      headers: {
          'x-rapidapi-key': 'fced76fc98msh714ee8e3d9dc629p135665jsnfe18451cce99',
          'x-rapidapi-host': 'recipe-food-nutrition15.p.rapidapi.com',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
  };

  try {
      const response = await fetch(url, options);
      if (!response.ok) {
          throw new Error('Failed to fetch recipes');
      }
      const result = await response.json();
      return result;
  } catch (error) {
      console.error(error);
      throw error;
  }
};
