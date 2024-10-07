import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import ProgressBar from '../components/ProgressBar';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig'; // Import Firestore config
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods

const FitnessGoalScreen = ({ navigation }) => {
  const [goal, setGoal] = useState('Weight Loss');
  const [weight, setWeight] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4; // Define the total number of steps
  const currentStep = 3; // Update this number for each screen accordingly

  const handleSaveData = async () => {
    if (!goal || !weight || !fitnessLevel) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    setIsLoading(true);
    try {
      const userId = FIREBASE_AUTH.currentUser.uid; // Get the current user's UID
      await updateDoc(doc(FIREBASE_DB, 'users', userId), { // Use updateDoc to update existing user document
        goal,
        weight,
        fitnessLevel,
      });
      navigation.navigate('HealthInformationScreen'); // Navigate to the next screen
    } catch (e) {
      console.error('Error updating document: ', e);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/da/97/ff/da97ff06628a8ac2c982dd66e1d7272c.jpg' }}
      style={styles.background}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Fitness Goal</Text>

          <View style={styles.goalContainer}>
            <TouchableOpacity style={[styles.goalItem, goal === 'Muscle Gain' && styles.selectedGoal]} onPress={() => setGoal('Muscle Gain')}>
              <Ionicons name="barbell" size={20} color={goal === 'Muscle Gain' ? '#8A2BE2' : '#333'} />
              <Text style={[styles.goalText, goal === 'Muscle Gain' && styles.selectedGoalText]}>Muscle Gain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.goalItem, goal === 'Weight Loss' && styles.selectedGoal]} onPress={() => setGoal('Weight Loss')}>
              <Ionicons name="fitness" size={20} color={goal === 'Weight Loss' ? '#8A2BE2' : '#333'} />
              <Text style={[styles.goalText, goal === 'Weight Loss' && styles.selectedGoalText]}>Weight Loss</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, styles.boldLabel]}>Weight Goal</Text>
            <RNPickerSelect
              onValueChange={(value) => setWeight(value)}
              items={[
                { label: '60 kg', value: '60' },
                { label: '65 kg', value: '65' },
                { label: '70 kg', value: '70' },
                { label: '75 kg', value: '75' },
                { label: '80 kg', value: '80' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select your weight goal', value: null }}
              value={weight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, styles.boldLabel]}>Fitness Level</Text>
            <RNPickerSelect
              onValueChange={(value) => setFitnessLevel(value)}
              items={[
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select your fitness level', value: null }}
              value={fitnessLevel}
            />
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleSaveData} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.nextButtonText}>NEXT</Text>
            )}
          </TouchableOpacity>
        </View>
        <ProgressBar step={currentStep} totalSteps={totalSteps} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust as necessary
    left: 20, // Adjust as necessary
    zIndex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  goalItem: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectedGoal: {
    borderColor: '#8A2BE2',
    borderWidth: 2,
  },
  goalText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  selectedGoalText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    color: '#333',
    marginBottom: 10,
  },
  inputAndroid: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    color: '#333',
    marginBottom: 10,
  },
});

export default FitnessGoalScreen;
