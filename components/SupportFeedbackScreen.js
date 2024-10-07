// SupportFeedbackScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SupportFeedbackScreen = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.feedbackButton} onPress={() => Linking.openURL('https://mail.google.com/mail/mu/mp/306/#tl/priority/%5Esmartlabel_personal')}>
        <Text style={styles.feedbackText}>Send Feedback</Text>
        <Text style={styles.feedbackSubtext}>What can we improve?</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Follow Us</Text>

      <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://www.instagram.com/fit_nessfusion1?igsh=MXJibDBqeWN0ZTgzaQ==')}>
        <Icon name="instagram" size={20} color="#000" />
        <Text style={styles.socialText}>Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61566347461597&mibextid=LQQJ4d')}>
        <Icon name="facebook" size={20} color="#000" />
        <Text style={styles.socialText}>Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL('https://x.com/fitnessfus1/status/1840362329151512726?s=46')}>
        <Icon name="twitter" size={20} color="#000" />
        <Text style={styles.socialText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  feedbackButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  socialText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default SupportFeedbackScreen;