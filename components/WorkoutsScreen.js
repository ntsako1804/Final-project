import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableWithoutFeedback, Image } from 'react-native';

export default function WorkoutsScreen({ route, navigation }) {
  const { exercise, duration, exercises } = route.params;
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert minutes to seconds
  const [isPaused, setIsPaused] = useState(true); // Start paused initially
  const [hasStarted, setHasStarted] = useState(false); // Track if the workout has started
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(exercises.findIndex(e => e.id === exercise.id)); // find the index of the current exercise

  useEffect(() => {
    if (timeLeft === 0) {
      Alert.alert('Workout Complete', 'Great job! You completed your workout.');
      return;
    }

    if (isPaused || !hasStarted) return; // If paused or hasn't started, do not start the interval

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isPaused, hasStarted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const startWorkout = () => {
    setHasStarted(true);
    setIsPaused(false);
  };

  const goToNextExercise = () => {
    const nextIndex = (currentExerciseIndex + 1) % exercises.length; // Loop back to the start if at the end
    const nextExercise = exercises[nextIndex];
    navigation.replace('WorkoutScreen', {
      exercise: nextExercise,
      duration,
      exercises, // Pass the same exercises list
    });
    setCurrentExerciseIndex(nextIndex); // Update the current exercise index
  };

  return (
    <TouchableWithoutFeedback onPress={togglePauseResume}>
      <View style={styles.container}>
        <Image source={{ uri: exercise.gifUrl }} style={styles.exerciseImage} />
        <Text style={styles.status(isPaused)}>{isPaused ? 'Paused' : 'Running'}</Text>
        <View style={styles.bottomContainer}>
          <Text style={styles.timer}>Time Left: {formatTime(timeLeft)}</Text>
          <Text style={styles.title}>Exercise: {exercise.name}</Text>
          {!hasStarted ? (
            <Button title="Start Workout" onPress={startWorkout} color="#5cb85c" />
          ) : (
            <Button
              title="Stop Workout"
              onPress={() => navigation.goBack()}
              color="#d9534f"
            />
          )}
          {hasStarted && (
            <Button
              title="Next Exercise"
              onPress={goToNextExercise}
              color="#5bc0de"
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B636E', // Apply the new background color
  },
  exerciseImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain', // Ensure the image fits well
    marginBottom: 16,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for contrast
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for contrast
    marginBottom: 16,
  },
  status: (isPaused) => ({
    fontSize: 18,
    fontWeight: 'bold',
    color: isPaused ? '#FF6347' : '#32CD32', // Tomato red for paused, Lime green for running
    marginBottom: 16,
  }),
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#4B636E', // Apply the new background color here as well
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});
