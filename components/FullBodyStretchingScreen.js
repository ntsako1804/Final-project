import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Image Section */}
      <Image
        source={{ uri: 'https://i.imgur.com/your-image.jpg' }} // Replace with the actual image URL
        style={styles.headerImage}
      />
      
      {/* Title Section */}
      <Text style={styles.title}>Full Body Stretching</Text>
      
      {/* Description Section */}
      <Text style={styles.description}>
        Classic stretches to increase flexibility and release all your muscles. Great cool-down after a workout.
      </Text>
      
      {/* Duration and Calories Section */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>⏱ 10 minutes</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>🔥 14 calories</Text>
        </View>
      </View>
      
      {/* Music and Sound Section */}
      <TouchableOpacity style={styles.optionBox}>
        <Text style={styles.optionText}>🎵 Music and Sound</Text>
      </TouchableOpacity>
      
      {/* Duration Section */}
      <TouchableOpacity style={styles.optionBox}>
        <Text style={styles.optionText}>⏳ Duration: 10 minutes</Text>
      </TouchableOpacity>
      
      {/* Fitness Tools Section */}
      <TouchableOpacity style={styles.optionBox}>
        <Text style={styles.optionText}>🏋️‍♂️ Fitness Tools: None</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  optionBox: {
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
