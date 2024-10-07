//Explore.js where you can find friends
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
  const imageWidth = dimensions.width;
  const { user_id: currentUserId } = route.params;

  const getUserContacts = useCallback(async () => {
    try {
      const userDocRef = doc(FIREBASE_DB, "users", currentUserId);
      const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
        const user = snapshot.data();
        console.log("User data:", user); // Log user data
        if (!user) return;
  
        const contactsObject = user.realFriend || [];
        contactsObject.push(currentUserId);
  
        console.log("Contacts object:", contactsObject); // Log contacts object
  
        const q = query(collection(FIREBASE_DB, "users"), where("uid", 'not-in', contactsObject.slice(0, 10)));
        const contactsSnap = await getDocs(q);
  
        if (!contactsSnap.empty) {
          const contactDetails = contactsSnap.docs.map((d) => ({
            ...d.data(),
            key: d.data().uid,
          }));
          console.log("Contacts details:", contactDetails); // Log contact details
          setUsers(contactDetails);
        } else {
          setUsers([]);
        }
        setLoading(false);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching user contacts: ", error);
      setLoading(false);
    }
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4E50F7" />
      </View>
    );
  }

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#FFFFFF' }} />
      <View style={{ backgroundColor: '#E5EAFD', flex: 1, alignItems: 'center' }}>
        {/* <Image source={require('../assets/Explore_hero.jpg')} style={{ width: imageWidth, height: 270, marginBottom: 15, marginTop: 0 }} /> */}
        <Text style={{ marginVertical: 20, fontWeight: '800' }}>SWIPE to find who is your FRIEND</Text>

        <View style={styles.container}>
          <SwipeListView
            useFlatList={true}
            data={users}
            renderItem={(data, rowMap) => (
              <View style={styles.rowFront}>
                <Text>I am {data.item.name}</Text>
                <Image source={{ uri: data.item.avatar }} style={{ width: 50, height: 50 }} />
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
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5EAFD',
    flex: 1,
    width: '90%'
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: 'black',
    borderBottomWidth: 0,
    justifyContent: 'center',
    height: 50,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    height: 50, // Match rowFront height
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#AE64F3',
    right: 0,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10
  },
  backLeftBtn: {
    backgroundColor: '#F4B1BA',
    left: 0,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  },
});

export default ExploreScreen;