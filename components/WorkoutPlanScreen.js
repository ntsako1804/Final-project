// WorkoutPlanScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function WorkoutPlanScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Plan</Text>
      <Button
        title="View Weight Exercise"
        onPress={() => navigation.navigate('WeightExercise')}
        color="#841584"
      />
      <Button
        title="Gain Muscle"
        onPress={() => navigation.navigate('GainMuscle')}
        color="#841584"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101629',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
});
