import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Icon libraries
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig'; // Import Firebase Auth and Firestore
import { EmailAuthProvider, updatePassword, reauthenticateWithCredential, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Navigation hook

const AccountSettingsScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to toggle visibility for each password input
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading and modal states
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' or 'error'
  const [isConfirmationModal, setIsConfirmationModal] = useState(false); // State for confirmation modal

  const navigation = useNavigation(); // Access navigation
  const user = FIREBASE_AUTH.currentUser;

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showModal("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showModal("Error", "New password and confirm password do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      showModal("Error", "New password cannot be the same as the current password.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      if (user && currentPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setIsLoading(false); // Stop loading
        showModal("Success", "Password updated successfully.");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setIsLoading(false); // Stop loading
        showModal("Error", "Please enter your current password.");
      }
    } catch (error) {
      setIsLoading(false); // Stop loading
      if (error.code === 'auth/wrong-password') {
        showModal("Error", "The current password you entered is incorrect.");
      } else {
        showModal("Error", "Current password incorrect.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    // Show confirmation modal
    setModalMessage("Are you sure you want to permanently delete your account? This action cannot be undone.");
    setIsConfirmationModal(true);
    setModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    if (user) {
      setIsLoading(true); // Start loading
      const userId = user.uid; // Get the user's UID
  
      try {
        // Delete user data from Firestore collections
        // Reference the Firestore instance correctly
  
        // Delete from 'users' collection
        const userDocRef = doc(FIREBASE_DB, 'users', userId);
        await deleteDoc(userDocRef);
  
        // Delete related chats from the 'Chats' collection
        const chatsQuery = query(collection(FIREBASE_DB, 'Chats'), where('userId', '==', userId));
        const chatsSnapshot = await getDocs(chatsQuery);
        chatsSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
  
        // Delete media from the 'media' collection
        const mediaQuery = query(collection(FIREBASE_DB, 'media'), where('userId', '==', userId));
        const mediaSnapshot = await getDocs(mediaQuery);
        mediaSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
  
        // Delete media posts from the 'mediaPosts' collection
        const mediaPostsQuery = query(collection(FIREBASE_DB, 'mediaPosts'), where('userId', '==', userId));
        const mediaPostsSnapshot = await getDocs(mediaPostsQuery);
        mediaPostsSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
  
        // After deleting Firestore data, delete the user account
        await deleteUser(user);
        setIsLoading(false); // Stop loading
        showModal('Success', 'Account deleted successfully.');
        navigation.navigate('First'); // Navigate back after deletion
  
      } catch (error) {
        setIsLoading(false); // Stop loading
        console.error('Error deleting account:', error); // Log error for debugging
        showModal('Error', 'There was an error deleting your account. Please try again.');
      }
    } else {
      showModal('Error', 'User not authenticated.');
    }
  };
  
  // Function to show the modal
  const showModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setModalMessage('');
    setIsConfirmationModal(false); // Reset confirmation modal state
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#1A2E47" />
      </TouchableOpacity>

      {/* Change Password Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Change Password</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter your current password"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Ionicons
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#999"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-open-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter your new password"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Ionicons
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#999"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="checkmark-done-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your new password"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#999"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loader */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#1A2E47" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delete Account Option */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <MaterialIcons name="delete-outline" size={24} color="#fff" style={styles.deleteIcon} />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalType}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            {isConfirmationModal ? (
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={confirmDeleteAccount} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Yes, Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101629', // Match background
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: '#4B636E',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16, // Increased rounding for a softer look
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Higher elevation to match HomeScreen cards
  },
  sectionTitle: {
    fontSize: 22, // Adjusted size for consistency
    fontWeight: '600',
    color: '#2A2E43', // Darker for emphasis
    marginBottom: 12, // Slightly adjusted
  },
  inputGroup: {
    marginBottom: 20, // More space between inputs
  },
  label: {
    fontSize: 16,
    fontWeight: '500', // Medium weight for consistency
    color: '#1A2E47',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA', // Match HomeScreen input background
    borderColor: '#E1E5EB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#333',
  },
  eyeIcon: {
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: '#5B72F2', // Match primary button color from HomeScreen
    paddingVertical: 14, // Larger for touch accessibility
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Elevation to match HomeScreen buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#F55353',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loader: {
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20, // Larger modal header text
    fontWeight: '600',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#5B72F2', // Consistent with update button color
    borderRadius: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default AccountSettingsScreen;
