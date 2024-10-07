import { SafeAreaView,View,ScrollView, Text,TextInput, TouchableOpacity, StyleSheet,Dimensions, ImageBackground, Image,Modal } from 'react-native';
import React, { useState, } from 'react';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const VerificationScreen = ({navigation}) => {
  
  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/da/97/ff/da97ff06628a8ac2c982dd66e1d7272c.jpg' }}
      style={styles.background}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          A verification email has been sent to your email address. Please check your inbox and verify your email.
        </Text>
        
        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendButtonText}>RESEND CODE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('Verified')}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.changeEmailText}>CHANGE EMAIL</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust as necessary
    left: 20, // Adjust as necessary
    zIndex: 1,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  resendButton: {
    marginBottom: 20,
  },
  resendButtonText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changeEmailText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});

export default VerificationScreen;