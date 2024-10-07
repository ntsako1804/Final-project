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
  const imageWidth = dimensions.width;

  const signOutNow = () => {
    signOut(FIREBASE_AUTH).then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  }

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
  }

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
  }

  const rejectAction = (uid) => {
    updateDoc(doc(FIREBASE_DB, "users", route.params.user_id), {
      "req": arrayRemove(uid),
    });
  }

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#FAF8E7' }} />
      <View style={{ backgroundColor: '#FF6C77', flex: 1, alignItems: 'center' }}>
        {/* <Image source={require('../assets/Noti_hero.jpg')} style={{ width: imageWidth, height: 270, marginBottom: 30, marginTop: 0 }} /> */}
        <FlatList
          data={notiUsers}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.item}>
                <Image source={{ uri: item.avatar }} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name} wants to be your friend</Text>
                  <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                      acceptAction(item.id);
                      navigation.navigate('Chat', { name: item.name, uid: item.id });
                    }}>
                      <Text style={styles.buttonText}>Yes, SURE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => rejectAction(item.id)}>
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
            source={{uri:'..assets\adaptive-icon.png'}} // Use a valid path or URL
            style={styles.floatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    width: Dimensions.get('window').width * 0.9
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row-reverse',
  },
  button: {
    backgroundColor: '#FFC107',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
});

export default NotificationScreen;
