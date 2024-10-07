import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

const PasswordReset = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email address');
      return;
    }

    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert('Password reset email sent', 'Please check your email to reset your password');
      navigation.goBack();
    } catch (error) {
      console.error('Password reset error:', error); // Debugging log
      Alert.alert('Password reset failed', error.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/564x/33/bb/a0/33bba04cb8143b1a24bbd68769377b47.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.header}>Reset Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
            <Text style={styles.buttonText}>Send Reset Email</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  content: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PasswordReset;
