import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Alert,ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig'; // Import Firestore config
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods

const HealthInformationScreen = ({ navigation }) => {
  const [healthConditions, setHealthConditions] = useState('');
  const [injuries, setInjuries] = useState('');
  const [allergies, setAllergies] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4; // Define the total number of steps
  const currentStep = 4; // Update this number for each screen accordingly

  const handleSaveData = async () => {
    setIsLoading(true);
    try {
      const userId = FIREBASE_AUTH.currentUser.uid; // Get the current user's UID
      await updateDoc(doc(FIREBASE_DB, 'users', userId), { // Use updateDoc to update existing user document
        healthConditions,
        injuries,
        allergies,
      });
      navigation.navigate('SuccessScreen'); // Navigate to the next screen
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
          <Text style={styles.title}>Health Information</Text>

          <Text style={styles.optionalText}>This information is optional but can help us tailor your experience.</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Existing Health Conditions</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter any known health conditions"
              placeholderTextColor="#999"
              value={healthConditions}
              onChangeText={setHealthConditions}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Injuries</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter any current or past injuries"
              placeholderTextColor="#999"
              value={injuries}
              onChangeText={setInjuries}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Allergies</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter any relevant allergies"
              placeholderTextColor="#999"
              value={allergies}
              onChangeText={setAllergies}
              multiline
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust as necessary
    left: 20, // Adjust as necessary
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  optionalText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    color: '#333',
    marginBottom: 10,
    textAlignVertical: 'top',  // Ensures text starts at the top of the input
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

export default HealthInformationScreen;
