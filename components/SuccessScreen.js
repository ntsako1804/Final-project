import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SuccessScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('MainTabs');
    }, 2000); // Simulate a delay for loading
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentContainer}>
        <Ionicons name="checkmark-circle" size={48} color="green" />
        <Text style={styles.title}>Success</Text>
        <Text style={styles.message}>You have successfully set up the app. You can now get started.</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity style={styles.okButton} onPress={handlePress}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  okButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessScreen;
