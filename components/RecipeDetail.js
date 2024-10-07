import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const RecipeDetail = ({ route }) => {
    const { recipe } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.dietLabels}>
                {recipe.dietLabels ? recipe.dietLabels.join(' • ') : 'No diet labels available'}
            </Text>
            <Text style={styles.servings}>Servings: {recipe.servings}</Text>
            <Text style={styles.calories}>{recipe.calories} kcal</Text>

            <View style={styles.nutrientsContainer}>
                <Text style={styles.nutrient}>PROTEIN: {recipe.protein} g</Text>
                <Text style={styles.nutrient}>FAT: {recipe.fat} g</Text>
                <Text style={styles.nutrient}>CARB: {recipe.carb} g</Text>
            </View>

            <View style={styles.nutrientsContainer}>
                <Text style={styles.nutrient}>Cholesterol: {recipe.cholesterol} mg</Text>
                <Text style={styles.nutrient}>Sodium: {recipe.sodium} mg</Text>
                <Text style={styles.nutrient}>Calcium: {recipe.calcium} mg</Text>
                <Text style={styles.nutrient}>Magnesium: {recipe.magnesium} mg</Text>
                <Text style={styles.nutrient}>Potassium: {recipe.potassium} mg</Text>
                <Text style={styles.nutrient}>Iron: {recipe.iron} mg</Text>
            </View>

            {/* Ingredients Section */}
            <View style={styles.ingredientsContainer}>
                <Text style={styles.ingredientsTitle}>Ingredients:</Text>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                        <Text key={index} style={styles.ingredient}>
                            • {ingredient}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.ingredient}>No ingredients available</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#101629', // Dark background to match theme
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 55,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff', // White title for better contrast
        marginBottom: 10,
    },
    dietLabels: {
        fontSize: 16,
        color: '#B0C4DE', // Light gray for the diet labels
        marginBottom: 20,
    },
    servings: {
        fontSize: 16,
        color: '#B0C4DE', // Matching servings label color
        marginBottom: 10,
    },
    calories: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00BFFF', // Highlighting calories in light blue
        marginBottom: 20,
    },
    nutrientsContainer: {
        marginBottom: 20,
        backgroundColor: '#35495E', // Slightly darker container background
        padding: 10,
        borderRadius: 10,
    },
    nutrient: {
        fontSize: 16,
        color: '#fff', // Nutrient details in white for contrast
        marginBottom: 5,
    },
    ingredientsContainer: {
        marginTop: 20,
        backgroundColor: '#35495E',
        padding: 15,
        borderRadius: 10,
    },
    ingredientsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // White for section titles
        marginBottom: 10,
    },
    ingredient: {
        fontSize: 16,
        color: '#B0C4DE', // Ingredients in lighter gray
        marginBottom: 5,
    },
});

export default RecipeDetail;
