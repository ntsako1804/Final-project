import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showModal('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            showModal('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            // Attempt to sign in with Firebase authentication
            const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);

            // If successful, get the user's ID
            const userId = userCredential.user.uid;

            // Save the user ID in AsyncStorage
            await AsyncStorage.setItem('user_id', userId);

            // Navigate to the main tabs screen
            navigation.navigate('MainTabs');
        } catch (error) {
            setLoading(false);
            if (error.code === 'auth/wrong-password') {
                showModal('Incorrect password');
            } else if (error.code === 'auth/user-not-found') {
                showModal('No user found with this email');
            } else if (error.code === 'auth/invalid-email') {
                showModal('Invalid email format');
            } else if (error.code === 'auth/invalid-credential') {
                showModal('Invalid email or password');
            } else {
                showModal(`Login failed: ${error.message}`);
            }
        }
        setLoading(false);
    };

    return (
        <ImageBackground source={{ uri: 'https://i.pinimg.com/736x/da/97/ff/da97ff06628a8ac2c982dd66e1d7272c.jpg' }} 
            style={styles.background} 
            resizeMode="cover">
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.container}>
                <Text style={styles.header}>WELCOME</Text>
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
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color="#999" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={styles.passwordIcon} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#999" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
                    <Text style={styles.forgotPassword}>Forgot Password? Click Here</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.registerText}>REGISTER</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for error messages */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
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
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    container: {
        width: '80%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        color: '#fff',
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
    passwordIcon: {
        padding: 10,
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
    forgotPassword: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        borderRadius: 5,
    },
    registerText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Login;
