import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState, Fragment } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Image, FlatList, View, Dimensions, ActivityIndicator } from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';

const MessageScreen = ({ navigation, route }) => {
  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width;

  const [notiUsers, setNotiUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user_id: currentUserId } = route.params;

  useEffect(() => {
    const getUserContacts = () => {
      const userDocRef = doc(FIREBASE_DB, "users", currentUserId);
      
      const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
        const userData = snapshot.data();
        
        // Ensure that userData exists and realFriend is an array
        if (!userData || !Array.isArray(userData.realFriend)) {
          setNotiUsers([]);
          setLoading(false);
          return;
        }
  
        const contactsObject = Array.isArray(userData.realFriend) ? userData.realFriend : [];
        
        // If no friends, stop loading and return
        if (contactsObject.length === 0) {
          setNotiUsers([]);
          setLoading(false);
          return;
        }
        
        try {
          const contactsSnap = await Promise.all(
            contactsObject.map((c) => getDoc(doc(FIREBASE_DB, "users", c)))
          );
          
          const contactDetails = contactsSnap
            .filter((d) => d.exists()) // Filter out any undefined or non-existing documents
            .map((d) => ({
              uid: d.id,
              ...d.data(),
            }));
          
          setNotiUsers(contactDetails);
        } catch (error) {
          console.error("Error fetching contacts:", error);
          setNotiUsers([]); // Ensure notiUsers is defined in case of an error
        } finally {
          setLoading(false);
        }
      });
  
      return () => unsubscribe(); // Cleanup on component unmount
    };
  
    getUserContacts();
  }, [navigation, currentUserId]);

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#0D1B2A' }} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('ExploreScreen', { user_id: currentUserId })}
        >
          <Text style={styles.exploreButtonText}>Explore and Find Friends</Text>
        </TouchableOpacity>
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0D1B2A" />
          ) : notiUsers.length === 0 ? (
            <View style={styles.noFriendsContainer}>
              <Text style={styles.noFriendsText}>You have no friends yet! Click the button above to find friends.</Text>
            </View>
          ) : (
            <FlatList
              data={notiUsers}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Inbox', { name: item.name, uid: item.uid, avatar: item.avatar })}>
                  <View style={styles.card}>
                    {item.profileImage ? (
                      <Image style={styles.userImageST} source={{ uri: item.profileImage }} />
                    ) : (
                      <View style={styles.placeholderImage} /> // Placeholder style for missing images
                    )}
                    <View style={styles.textArea}>
                      <Text style={styles.nameText}>{item.name || "Unknown User"}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101629',
    alignItems: 'center',
    paddingTop: 20,
  },
  exploreButton: {
    backgroundColor: '#1E2742',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 8,
    backgroundColor: '#1E2742',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  userImageST: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  placeholderImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#CCC', // Light gray for placeholder
    marginRight: 15,
  },
  textArea: {
    flex: 1,
    borderBottomWidth: 0,
  },
  nameText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
  },
  noFriendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFriendsText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default MessageScreen;
