import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const RecipeSearchDetails = ({ route }) => {
    const { recipe } = route.params;

    const openSourceUrl = () => {
        if (recipe.url) {
            Linking.openURL(recipe.url);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <Text style={styles.title}>{recipe.label}</Text>
            <TouchableOpacity onPress={openSourceUrl}>
                <Text style={styles.source}>Source: {recipe.source} (Click to view)</Text>
            </TouchableOpacity>
            
            <Text style={styles.subtitle}>Nutrients:</Text>
            <Text style={styles.nutrientText}>Calories: {Math.round(recipe.calories)} kcal</Text>
            <Text style={styles.nutrientText}>Fat: {Math.round(recipe.totalNutrients.FAT.quantity)} {recipe.totalNutrients.FAT.unit}</Text>
            <Text style={styles.nutrientText}>Protein: {Math.round(recipe.totalNutrients.PROCNT.quantity)} {recipe.totalNutrients.PROCNT.unit}</Text>
            <Text style={styles.nutrientText}>Carbs: {Math.round(recipe.totalNutrients.CHOCDF.quantity)} {recipe.totalNutrients.CHOCDF.unit}</Text>

            <Text style={styles.subtitle}>Ingredients:</Text>
            <FlatList
                data={recipe.ingredientLines}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.ingredient}>{item}</Text>
                )}
            />

            <Text style={styles.subtitle}>Instructions:</Text>
            <Text style={styles.instructions}>Follow the recipe from the source provided.</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#101629', // Dark background for modern look
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 55,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF', // White text for title
        marginBottom: 10,
    },
    source: {
        fontSize: 16,
        color: '#00BFFF', // Light blue for links
        textDecorationLine: 'underline',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF', // White text for subtitles
        marginVertical: 10,
    },
    nutrientText: {
        fontSize: 16,
        color: '#B0C4DE', // Light gray for nutrient details
        marginBottom: 5,
    },
    ingredient: {
        fontSize: 16,
        color: '#D3D3D3', // Slightly lighter text for ingredients
        marginBottom: 5,
    },
    instructions: {
        fontSize: 16,
        color: '#B0C4DE', // Light gray for instructions
        marginBottom: 20,
    },
});

export default RecipeSearchDetails;
