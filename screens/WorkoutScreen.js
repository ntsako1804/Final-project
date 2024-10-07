import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const WorkoutScreen = ({ navigation }) => {
  const targets = [
    { name: 'abductors', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb2G-lDZao0bRWnCux-3zRcQgiXYSUbYXFbA&s' },
    { name: 'abs', image: 'https://i.pinimg.com/236x/ce/71/cc/ce71ccb981a9c2338e30e5ec46479d09.jpg' },
    { name: 'adductors', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBOQQUPDBA2K7jBY0mF_r6sSpRftQpBNYQLg&s' },
    { name: 'biceps', image: 'https://i.pinimg.com/564x/e6/83/c8/e683c8e4c2f66c1a0c316c9f968b5b9c.jpg' },
    { name: 'calves', image: 'https://i.pinimg.com/564x/6b/33/7e/6b337e921affd951fc52591377593ea7.jpg' },
    { name: 'chest', image: 'https://i.pinimg.com/564x/1d/1b/82/1d1b829ab7a0be98769bf9ea337ade95.jpg' },
    { name: 'forearms', image: 'https://i.pinimg.com/564x/16/40/24/164024632992976a28238b07c6dbc187.jpg' },
    { name: 'glutes', image: 'https://i.pinimg.com/564x/a0/2d/04/a02d047c3c4b454a4f16552666226ead.jpg' },
    { name: 'hamstrings', image: 'https://i.pinimg.com/564x/da/61/21/da612124904bb5826e66b8dd14f9ad7f.jpg' },
    { name: 'lats', image: 'https://i.pinimg.com/736x/68/27/80/682780b31ab20a2db7484187aebaf9fb.jpg' },
    { name: 'lower_back', image: 'https://i.pinimg.com/236x/12/60/86/12608602f4364b991d47bd7b444361d4.jpg' },
    { name: 'middle_back', image: 'https://i.pinimg.com/564x/97/71/51/977151c91da826bc39297af5e05fceeb.jpg' },
    { name: 'neck', image: 'https://i.pinimg.com/564x/40/d1/66/40d1666655760b58195cf58c50704229.jpg' },
    { name: 'quadriceps', image: 'https://i.pinimg.com/564x/62/70/4c/62704cf9186c517c587140afbde8f35c.jpg' },
    { name: 'shoulders', image: 'https://i.pinimg.com/236x/41/02/6d/41026d60e8babfffe843488cf1096b9c.jpg' },
    { name: 'traps', image: 'https://i.pinimg.com/564x/fe/d9/1c/fed91cff237f9b9eb30bf9ab78270a70.jpg' },
    { name: 'triceps', image: 'https://i.pinimg.com/736x/d9/18/3b/d9183b3d492dc8bc34e7137f4b0ac135.jpg' },
  ];

  const handleTargetSelection = (target) => {
    // Navigate to the ExerciseScreen and pass the selected target
    navigation.navigate('Exercises', { target });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Target Area</Text>
      <FlatList
        data={targets}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.targetButton} onPress={() => handleTargetSelection(item.name)}>
            <Image source={{ uri: item.image }} style={styles.targetImage} />
            <View style={styles.overlay}>
              <Text style={styles.targetText}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color:'#fff',
  },
  targetButton: {
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  targetImage: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WorkoutScreen;
