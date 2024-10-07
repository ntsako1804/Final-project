import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ExerciseInProgressScreen = ({ route, navigation }) => {
  const { exercise, duration, nextExercise } = route.params;
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false); 
  const [isResting, setIsResting] = useState(false);
  const restDuration = 15; 
  const [restSecondsLeft, setRestSecondsLeft] = useState(restDuration);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsLeft === 0 && !isResting) {
      clearInterval(interval);
      setIsResting(true);
      setIsRunning(true); 
    } else if (isRunning && isResting && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (restSecondsLeft === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, isResting, restSecondsLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleNextExercise = () => {
    if (nextExercise) {
      navigation.navigate('ExerciseInProgress', {
        exercise: nextExercise,
        duration: nextExercise.duration,
        nextExercise: nextExercise.nextExercise, 
      });
    } else {
      navigation.goBack();
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

 const handleFinishExercise = () => {
  navigation.navigate('WorkoutCompleted', {
    completedExercise: exercise.name, 
    durationInSeconds: duration * 60 - secondsLeft,
  });
};

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {capitalizeWords(exercise.name)}
      </Text>
      <Image
        source={{ uri: exercise.gifUrl }}
        style={styles.exerciseImage}
        resizeMode="contain"
      />

      {isResting ? (
        <Text style={styles.timer}>Rest Time: {formatTime(restSecondsLeft)}</Text>
      ) : (
        <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      )}

      {!isRunning && (
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.finishButton} onPress={handleFinishExercise}>
        <Text style={styles.buttonText}>Finish Exercise</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={handleNextExercise}>
        <Text style={styles.buttonText}>Next Exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101629',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24, // Slightly reduced font size for long titles
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'capitalize',
    paddingHorizontal: 10, // Added padding for better spacing
    width: '100%', // Ensures the text wraps within the available width
    lineHeight: 34, // Helps to maintain spacing for multi-line titles
  },
  exerciseImage: {
    width: '100%',
    height: 270,
    marginBottom: 30,
    borderRadius: 15,
  },
  timer: {
    fontSize: 48,
    fontWeight: '600',
    color: '#FF6347',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  finishButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  nextButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default ExerciseInProgressScreen;
