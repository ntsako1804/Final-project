import { doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState, Fragment } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Image, FlatList, View, Dimensions, ActivityIndicator } from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';

const MessageScreen = ({ navigation, route }) => {
  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width;

  const [notiUsers, setNotiUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserContacts = () => {
      const q = query(doc(FIREBASE_DB, "users", route.params.user_id));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const contactsObject = snapshot.data().realFriend;
        const contactsSnap = await Promise.all(contactsObject.map((c) => getDoc(doc(FIREBASE_DB, "users", c))));
        const contactDetails = contactsSnap.map((d) => ({
          uid: d.id,
          ...d.data()
        }));
        setNotiUsers(contactDetails);
        setLoading(false);
      });
    };

    getUserContacts();
  }, [navigation]);

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#F8AF00' }} />
      <View style={styles.container}>
        <Image source={{ uri: '../assets/adaptive-icon.png' }} style={{ width: imageWidth, height: 200, marginBottom: 20 }} />
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={notiUsers}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Chat', { name: item.name, uid: item.uid, avatar: item.avatar })}>
                  <View style={styles.card}>
                    <Image style={styles.userImageST} source={{ uri: item.avatar }} />
                    <View style={styles.textArea}>
                      <Text style={styles.nameText}>{item.name}</Text>
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
    backgroundColor: '#1E2A38',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userImageST: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textArea: {
    flex: 1,
    borderBottomWidth: 0,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  msgContent: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});

export default MessageScreen;
