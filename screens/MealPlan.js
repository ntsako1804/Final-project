import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Switch } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { generateMealPlan } from '../src/utils/generateMealPlan';
import { refreshCategory } from '../src/utils/refreshCategory';
import moment from 'moment';

const MealPlan = () => {
    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    });
    const [loading, setLoading] = useState(true);
    const [dietType, setDietType] = useState('low-carb');
    const [openDiet, setOpenDiet] = useState(false);
    const [openHealthLabels, setOpenHealthLabels] = useState(false);
    const [selectedHealthLabels, setSelectedHealthLabels] = useState([]);
    const [eatenMeals, setEatenMeals] = useState({
        breakfast: false,
        lunch: false,
        dinner: false,
        snack: false,
    });
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // Add state for selected date

    const navigation = useNavigation();

    useEffect(() => {
        generateMealPlan(dietType, setMeals, setLoading, selectedHealthLabels, selectedDate); // Pass selected date to meal plan
    }, [dietType, selectedHealthLabels, selectedDate]);

    const handleMealPress = (meal) => {
        navigation.navigate('RecipeDetail', {
            recipe: meal,
        });
    };

    const handleSwitchChange = (mealType) => {
        setEatenMeals((prevEatenMeals) => ({
            ...prevEatenMeals,
            [mealType]: !prevEatenMeals[mealType],
        }));
    };

    const totalNutrients = ['calories', 'protein', 'fat', 'carb'].reduce(
        (totals, nutrient) => {
            Object.keys(meals).forEach((mealType) => {
                if (eatenMeals[mealType]) {
                    meals[mealType].forEach((meal) => {
                        totals[nutrient] += parseFloat(meal[nutrient]) || 0;
                    });
                }
            });
            return totals;
        },
        { calories: 0, protein: 0, fat: 0, carb: 0 }
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    const currentDate = moment();
    const currentDay = currentDate.date();

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                {/* Search Recipe Button */}
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => navigation.navigate('RecipeSearch')}
                >
                    <Text style={styles.searchButtonText}>Search Recipe</Text>
                </TouchableOpacity>
                <View style={styles.dateContainer}>
                    <Icon name="calendar-outline" size={24} color="#fff" />
                    <Text style={styles.dateText}>{currentDate.format('dddd, DD MMMM YYYY')}</Text>
                </View>
                <View style={styles.dayContainer}>
                    
                </View>

                {/* Dropdown for Diet Type */}
<DropDownPicker
    open={openDiet}
    value={dietType}
    items={[
        { label: 'Low-Carb', value: 'low-carb' },
        { label: 'High-Protein', value: 'high-protein' },
        { label: 'Balanced', value: 'balanced' },
        { label: 'Low-Fat', value: 'low-fat' },
        { label: 'Low-Sodium', value: 'low-sodium' },
    ]}
    setOpen={setOpenDiet}
    setValue={setDietType}
    containerStyle={[styles.pickerContainer, { zIndex: 2 }]} // Set zIndex to 2
    dropDownContainerStyle={styles.dropdown}
/>

{/* Dropdown for Health Labels */}
<DropDownPicker
    open={openHealthLabels}
    multiple={true}
    value={selectedHealthLabels}
    items={[
        { label: 'Gluten-Free', value: 'gluten-free' },
        { label: 'Peanut-Free', value: 'peanut-free' },
        { label: 'Dairy-Free', value: 'dairy-free' },
        { label: 'Tree-Nut-Free', value: 'tree-nut-free' },
        { label: 'Soy-Free', value: 'soy-free' },
        { label: 'Shellfish-Free', value: 'shellfish-free' },
        { label: 'Egg-Free', value: 'egg-free' },
        { label: 'DASH', value: 'DASH' },
        { label: 'Keto-Friendly', value: 'keto-friendly' },
        { label: 'Kosher', value: 'kosher' },
        { label: 'Low Potassium', value: 'low-potassium' },
        { label: 'Low Sugar', value: 'low-sugar' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Wheat-Free', value: 'wheat-free' },
        // Add more health labels as needed
    ]}
    setOpen={setOpenHealthLabels}
    setValue={setSelectedHealthLabels}
    containerStyle={[styles.pickerContainer, { zIndex: 1 }]} // Set zIndex to 1
    dropDownContainerStyle={styles.dropdown}
    placeholder="Select Health Labels (Optional)"
/>
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, index) => (
                    <View key={index} style={styles.mealSection}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.mealType}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                            <TouchableOpacity onPress={() => refreshCategory(mealType, dietType, selectedHealthLabels, setMeals, setLoading)}>
                                <Icon name="reload" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Switch
                            value={eatenMeals[mealType]}
                            onValueChange={() => handleSwitchChange(mealType)}
                        />
                        {meals[mealType] && meals[mealType].map((meal, idx) => (
                            <TouchableOpacity key={idx} onPress={() => handleMealPress(meal)}>
                                <View style={styles.mealContainer}>
                                    <Image source={{ uri: meal.image }} style={styles.mealImage} />
                                    <View style={styles.mealDetails}>
                                        <Text style={styles.mealTitle}>{meal.title}</Text>
                                        <Text style={styles.servings}>Servings: {meal.servings}</Text>
                                        <Text style={styles.calories}>{meal.calories.toFixed(2)} kcal</Text>
                                        <Text style={styles.nutritionalInfo}>PROTEIN: {meal.protein} g</Text>
                                        <Text style={styles.nutritionalInfo}>FAT: {meal.fat} g</Text>
                                        <Text style={styles.nutritionalInfo}>CARB: {meal.carb} g</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Nutritional Summary */}
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>Nutritional Summary:</Text>
                    <Text style={styles.summaryText}>Calories: {totalNutrients.calories.toFixed(2)} kcal</Text>
                    <Text style={styles.summaryText}>Protein: {totalNutrients.protein.toFixed(2)} g</Text>
                    <Text style={styles.summaryText}>Fat: {totalNutrients.fat.toFixed(2)} g</Text>
                    <Text style={styles.summaryText}>Carbs: {totalNutrients.carb.toFixed(2)} g</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#101629',
    },
    container: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E2742',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
    },
    pickerContainer: {
        height: 50,
        marginBottom: 20,
    },
    dropDownPicker: {
        backgroundColor: '#35495E',
        borderColor: '#1B2A3C',
    },
    pickerLabel: {
        color: '#FFF',
    },
    searchButton: {
        backgroundColor: '#083061',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#1B2A3C',
        padding: 10,
        borderRadius: 10,
    },
    dateText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    dayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dayText: {
        color: '#B0C4DE',
        fontSize: 16,
    },
    selectedDay: {
        color: '#00BFFF',
    },
    mealSection: {
        marginBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealType: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    mealContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E2742',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    mealImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    mealDetails: {
        marginLeft: 10,
    },
    mealTitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        maxWidth: 180, // Adjust the value as per your layout needs
    },
    servings: {
        fontSize: 14,
        color: '#B0C4DE',
    },
    calories: {
        fontSize: 16,
        color: '#00BFFF',
        marginTop: 5,
    },
    nutritionalInfo: {
        fontSize: 14,
        color: '#B0C4DE',
    },
    summaryContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#1E2742',
        borderRadius: 10,
    },
    summaryText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default MealPlan;
