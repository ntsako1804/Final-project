import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';

const API_KEY = '9e447c1486mshfdc445c8d894063p16644cjsn9600dc08b5fb';
const API_HOST = 'exercisedb.p.rapidapi.com';

const ExercisesScreen = ({ route, navigation }) => {
  const { target } = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(10); // default to 10 minutes
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [isDurationModalVisible, setDurationModalVisible] = useState(false); // Duration selection modal

  const tools = [
    { name: 'BOSU', exercises: 67, size: '13 MB' },
    { name: 'Barbell', exercises: 29, size: '4 MB' },
    { name: 'Dumbbell', exercises: 66, size: '9 MB' },
    { name: 'Foam Roller', exercises: 58, size: '8 MB' },
    { name: 'Kettlebell', exercises: 61, size: '10 MB' },
    { name: 'Medicine Ball', exercises: 61, size: '12 MB' },
    { name: 'Pull Up Bar', exercises: 5, size: '0 MB' },
    { name: 'Resistance Band', exercises: 31, size: '4 MB' },
    { name: 'Suspension System', exercises: 98, size: '17 MB' },
    { name: 'Swiss Ball', exercises: 53, size: '13 MB' },
  ];

  // Duration options
  const durationOptions = [5, 10, 15, 20, 30]; // Add more durations as needed

  useEffect(() => {
    const fetchExercisesByTarget = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://${API_HOST}/exercises/target/${target}`, {
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
          },
        });
        setExercises(response.data);
      } catch (err) {
        setError('Failed to fetch exercises. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercisesByTarget();
  }, [target]);

  const handleExerciseSelection = (exercise) => {
    navigation.navigate('ExerciseInProgress', { exercise, duration });
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const toggleDurationModal = () => {
    setDurationModalVisible(!isDurationModalVisible);
  };

  const setSelectedDuration = (selectedDuration) => {
    setDuration(selectedDuration);
    toggleDurationModal(); // Close modal after selection
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{target.charAt(0).toUpperCase() + target.slice(1)} Exercises</Text>

      <View style={styles.optionsContainer}>

        <TouchableOpacity style={styles.optionButton} onPress={toggleDurationModal}>
          <Text style={styles.optionText}>Duration: {duration} minutes</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text style={styles.loadingText}>Loading exercises...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.exerciseContainer} onPress={() => handleExerciseSelection(item)}>
            <View style={styles.exerciseBox}>
              <Text style={styles.exerciseText}>{capitalizeWords(item.name)}</Text>
              {item.gifUrl && (
                <Image
                  source={{ uri: item.gifUrl }}
                  style={styles.exerciseImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Duration Selection Modal */}
      <Modal visible={isDurationModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Duration</Text>
            <FlatList
              data={durationOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.durationOption} onPress={() => setSelectedDuration(item)}>
                  <Text style={styles.durationText}>{item} minutes</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleDurationModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fitness Tools</Text>
            <FlatList
              data={tools}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <View style={styles.toolContainer}>
                  <Text style={styles.toolName}>{item.name}</Text>
                  <Text style={styles.toolDetails}>{item.exercises} exercises ({item.size})</Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#101629',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#fff',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#1B2A3C',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B0C4DE',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  exerciseContainer: {
    marginBottom: 16,
  },
  exerciseBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  exerciseImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  durationOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  durationText: {
    fontSize: 16,
    color:'#fff',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1B2A3C',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExercisesScreen;
