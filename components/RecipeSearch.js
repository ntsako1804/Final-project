import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchRecipes } from '../apiService';
import { Ionicons } from '@expo/vector-icons'; // Import icon library

const RecipeSearch = () => {
    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState({ breakfast: [], lunch: [], dinner: [], snack: [] });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true); // Set initial loading to true
    const [isSearchActive, setIsSearchActive] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchInitialRecipes = async () => {
            setLoading(true); // Start loading when fetching initial data
            try {
                const breakfastRecipes = await searchRecipes('breakfast');
                const lunchRecipes = await searchRecipes('lunch');
                const dinnerRecipes = await searchRecipes('dinner');
                const snackRecipes = await searchRecipes('snack');

                setRecipes({
                    breakfast: breakfastRecipes.hits || [],
                    lunch: lunchRecipes.hits || [],
                    dinner: dinnerRecipes.hits || [],
                    snack: snackRecipes.hits || [],
                });
            } catch (error) {
                console.error('Error fetching initial recipes:', error);
            } finally {
                setLoading(false); // Stop loading when done
            }
        };

        fetchInitialRecipes();
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return; // Prevent empty searches
        setLoading(true); // Start loading when searching
        setIsSearchActive(true);
        try {
            const results = await searchRecipes(query);
            setSearchResults(results.hits || []);
        } catch (error) {
            console.error('Error searching for recipes:', error);
        } finally {
            setLoading(false); // Stop loading after search is done
        }
    };

    const handleBack = () => {
        setIsSearchActive(false);
        setQuery('');
        setSearchResults([]);
    };

    const handleRecipePress = (recipe) => {
        navigation.navigate('RecipeSearchDetails', { recipe });
    };

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleRecipePress(item.recipe)}>
            <View style={styles.recipeItem}>
                <Image
                    source={{ uri: item.recipe.image }}
                    style={styles.image}
                />
                <Text style={styles.title}>{item.recipe.label}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for a recipe..."
                    placeholderTextColor="#B0C4DE" // Light placeholder for dark background
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch} // Trigger search on keyboard submit
                />
                <TouchableOpacity onPress={handleSearch}>
                    <Ionicons name="search" size={24} color="#00BFFF" style={styles.searchIcon} />
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#00BFFF" style={styles.loadingIndicator} />
            ) : isSearchActive ? (
                <>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                    />
                </>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.categoryTitle}>Breakfast</Text>
                    <FlatList
                        horizontal
                        data={recipes.breakfast}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                        showsHorizontalScrollIndicator={false}
                    />

                    <Text style={styles.categoryTitle}>Lunch</Text>
                    <FlatList
                        horizontal
                        data={recipes.lunch}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                        showsHorizontalScrollIndicator={false}
                    />

                    <Text style={styles.categoryTitle}>Dinner</Text>
                    <FlatList
                        horizontal
                        data={recipes.dinner}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                        showsHorizontalScrollIndicator={false}
                    />

                    <Text style={styles.categoryTitle}>Snack</Text>
                    <FlatList
                        horizontal
                        data={recipes.snack}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                        showsHorizontalScrollIndicator={false}
                    />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: '#101629', // Dark background color
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 55,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#00BFFF', // Light blue border color for input
        borderWidth: 1,
        paddingHorizontal: 10,
        color: '#fff', // White text input
        borderRadius: 8,
        marginRight: 10,
    },
    searchIcon: {
        padding: 10,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // White category title for contrast
        marginVertical: 10,
    },
    recipeItem: {
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#00BFFF', // Border color for recipe items
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#35495E', // Darker background for recipe cards
        width: 200,
    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff', // White text for recipe titles
    },
    loadingIndicator: {
        marginTop: 20,
    },
    backButton: {
        marginVertical: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#00BFFF', // Light blue text for the back button
        textAlign: 'center',
    },
});

export default RecipeSearch;
