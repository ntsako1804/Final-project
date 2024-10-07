import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, TextInput, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebaseConfig';
import ProgressBar from '../components/ProgressBar';

const { width, height } = Dimensions.get('window');

const FitnessOnboarding = ({ route, navigation }) => {
  const { userName } = route.params; // Get the passed userName from route params
  const [gender, setGender] = useState('Female');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [fullName, setFullName] = useState(userName || ''); // Use the passed name
  const [editingName, setEditingName] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;  // Define the total number of steps
  const currentStep = 2; // Update this number for each screen accordingly

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIsLoading(true);
      setProfileImage(result.assets[0].uri);
      setIsLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const uploadImage = async (imageUri) => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const filename = `profile_${userId}_${Date.now()}.jpg`; // Unique filename for the image
      const storage = getStorage();
      const profileImageRef = ref(storage, `profileImages/${filename}`);

      // Fetch the image as a blob
      const response = await fetch(imageUri);
      const blob = await response.blob(); // Convert the image URI to a Blob

      // Upload the blob to Firebase Storage
      const snapshot = await uploadBytes(profileImageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; // Return the download URL
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Rethrow the error for handling in handleSaveData
    }
  };

  const handleSaveData = async () => {
    if (!profileImage) {
      Alert.alert('Please select a profile image');
      return;
    }

    setIsLoading(true);
    try {
      // Upload profile image and get the download URL
      const uploadedImageUrl = await uploadImage(profileImage);

      const userId = FIREBASE_AUTH.currentUser.uid; // Get the current user's UID

      // Save profile details along with the image URL to Firestore
      await updateDoc(doc(FIREBASE_DB, 'users', userId), {
        fullName,
        gender,
        age,
        height,
        weight,
        profileImage: uploadedImageUrl, // Save the download URL in Firestore
      });

      navigation.navigate('FitnessGoalScreen'); // Navigate to the next screen
    } catch (error) {
      console.error('Error saving profile data:', error);
    } finally {
      setIsLoading(false); // Hide loading after saving
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/da/97/ff/da97ff06628a8ac2c982dd66e1d7272c.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>About Yourself</Text>

        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={toggleModal}>
            <ImageBackground
              source={{ uri: profileImage || 'https://i.pinimg.com/564x/33/bb/a0/33bba04cb8143b1a24bbd68769377b47.jpg' }}
              style={styles.circleImage}
              imageStyle={{ borderRadius: 75 }}
            >
              {!profileImage && <Ionicons name="person" size={75} color="rgba(255, 255, 255, 0.5)" style={styles.profileIcon} />}
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" style={styles.cameraIcon} />
              ) : (
                <TouchableOpacity style={styles.cameraIconContainer} onPress={pickImage}>
                  <Ionicons name="camera" size={20} color="#fff" style={styles.cameraIcon} />
                </TouchableOpacity>
              )}
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
            {editingName ? (
            <TextInput
              style={styles.nameInput}
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => setEditingName(false)}
            />
          ) : (
            <Text style={styles.fullName}>{fullName}</Text>
          )}
          <TouchableOpacity onPress={() => setEditingName(true)}>
          </TouchableOpacity>
        </View>

        <View style={styles.customizationsContainer}>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Female' && styles.genderButtonSelected]}
              onPress={() => setGender('Female')}
            >
              <Ionicons name="female" size={16} color="#fff" style={styles.genderIcon} />
              <Text style={[styles.genderButtonText, gender === 'Female' && styles.genderButtonTextSelected]}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Male' && styles.genderButtonSelected]}
              onPress={() => setGender('Male')}
            >
              <Ionicons name="male" size={16} color="#fff" style={styles.genderIcon} />
              <Text style={[styles.genderButtonText, gender === 'Male' && styles.genderButtonTextSelected]}>Male</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerRow}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={age}
                style={styles.picker}
                onValueChange={(itemValue) => setAge(itemValue)}
              >
                {Array.from({ length: 100 }, (_, i) => (
                  <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                ))}
              </Picker>
              <Text style={styles.pickerLabel}>Age: {age}</Text>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={height}
                style={styles.picker}
                onValueChange={(itemValue) => setHeight(itemValue)}
              >
                {Array.from({ length: 100 }, (_, i) => (
                  <Picker.Item key={i} label={`${i + 100} cm`} value={i + 100} />
                ))}
              </Picker>
              <Text style={styles.pickerLabel}>Height: {height} cm</Text>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={weight}
                style={styles.picker}
                onValueChange={(itemValue) => setWeight(itemValue)}
              >
                {Array.from({ length: 200 }, (_, i) => (
                  <Picker.Item key={i} label={`${i + 20} kg`} value={i + 20} />
                ))}
              </Picker>
              <Text style={styles.pickerLabel}>Weight: {weight} kg</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleSaveData}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>NEXT</Text>
          )}
        </TouchableOpacity>

        <Modal visible={isModalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: profileImage }} style={styles.fullScreenImage} />
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Ionicons name="close" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust as necessary
    left: 20, // Adjust as necessary
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
  },
  imageContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  circleImage: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    position: 'absolute',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  fullName: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold',
  },
  nameInput: {
    fontSize: 20,
    color: '#fff',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginRight: 10,
    flex: 1,
    textAlign: 'center',
  },
  pencilIcon: {
    marginLeft: 10,
  },
  customizationsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  genderButtonSelected: {
    backgroundColor: '#8A2BE2',
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  genderButtonTextSelected: {
    fontWeight: 'bold',
  },
  genderIcon: {
    marginRight: 5,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    marginHorizontal: 5,
    padding: 10,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    color: '#fff',
  },
  pickerLabel: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 5,
  },
});

export default FitnessOnboarding;
