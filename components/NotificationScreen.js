import { collection, addDoc, query, orderBy, onSnapshot, where, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import React, { useEffect, useState, Fragment } from 'react';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Dimensions,
  View
} from 'react-native';
import { signOut } from 'firebase/auth';

const NotificationScreen = ({ navigation, route }) => {
  const [notiUsers, setNotiUsers] = useState([]);
  const dimensions = Dimensions.get('window');

  const signOutNow = () => {
    signOut(FIREBASE_AUTH).then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  };

  const getUserContacts = () => {
    const q = doc(FIREBASE_DB, "users", route.params.user_id);
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const contactsObject = snapshot.data().req || [];
      const contactsSnap = await Promise.all(contactsObject.map((c) => getDoc(doc(FIREBASE_DB, "users", c))));
      
      const contactDetails = contactsSnap.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      setNotiUsers(contactDetails);
    });

    return unsubscribe; // Return unsubscribe function
  };

  useEffect(() => {
    const unsubscribe = getUserContacts();
    return () => unsubscribe(); // Clean up listener on unmount
  }, [route.params.user_id]);

  const acceptAction = (uid) => {
    updateDoc(doc(FIREBASE_DB, "users", uid), {
      "realFriend": arrayUnion(route.params.user_id),
    });
    updateDoc(doc(FIREBASE_DB, "users", route.params.user_id), {
      "req": arrayRemove(uid),
      "realFriend": arrayUnion(uid),
    });
  };

  const rejectAction = (uid) => {
    updateDoc(doc(FIREBASE_DB, "users", route.params.user_id), {
      "req": arrayRemove(uid),
    });
  };

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#4B636E' }} />
      <View style={styles.container}>
        <FlatList
          data={notiUsers}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.item}>
                <Image source={{ uri: item.profileImage }} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.fullName} Wants to be your friend</Text>
                  <View style={styles.buttons}>
                    <TouchableOpacity style={styles.acceptButton} onPress={() => {
                      acceptAction(item.id);
                    }}>
                      <Text style={styles.buttonText}>Yes, SURE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton} onPress={() => rejectAction(item.id)}>
                      <Text style={styles.buttonText}>No, Bye</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={signOutNow}
          style={styles.touchableOpacityStyle}>
          <Image
            source={{uri: '../assets/adaptive-icon.png'}} // Use a valid path or URL
            style={styles.floatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#101629', // Match the HomeScreen background color
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#35495E', // Card color to maintain contrast
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
    width: Dimensions.get('window').width * 0.9,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#B0C4DE', // Matching border color
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B0C4DE', // Light text color for better readability
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  acceptButton: {
    backgroundColor: '#6BCB6E', // Lighter green for accept button
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: '#FF4B4B', // Lighter red for reject button
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 60,
    height: 60,
  },
});

export default NotificationScreen;
