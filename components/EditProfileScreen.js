import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig'; // Import Firebase config
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // Icon library for the back arrow
import { useNavigation } from '@react-navigation/native'; // Navigation hook

const EditProfileScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true); // Loader state
  const [isEditing, setIsEditing] = useState(false); // State to handle editing
  const [saving, setSaving] = useState(false); // State for saving changes
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal state
  const [age,setAge] = useState('');
  const [height,setHeight] = useState('');
  const [allergies,setAllergies] = useState('');
  const [injuries,setInjuries] = useState('');
  const [weight,setWeight] = useState('');


  const currentUser = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation(); // For navigation

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    if (currentUser) {
      try {
        const userDoc = doc(FIREBASE_DB, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setFullName(userData.fullName);
          setEmail(userData.email);
          setProfileImage(userData.profileImage);
          setAge(userData.age);
          setAllergies(userData.allergies? userData.allergies : 'None');
          setHeight(userData.height);
          setInjuries(userData.injuries? userData.injuries : 'None');
          setWeight(userData.weight);

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Save updated user data to Firestore
  const handleSaveChanges = async () => {
    if (currentUser) {
      setSaving(true); // Show saving loader
      try {
        const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);

        // Update user data in Firestore
        await updateDoc(userDocRef, {
          fullName: fullName,
          profileImage: profileImage,
        });

        setShowSuccessModal(true); // Show success modal
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving changes:', error);
      } finally {
        setSaving(false); // Stop saving loader
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back arrow for navigation */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Personal Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <TextInput
            style={styles.infoValue}
            value={fullName}
            onChangeText={setFullName}
            editable={isEditing}
            placeholder="Enter your name"
            placeholderTextColor="#A3A3A3"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Address</Text>
          <TextInput
            style={styles.infoValue}
            value={email}
            editable={false} // Email remains uneditable
            placeholder="Enter your email"
            placeholderTextColor="#A3A3A3"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age</Text>
          <TextInput
            style={styles.infoValue}
            value={age +" years"}
            editable={false} // Email remains uneditable
            placeholder="Enter your age"
            placeholderTextColor="#A3A3A3"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Weight</Text>
          <TextInput
            style={styles.infoValue}
            value={weight+ " Kg"}
            editable={false} // Email remains uneditable
            placeholder="Enter your email"
            placeholderTextColor="#A3A3A3"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Height</Text>
          <TextInput
            style={styles.infoValue}
            value={height +" Cm"}
            editable={false} // Email remains uneditable
            placeholder="Enter your height"
            placeholderTextColor="#A3A3A3"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Injuries</Text>
          <TextInput
            style={styles.infoValue}
            value={injuries+""}
            editable={false} // Email remains uneditable
            placeholder="Enter your email"
            placeholderTextColor="#A3A3A3"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Allergies</Text>
          <TextInput
            style={styles.infoValue}
            value={allergies +""}
            editable={false} // Email remains uneditable
            placeholder="Enter your email"
            placeholderTextColor="#A3A3A3"
          />
        </View>

        {/* Toggle between "Edit" and "Save Changes" buttons */}
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: isEditing ? '#00D084' : '#007BFF' }]} 
          onPress={isEditing ? handleSaveChanges : toggleEdit}>
          <Text style={styles.editButtonText}>{isEditing ? 'Save Changes' : 'Edit Information'}</Text>
        </TouchableOpacity>

        {/* Show saving indicator when saving */}
        {saving && (
          <View style={styles.savingContainer}>
            <ActivityIndicator size="small" color="#007BFF" />
            <Text style={styles.savingText}>Saving changes...</Text>
          </View>
        )}
      </View>

      {/* Success modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Profile updated successfully!</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101629',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#00D084', // Match the vibrant theme
  },
  infoContainer: {
    backgroundColor: '#35495E',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    color:'#fff'
  },
  editButton: {
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  savingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#007BFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
