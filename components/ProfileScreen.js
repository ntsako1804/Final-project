import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


dayjs.extend(relativeTime);

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('Mandla Goniwe');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSubscreen, setActiveSubscreen] = useState('Target');
  const [mediaList, setMediaList] = useState([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [selectedMediaUri, setSelectedMediaUri] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState(null);
  const [selectedMediaDate, setSelectedMediaDate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [feedList, setFeedList] = useState([]);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setMediaList([...mediaList]);
    }, 60000);

    return () => clearInterval(interval);
  }, [mediaList]);

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      showSuccessMessage('Profile picture uploaded successfully!');
    }
    setLoading(false);
  };

  const uploadMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    setUploading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newMedia = {
        uri: result.assets[0].uri,
        type: result.assets[0].type,
        date: new Date(),
        username: username,
        caption: '',
      };
      setMediaList([...mediaList, newMedia]);
      setFeedList([...feedList, newMedia]);
      showSuccessMessage('Media uploaded successfully!');
    }
    setUploading(false);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const openMedia = (uri, type, date) => {
    setSelectedMediaUri(uri);
    setSelectedMediaType(type);
    setSelectedMediaDate(date);
    setMediaModalVisible(true);
  };

  const deleteMedia = (index) => {
    Alert.alert(
      'Delete Media',
      'Are you sure you want to delete this media?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newMediaList = [...mediaList];
            newMediaList.splice(index, 1);
            setMediaList(newMediaList);
            showSuccessMessage('Media deleted successfully!');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const FeedItem = ({ item }) => {
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [hasLiked, setHasLiked] = useState(false);
    const [commenting, setCommenting] = useState(false);

    const handleLike = () => {
      if (!hasLiked) {
        setLikes(likes + 1);
        setHasLiked(true);
      }
    };

    const handleComment = () => {
      if (newComment.trim()) {
        setComments([...comments, newComment]);
        setNewComment('');
      }
    };

    return (
      <View style={styles.feedItem}>
        <View style={styles.feedHeader}>
          <View style={styles.feedUserDetails}>
            <Image source={{ uri: profileImage }} style={styles.feedProfileImage} />
            <Text style={styles.feedUsername}>{item.username}</Text>
          </View>
          <Text style={styles.feedTime}>{dayjs(item.date).fromNow()}</Text>
        </View>
        <Text style={styles.feedCaption}>{item.caption}</Text>
        <View style={styles.feedMedia}>
          {item.type.startsWith('image') ? (
            <Image source={{ uri: item.uri }} style={styles.feedImage} />
          ) : (
            <Video source={{ uri: item.uri }} style={styles.feedVideo} useNativeControls />
          )}
        </View>
        <View style={styles.feedReactions}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons name="heart" size={24} color="red" />
            <Text style={styles.reactionCount}>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCommenting(!commenting)}>
            <Ionicons name="chatbubble" size={24} color="white" />
            <Text style={styles.reactionCount}>{comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {commenting && (
          <View style={styles.commentSection}>
            <FlatList
              data={comments}
              keyExtractor={(comment, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}
            />
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor="gray"
              onSubmitEditing={handleComment}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={selectImage}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <TouchableOpacity onPress={() => openMedia(profileImage, 'image')}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="person-circle" size={100} color="white" />
            )}
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" style={styles.loadingIndicator} />
            ) : (
              <Ionicons name="camera" size={24} color="white" style={styles.cameraIcon} />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>{username}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveSubscreen('Target')}>
          <Text style={styles.menuItemText}>Target</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveSubscreen('Photo')}>
          <Text style={styles.menuItemText}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveSubscreen('Trainer')}>
          <Text style={styles.menuItemText}>Feed</Text>
        </TouchableOpacity>
      </View>

      {activeSubscreen === 'Target' && (
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>My Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>80% to target weight</Text>
          </View>
          <Text style={styles.subtitle}>My Goals</Text>
          <Text style={styles.goalText}>Lose 10 kg by December</Text>
          <Text style={styles.goalText}>Run a marathon</Text>
        </View>
      )}

      {activeSubscreen === 'Photo' && (
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>Photo Gallery</Text>
          <FlatList
            data={mediaList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.photoItem}>
                <TouchableOpacity onPress={() => openMedia(item.uri, item.type, item.date)}>
                  {item.type.startsWith('image') ? (
                    <Image source={{ uri: item.uri }} style={styles.photo} />
                  ) : (
                    <Video source={{ uri: item.uri }} style={styles.photo} useNativeControls />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMedia(index)}>
                  <Ionicons name="trash" size={24} color="red" style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            )}
            horizontal
          />
          <TouchableOpacity style={styles.uploadButton} onPress={uploadMedia}>
            <Ionicons name="cloud-upload" size={24} color="white" />
            <Text style={styles.uploadButtonText}>Upload Media</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeSubscreen === 'Trainer' && (
        <ScrollView style={styles.contentContainer}>
          <FlatList
            data={feedList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <FeedItem item={item} />}
          />
        </ScrollView>
      )}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{successMessage}</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={mediaModalVisible} transparent animationType="slide">
        <View style={styles.mediaModalContainer}>
          <TouchableOpacity
            style={styles.mediaModalCloseButton}
            onPress={() => setMediaModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.mediaModalContent}>
            {selectedMediaType && selectedMediaType.startsWith('image') ? (
              <Image source={{ uri: selectedMediaUri }} style={styles.fullScreenImage} />
            ) : (
              <Video source={{ uri: selectedMediaUri }} style={styles.fullScreenVideo} useNativeControls />
            )}
            <Text style={styles.mediaModalDate}>{dayjs(selectedMediaDate).format('MMMM D, YYYY')}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2A38',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    width: '80%',
    height: '100%',
    backgroundColor: 'green',
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  goalText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  photoItem: {
    marginRight: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  feedItem: {
    backgroundColor: '#282828',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  feedUserDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  feedUsername: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedTime: {
    color: 'gray',
    fontSize: 14,
  },
  feedCaption: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  feedMedia: {
    marginBottom: 10,
  },
  feedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  feedVideo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  feedReactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reactionCount: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  commentSection: {
    marginTop: 10,
  },
  commentInput: {
    backgroundColor: '#383838',
    color: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediaModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  mediaModalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  mediaModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  fullScreenVideo: {
    width: '100%',
    height: '80%',
  },
  mediaModalDate: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});
export default ProfileScreen;
