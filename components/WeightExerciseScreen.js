import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default function WeightExerciseScreen() {
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/back`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'fced76fc98msh714ee8e3d9dc629p135665jsnfe18451cce99',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson && responseJson.length > 0) {
          setExercise({
            ...responseJson[0],
            instructions: "Sit on the cable machine with your back straight and feet flat on the ground.Grasp the handles with an overhand grip, slightly wider than shoulder-width apart.Lean back slightly and pull the handles towards your chest, squeezing your shoulder blades together.Pause for a moment at the peak of the movement, then slowly release the handles back to the starting position.Repeat for the desired number of repetitions."
          });
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.loader}>
        <Text style={styles.error}>No exercise found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      <Image source={{ uri: exercise.gifUrl }} style={styles.image} />
      <Text style={styles.header}>Target Muscle: {exercise.target}</Text>
      <Text style={styles.header}>Equipment: {exercise.equipment}</Text>
      <Text style={styles.header}>Instructions:</Text>
      <Text style={styles.instructions}>{exercise.instructions}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#101629',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  instructions: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
  },
});
