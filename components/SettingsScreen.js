import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; // Use navigation hook

const SettingsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Access navigation

  const handleLogout = () => {
    setLoading(true);
    // Simulate a logout process with a timeout
    setTimeout(() => {
      // Clear user session or perform any other logout logic here
      setLoading(false);
      navigation.navigate('Login');
    }, 4000); // Adjust the timeout as needed
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loaderText}>Logging out...</Text>
        </View>
      ) : (
        <>
          {/* Back arrow for navigation */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <Image source={{ uri: 'https://example.com/profile.jpg' }} style={styles.profileImage} />
          </View>

          <TouchableOpacity style={styles.settingsSection} onPress={() => navigation.navigate('EditProfile')}>
            <Icon name="user" size={20} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.sectionTitle}>Profile Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsSection} onPress={() => navigation.navigate('AccountSettings')}>
            <Icon name="lock" size={20} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsSection} onPress={() => navigation.navigate('SupportFeedback')}>
            <Icon name="support" size={20} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.sectionTitle}>Support & Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsSection} onPress={() => navigation.navigate('LegalAndAbout')}>
            <Icon name="info-circle" size={20} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.sectionTitle}>Legal & About</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => setModalVisible(true)}>
            <Icon name="sign-out" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Logout Confirmation Modal */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Logout</Text>
                <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); handleLogout(); }}>
                    <Text style={styles.modalButtonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
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
    top: 50, // Adjust as necessary
    left: 20, // Adjust as necessary
    zIndex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  settingsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E3B4E',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 15,
  },
  sectionTitle: {
    color: '#C1C7CD',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#F34242',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalMessage: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#F34242', // Red background for the Yes button
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
