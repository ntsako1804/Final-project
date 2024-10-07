import React, { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import FeedItem from '../FeedItem'; // Reuse the existing FeedItem component

const PeopleScreen = ({ navigation }) => {
  const [friendsMedia, setFriendsMedia] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading true
  const [error, setError] = useState(null); // Error state
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!currentUser) {
      // Redirect to login or show a message
      console.log('User is not authenticated');
      return; // Stop fetching data if user is not authenticated
    }

    const mediaQuery = query(
      collection(FIREBASE_DB, 'media'),
      where('userId', '!=', currentUser.uid), // Exclude current user
      orderBy('createdAt', 'desc') // Order by creation date
    );

    const unsubscribe = onSnapshot(mediaQuery, (snapshot) => {
      const mediaData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setFriendsMedia(mediaData);
      setLoading(false); // Stop loading
    }, (error) => {
      console.error('Error fetching friends media:', error);
      setError('Error fetching media'); // Set error state
      setLoading(false); // Stop loading
    });

    return () => unsubscribe(); // Clean up on unmount
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.tab, styles.activeTab]} // Default to People tab being active
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>
            Articles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, styles.activeTab]} // Active tab for People
        >
          <Text style={[styles.tabText, styles.activeTabText]}>
            People
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={friendsMedia}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedItem item={item} />}
        contentContainerStyle={styles.articleList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B636E', // Same background color as HomeScreen
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#B0C4DE',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  articleList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B636E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B636E',
  },
  errorText: {
    color: '#FF0000', // Error text color
  },
});

export default PeopleScreen;
