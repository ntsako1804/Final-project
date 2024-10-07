import 'react-native-gesture-handler';
import { SafeAreaView,View,ScrollView, Text,TextInput, TouchableOpacity, StyleSheet,Dimensions, ImageBackground, Image,Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Verified = ({ navigation }) => {
  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/736x/da/97/ff/da97ff06628a8ac2c982dd66e1d7272c.jpg' }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✓</Text>
          </View>
          <Text style={styles.title}>Verified!</Text>
          <Text style={styles.subtitle}>
            Voila! You have successfully verified the account.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Verified;

