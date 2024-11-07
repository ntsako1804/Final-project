// apiService.js
const API_KEY = 'e4a7a9dd91msh817f0c289997533p17fda4jsn8abb05d2506e';
const API_HOST = 'news-api14.p.rapidapi.com';

// Fetch articles with optional search query
export const fetchArticles = async (query = '') => {
    const url = new URL('https://news-api14.p.rapidapi.com/v2/search/articles');
    const params = {
        language: 'en',
        query: query //  query parameter here
    };
    
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST
        }
    };

    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.data || []; // Return the articles data or an empty array if no data
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};
