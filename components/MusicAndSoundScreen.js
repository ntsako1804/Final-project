import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const playlists = [
  { id: '1', title: 'Pop & Electro Workout', image: 'https://i.pinimg.com/236x/d9/a4/bf/d9a4bfc9d522c1d6a50af0f0e823e59e.jpg' },
  { id: '2', title: 'Rap Workout', image: 'https://i.pinimg.com/474x/f7/90/dd/f790ddf5a92987bf8a2a48cd535d46a4.jpg' },
  { id: '3', title: 'Rock Workout', image: 'https://i.pinimg.com/236x/14/c8/c1/14c8c153b3e95d5b2d6f9a8954bb78a1.jpg' },
  { id: '4', title: 'Hardcore Workout', image: 'https://i.pinimg.com/236x/ff/d3/71/ffd37161572468bd70180e47d5b33083.jpg' },
  { id: '5', title: 'Hardcore Epic', image: 'https://i.pinimg.com/236x/aa/07/19/aa071946cadfdd4f331e5f6a2d8c1a51.jpg' },
  { id: '6', title: 'Yoga & Stretching', image: 'https://i.pinimg.com/236x/b0/d8/d1/b0d8d174cff307b8e2f0908bd059d896.jpg' },
];

const MusicAndSoundScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Spotify'); // Initial tab is Spotify

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity style={styles.playlistContainer}>
      <Image source={{ uri: item.image }} style={styles.playlistImage} />
      <Text style={styles.playlistText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.soundSettingsButton}
        onPress={() => navigation.navigate('MusicSoundScreen')}
      >
        <Text style={styles.soundSettingsText}>Sound Settings</Text>
      </TouchableOpacity>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Spotify' && styles.activeTab]}
          onPress={() => setSelectedTab('Spotify')}
        >
          <Text style={selectedTab === 'Spotify' ? styles.tabTextActive : styles.tabText}>
            Spotify
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Apple Music' && styles.activeTab]}
          onPress={() => setSelectedTab('Apple Music')}
        >
          <Text style={selectedTab === 'Apple Music' ? styles.tabTextActive : styles.tabText}>
            Apple Music
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylistItem}
        contentContainerStyle={styles.playlistList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B636E', // Darker background for contrast
    paddingTop: 20,
  },
  soundSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the text in the button
    padding: 16,
    backgroundColor: '#083061',
    marginHorizontal: 16,
    borderRadius: 10, // Slightly rounder corners
    marginBottom: 10,
    marginTop: 20, // Additional space above
  },
  soundSettingsText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold', // Bolder text for better emphasis
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    backgroundColor: '#1B2A3C', // Subtle background color for the tab bar
    borderRadius: 10,
    paddingVertical: 6, // Additional padding for the tab container
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    color: '#B0C4DE',
    fontSize: 16,
  },
  tabTextActive: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#35495E',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  playlistImage: {
    width: 70, // Larger image size
    height: 70,
    borderRadius: 10, // More rounded corners
    marginRight: 16,
  },
  playlistText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  playlistList: {
    paddingBottom: 20, // Extra padding for scrollable content
  },
});

export default MusicAndSoundScreen;
