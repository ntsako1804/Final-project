import { collection, getDocs, query, onSnapshot, where, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { FIREBASE_DB } from '../firebaseConfig';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

const ExploreScreen = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dimensions = Dimensions.get('window');
  const { user_id: currentUserId } = route.params;

  const getUserContacts = useCallback(() => {
    const userDocRef = doc(FIREBASE_DB, "users", currentUserId);

    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      const user = snapshot.data();
      if (!user) {
        setLoading(false);
        return;
      }

      const contactsObject = user.realFriend || [];
      const filteredContacts = contactsObject.filter(id => id !== currentUserId);
      
      try {
        let q;
        if (filteredContacts.length > 0) {
          q = query(collection(FIREBASE_DB, "users"), where("uid", 'not-in', filteredContacts));
        } else {
          q = query(collection(FIREBASE_DB, "users"), where("uid", "!=", currentUserId));
        }

        const contactsSnap = await getDocs(q);
        if (!contactsSnap.empty) {
          const contactDetails = contactsSnap.docs.map((d) => ({
            ...d.data(),
            key: d.data().uid,
          }));
          setUsers(contactDetails);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [currentUserId]);

  useEffect(() => {
    const unsubscribe = getUserContacts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [getUserContacts]);

  const closeRow = async (rowMap, rowKey) => {
    try {
      await updateDoc(doc(FIREBASE_DB, "users", rowKey), {
        "req": arrayUnion(currentUserId),
      });
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
        const newUsers = users.filter(item => item.key !== rowKey);
        setUsers(newUsers);
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1B2A' }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#4B636E' }} />
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Swipe to find your FRIEND</Text>

        <View style={styles.container}>
          <SwipeListView
            useFlatList={true}
            data={users}
            renderItem={(data, rowMap) => (
              <View style={styles.card}>
                <Image source={{ uri: data.item.avatar }} style={styles.userImageST} />
                <Text style={styles.userName}>{data.item.name}</Text>
              </View>
            )}
            renderHiddenItem={(data, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backLeftBtn]}
                  onPress={() => deleteRow(rowMap, data.item.key)}
                >
                  <Text style={styles.backTextWhite}>No...</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backRightBtnLeft]}
                  onPress={() => closeRow(rowMap, data.item.key)}
                >
                  <Text style={styles.backTextWhite}>Be My Friend</Text>
                </TouchableOpacity>
              </View>
            )}
            leftOpenValue={100}
            rightOpenValue={-100}
          />
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#101629', // Consistent background color
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    marginVertical: 20,
    fontWeight: '800',
    fontSize: 20,
    color: '#FFF',
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,
  },
  backTextWhite: {
    color: '#FFF',
    fontWeight: '600',
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
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
  },
  backRightBtnLeft: {
    backgroundColor: '#58A4B0',
    right: 0,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  backLeftBtn: {
    backgroundColor: '#F28D35',
    left: 0,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
});

export default ExploreScreen;
