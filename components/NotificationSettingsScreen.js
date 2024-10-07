// NotificationSettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

const NotificationSettingsScreen = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(false);

  const togglePushNotifications = () => setPushNotifications(!pushNotifications);
  const toggleSound = () => setSound(!sound);
  const toggleVibration = () => setVibration(!vibration);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch value={pushNotifications} onValueChange={togglePushNotifications} />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Sound</Text>
        <Switch value={sound} onValueChange={toggleSound} />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Vibration</Text>
        <Switch value={vibration} onValueChange={toggleVibration} />
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#1A2E47',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NotificationSettingsScreen;
