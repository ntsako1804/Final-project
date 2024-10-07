import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, setDoc } from 'firebase/firestore'; 
import { FIREBASE_DB } from '../firebaseConfig'; // Your Firebase configuration file

const WorkoutCompletedScreen = ({ route, navigation }) => {
  const { completedExercise, durationInSeconds } = route.params || {};
  const [workoutDifficulty, setWorkoutDifficulty] = useState(2);
  const [disliked, setDisliked] = useState(false);
  const [hearted, setHearted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const durationInMinutes = Math.floor(durationInSeconds / 60);

  // Function to handle saving feedback to Firestore
  const handleSaveFeedback = async () => {
    setIsLoading(true); // Start loading

    try {
      const feedbackData = {
        exercise: completedExercise || 'Toe Touch Walk',
        difficulty: workoutDifficulty,
        disliked,
        hearted,
        feedback,
        timestamp: new Date(), // Optional: To keep track of when feedback was given
      };

      // Save feedback to Firestore in a collection called 'workoutFeedback'
      const feedbackRef = doc(FIREBASE_DB, 'workoutFeedback', new Date().toISOString()); 
      await setDoc(feedbackRef, feedbackData);

      // Show modal after saving
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigation.navigate('Workouts'); // Navigate after closing the modal
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Workout Completed!</Text>
      <Text style={styles.subHeader}>Fantastic, keep it up!</Text>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{durationInMinutes}</Text>
          <Text style={styles.statLabel}>MINUTES</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>EXERCISES</Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderTitle}>How was your workout?</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={workoutDifficulty}
          onValueChange={setWorkoutDifficulty}
          minimumTrackTintColor="#4EDC4A"
          maximumTrackTintColor="#CCC"
          thumbTintColor="#4EDC4A"
        />
        <View style={styles.sliderLabelsContainer}>
          <Text style={styles.sliderLabel}>Easy</Text>
          <Text style={styles.sliderLabel}>Perfect</Text>
          <Text style={styles.sliderLabel}>Hard</Text>
        </View>
      </View>

      <Text style={styles.reviewTitle}>Review exercises</Text>

      <View style={styles.exerciseContainer}>
        <Image
          source={{ uri: 'https://example.com/your-image-url' }} 
          style={styles.exerciseImage}
        />
        <Text style={styles.exerciseName}>{completedExercise || 'Toe Touch Walk'}</Text>

        <TouchableOpacity onPress={() => setDisliked(!disliked)}>
          <Icon
            name={disliked ? "thumbs-down" : "thumbs-down-outline"}
            size={30}
            color={disliked ? "#FF6347" : "#4EDC4A"}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setHearted(!hearted)}>
          <Icon
            name={hearted ? "heart" : "heart-outline"}
            size={30}
            color={hearted ? "#E3170A" : "#4EDC4A"}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.feedbackTitle}>Tell us what we can improve:</Text>
      <TextInput
        style={styles.feedbackInput}
        multiline
        placeholder="Your feedback here..."
        placeholderTextColor="#999"
        value={feedback}
        onChangeText={setFeedback}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#4EDC4A" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.continueButton} onPress={handleSaveFeedback}>
          <Text style={styles.buttonText}>Save Feedback</Text>
        </TouchableOpacity>
      )}

      {/* Modal for thank you message */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Thank you for your feedback!</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#101629',
    padding: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    color: '#4EDC4A',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: '#003F77',
    padding: 20,
    borderRadius: 15,
    width: '45%',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  sliderTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 10,
  },
  slider: {
    width: '90%',
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 14,
  },
  reviewTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
  },
  exerciseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#003F77',
    padding: 20,
    borderRadius: 15,
    width: '100%',
  },
  exerciseImage: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 10,
  },
  exerciseName: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
  },
  icon: {
    marginHorizontal: 10,
  },
  feedbackTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  feedbackInput: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
    color: '#000',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    textAlignVertical: 'top',
  },
  continueButton: {
    backgroundColor: '#4EDC4A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#001F54',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4EDC4A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

export default WorkoutCompletedScreen;
