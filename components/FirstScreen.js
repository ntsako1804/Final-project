import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView,View,ScrollView, Text,TextInput, TouchableOpacity, StyleSheet,Dimensions, ImageBackground, Image,Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const First = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: 'https://i.pinimg.com/564x/b0/d1/ab/b0d1ab7aeb83c1c14b1b5e9f91c0d315.jpg' }} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>Fitness-Fusion</Text>
        <Text style={styles.description}>
          Your ultimate companion for achieving fitness goals and living a healthier lifestyle!
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Get Started </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.memberButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.memberButtonText}>Already a Member</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  memberButton: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  memberButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default First;

