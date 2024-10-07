import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default function GainMuscleScreen() {
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://exercisedb.p.rapidapi.com/exercises/bodyPart/chest', {
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
            instructions: "1. Lie back on a bench and hold a barbell with a shoulder-width grip.\n2. Lower the barbell to your chest.\n3. Push the barbell back up to the starting position.\n4. Repeat for the desired number of repetitions."
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
