import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig'; // Import Firestore config
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods

const OptionalDataScreen = ({ navigation }) => {
  const [wearableDevice, setWearableDevice] = useState(false);
  const [socialMedia, setSocialMedia] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 5;  // Define the total number of steps
  const currentStep = 5; // Update this number for each screen accordingly

  const handleSaveData = async () => {
    setIsLoading(true);
    try {
      const userId = FIREBASE_AUTH.currentUser.uid; // Get the current user's UID
      await updateDoc(doc(FIREBASE_DB, 'users', userId), { // Use updateDoc to update existing user document
        wearableDevice,
        socialMedia,
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
          <Text style={styles.title}>Optional Data</Text>
          <Text style={styles.subtitle}>For Enhanced Experience</Text>

          <View style={styles.optionContainer}>
            <Text style={styles.optionLabel}>Wearable Device Integration</Text>
            <Switch
              value={wearableDevice}
              onValueChange={setWearableDevice}
              thumbColor={wearableDevice ? '#8A2BE2' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: '#8A2BE2' }}
            />
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.optionLabel}>Social Media Integration</Text>
            <Switch
              value={socialMedia}
              onValueChange={setSocialMedia}
              thumbColor={socialMedia ? '#8A2BE2' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: '#8A2BE2' }}
            />
          </View>

          <Text style={styles.note}>You can set this up later in settings.</Text>

          <TouchableOpacity style={styles.nextButton} onPress={handleSaveData} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.nextButtonText}>NEXT</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSaveData} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.skipButtonText}>SKIP</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  note: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust as necessary
    left: 20, // Adjust as necessary
    zIndex: 1,
  },
});

export default OptionalDataScreen;
