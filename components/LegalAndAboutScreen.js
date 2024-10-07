// LegalAndAboutScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';

const LegalAndAboutScreen = () => {
  const openPrivacyPolicy = () => {
    Linking.openURL('https://yourapp.com/privacy-policy'); // URL for Privacy Policy
  };

  const openTermsOfService = () => {
    Linking.openURL('https://yourapp.com/terms-of-service'); // URL for Terms of Service
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About This App</Text>
      <Text style={styles.description}>
        Welcome to our fitness app! We are dedicated to helping you achieve your fitness goals with the best tools and resources. Track your workouts, monitor your progress, and stay motivated on your fitness journey.
      </Text>

      <Text style={styles.title}>App Version</Text>
      <Text style={styles.description}>Version 1.0.0</Text>

      <Text style={styles.title}>Legal</Text>
      <TouchableOpacity onPress={openPrivacyPolicy} style={styles.linkButton}>
        <Text style={styles.linkText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openTermsOfService} style={styles.linkButton}>
        <Text style={styles.linkText}>Terms of Service</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.description}>
        If you have any questions or concerns, feel free to reach out to our support team at support@yourapp.com.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#1E90FF',
  },
});

export default LegalAndAboutScreen;
