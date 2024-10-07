import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../firebaseConfig'; // Import Storage as well
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { GiftedChat, InputToolbar, Bubble, Send, Actions } from 'react-native-gifted-chat';
import * as ImagePicker from 'react-native-image-picker'; // For image/video picking
import * as DocumentPicker from 'expo-document-picker'; // For document picking
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // For storage interaction

const Inbox = ({ navigation, route }) => {
  const c_uid = FIREBASE_AUTH?.currentUser.uid;
  const t_uid = route.params.uid;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View style={styles.header}>
          <Avatar
            rounded
            size="medium"
            source={{ uri: route.params.avatar }}
          />
          <Text style={styles.headerTitle}>{route.params.name}</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#1C2E47',
      },
    });
    
    getAllMessages();
  }, [navigation]);

  useEffect(() => {
    getAllMessages();
  }, []);

  const getAllMessages = async () => {
    const chatid = t_uid > c_uid ? `${c_uid}-${t_uid}` : `${t_uid}-${c_uid}`;
    const q = query(collection(FIREBASE_DB, 'Chats', chatid, 'messages'), orderBy('createdAt', "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), createdAt: doc.data().createdAt.toDate() })));
      setLoading(false); // Stop loading once messages are fetched
    });

    return () => unsubscribe();
  };

  const onSendMsg = async (msgArray) => {
    const msg = msgArray[0];
    const time = new Date();
    const userMsg = {
      ...msg,
      sentBy: c_uid,
      sentTo: t_uid,
      createdAt: time,
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, userMsg));

    const chatid = t_uid > c_uid ? `${c_uid}-${t_uid}` : `${t_uid}-${c_uid}`;
    const docRef = collection(FIREBASE_DB, 'Chats', chatid, 'messages');
    await addDoc(docRef, { ...userMsg, createdAt: time });
  };

  const handleMediaUpload = async (response) => {
    if (response.didCancel) return;

    const chatid = t_uid > c_uid ? `${c_uid}-${t_uid}` : `${t_uid}-${c_uid}`;
    const media = response.assets[0];
    const mediaType = media.type;
    const storageRef = ref(FIREBASE_STORAGE, `Chats/${chatid}/${Date.now()}-${media.fileName}`);

    try {
      const file = await fetch(media.uri);
      const fileBlob = await file.blob();
      await uploadBytes(storageRef, fileBlob);
      const mediaUrl = await getDownloadURL(storageRef);

      const mediaMsg = {
        _id: Date.now(),
        text: '',
        createdAt: new Date(),
        user: { _id: c_uid, avatar: FIREBASE_AUTH?.currentUser?.photoURL },
        image: mediaType.startsWith('image') ? mediaUrl : undefined,
        video: mediaType.startsWith('video') ? mediaUrl : undefined,
        file: !mediaType.startsWith('image') && !mediaType.startsWith('video') ? mediaUrl : undefined,
      };

      onSendMsg([mediaMsg]);
    } catch (error) {
      console.error('Media upload failed:', error);
      Alert.alert('Error', 'Failed to upload media');
    }
  };

  const pickImageOrVideo = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'mixed' }, handleMediaUpload);
  };

  const pickDocument = async () => {
    const response = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (response.type === 'cancel') return;
    handleMediaUpload({ assets: [{ uri: response.uri, type: response.mimeType, fileName: response.name }] });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3A13C3" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // Adjust based on your header height
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GiftedChat
          messages={messages}
          onSend={text => onSendMsg(text)}
          user={{
            _id: c_uid,
            avatar: FIREBASE_AUTH?.currentUser?.photoURL,
          }}
          showAvatarForEveryMessage={true}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={styles.inputToolbar}
              textInputStyle={styles.input}
            />
          )}
          renderSend={(props) => (
            <Send {...props}>
              <View style={styles.sendButton}>
                <Ionicons name="send" size={24} color="#fff" />
              </View>
            </Send>
          )}
          renderActions={(props) => (
            <Actions
              {...props}
              options={{
                'Send Image/Video': pickImageOrVideo,
                'Send Document': pickDocument,
              }}
              icon={() => (
                <Ionicons name="attach" size={28} color="#000" style={{ marginRight: 5 }} />
              )}
            />
          )}
          renderBubble={(props) => (
            <Bubble
              {...props}
              textStyle={{
                right: { color: 'white' },
                left: { color: '#000' },
              }}
              wrapperStyle={{
                right: { backgroundColor: '#3A13C3' },
                left: { backgroundColor: '#E6F5F3' },
              }}
            />
          )}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputToolbar: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingVertical: 8,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#3A13C3',
    borderRadius: 20,
    padding: 4, // Reduced padding
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Inbox;
