import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';

const ExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params;

  // State variables
  const [sets, setSets] = useState('');
  const [duration, setDuration] = useState('');
  const [currentSet, setCurrentSet] = useState(0);
  const [isExercising, setIsExercising] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Effect to handle timer countdown
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && currentSet < sets) {
      clearInterval(interval);
      alert(`Set ${currentSet + 1} complete!`);
      setCurrentSet((prev) => prev + 1);
      setTimer(duration); // Reset timer for the next set
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Start the exercise
  const handleStartExercise = () => {
    if (!sets || !duration) {
      alert('Please enter the number of sets and duration.');
      return;
    }
    setCurrentSet(1);
    setTimer(duration);
    setIsExercising(true);
    setIsTimerActive(true);
  };

  // Finish exercise
  const handleFinishExercise = () => {
    setIsExercising(false);
    setIsTimerActive(false);
    setCurrentSet(0);
    setTimer(0);
    alert('Great job! You have completed your exercise!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>

      <Image
        source={{ uri: exercise.gifUrl }}
        style={styles.exerciseImage}
        resizeMode="contain"
      />

      {!isExercising && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Number of Sets"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
          />
          <TextInput
            style={styles.input}
            placeholder="Duration per Set (in seconds)"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
          />
          <TouchableOpacity style={styles.startButton} onPress={handleStartExercise}>
            <Text style={styles.buttonText}>Start Exercise</Text>
          </TouchableOpacity>
        </>
      )}

      {isExercising && (
        <>
          <Text style={styles.timerText}>
            Set {currentSet} of {sets}: {timer} seconds remaining
          </Text>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinishExercise}>
            <Text style={styles.buttonText}>Finish Exercise</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26, // Increased font size for better visibility
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseImage: {
    width: '100%',
    height: 300, // Adjusted height for better proportions
    marginBottom: 30,
  },
  input: {
    height: 50, // Increased height for better touch targets
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15, // Adjusted padding for better text positioning
    width: '100%',
    borderRadius: 5,
    fontSize: 18, // Increased font size for better readability
  },
  startButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%', // Make button full width
    alignItems: 'center', // Center text
  },
  finishButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: '100%', // Make button full width
    alignItems: 'center', // Center text
  },
  buttonText: {
    fontSize: 20, // Increased font size for better visibility
    color: '#fff',
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 22, // Increased font size for better visibility
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default ExerciseDetailScreen;
