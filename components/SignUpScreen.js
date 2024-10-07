import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ActivityIndicator, AppState, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../components/ProgressBar';

const { width, height } = Dimensions.get('window');

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [promptModalVisible, setPromptModalVisible] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [avatar, setAvatar] = useState('https://robohash.org/default');
  const [profileImage, setProfileImage] = useState(null);

  const totalSteps = 5;
  const currentStep = 1;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (!fname || !email || !password || !confirmPassword) {
      setPromptMessage('Please fill in all fields');
      setPromptModalVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setPromptMessage('Please enter a valid email address');
      setPromptModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setPromptMessage("Passwords don't match");
      setPromptModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      await sendEmailVerification(response.user);

      const initialData = {
        uid: response.user.uid,
        email: email,
        name: fname,
        avatar: avatar || 'default_avatar_url',
        req: [],
        realFriend: [],
        profileImage: profileImage,
      };

      await setDoc(doc(FIREBASE_DB, "users", response.user.uid), initialData);

      await updateProfile(response.user, {
        displayName: fname,
        photoURL: avatar,
      });

      setIsVerifying(true);
      setPromptMessage('Check your email for the verification link.');
      setPromptModalVisible(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setPromptMessage('The email address is already in use by another account.');
      } else {
        setPromptMessage('Sign up failed: ' + error.message);
      }
      setPromptModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const generateAvatar = () => {
    if (fname.trim() !== '') {
      setAvatar(`https://robohash.org/${fname}`);
    } else {
      setPromptMessage("Please enter your name first.");
      setPromptModalVisible(true);
    }
  };

  useEffect(() => {
    const checkEmailVerified = async () => {
      if (FIREBASE_AUTH.currentUser) {
        await FIREBASE_AUTH.currentUser.reload();
        if (FIREBASE_AUTH.currentUser.emailVerified) {
          await AsyncStorage.setItem('isEmailVerified', 'true');
          setModalVisible(true);
        }
      }
    };

    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active' && isVerifying) {
        await checkEmailVerified();
        setIsVerifying(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isVerifying]);

  const handleModalClose = async () => {
    setModalVisible(false);
    await AsyncStorage.setItem('isEmailVerified', 'false');
    await AsyncStorage.setItem('user_id', FIREBASE_AUTH.currentUser.uid);
    navigation.navigate('FitnessOnboarding', { userName: fname });
  };

  useEffect(() => {
    const checkInitialVerification = async () => {
      const isEmailVerified = await AsyncStorage.getItem('isEmailVerified');
      if (isEmailVerified === 'true') {
        await AsyncStorage.setItem('isEmailVerified', 'false');
        setModalVisible(true);
      }
    };

    checkInitialVerification();
  }, []);

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/da/97/ff/da97ff06628a8ac2c982dd66e1d7272c.jpg' }}
      style={styles.background}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign up</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.prompt}>
            Looks like you don't have an account. Let's create a new account for you!
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={fname}
              onChangeText={setFname}
              placeholder="Username"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#999"
              autoCapitalize="none"
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              autoCapitalize="none"
              secureTextEntry={!isPasswordVisible}
            />
          </View>

          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity
              onPress={generateAvatar}
              style={styles.generateButton}
            >
              <Text style={styles.generateButtonText}>Generate Avatar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.terms}>
            By selecting Agree and Continue below, I agree to
            <Text style={styles.link}> Terms of Service</Text> and
            <Text style={styles.link}> Privacy Policy</Text>
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Agree and Continue</Text>}
          </TouchableOpacity>
        </View>
        <ProgressBar step={currentStep} /> 
      </SafeAreaView>

      {/* Modal for general prompts */}
      <Modal
        visible={promptModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setPromptModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Notice</Text>
            <Text style={styles.modalText}>{promptMessage}</Text>
            <TouchableOpacity
              onPress={() => setPromptModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for email verification */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Email Verification</Text>
            <Text style={styles.modalText}>
              Your email has been verified. Let's get started!
            </Text>
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  form: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  prompt: {
    color: '#fff',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
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
  toggleButton: {
    padding: 10,
  },
  terms: {
    color: '#fff',
    marginBottom: 20,
  },
  link: {
    color: '#00f',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  iconContainer: {
    backgroundColor: '#2196F3',
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  generateButton: {
    backgroundColor: '#A8A8A8',
    paddingHorizontal: 5,
    paddingVertical: 10,
    width: '50%',
    borderRadius: 5,
  },
  generateButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default SignUp;
