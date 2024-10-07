import React, { useState, useEffect, memo  } from 'react';
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
import { setDoc, doc, addDoc, collection, getDocs,getDoc, updateDoc, arrayUnion, arrayRemove, query, where, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import FeedItem from '../FeedItem';
import StepCounter from '../StepCounter';


dayjs.extend(relativeTime);


const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setfullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSubscreen, setActiveSubscreen] = useState('Photo');
  const [mediaList, setMediaList] = useState([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [selectedMediaUri, setSelectedMediaUri] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState(null);
  const [selectedMediaDate, setSelectedMediaDate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [feedList, setFeedList] = useState([]);
  const [saveConfirmModalVisible, setSaveConfirmModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [isCaptionModalVisible, setCaptionModalVisible] = useState(false);
  const [originalProfileImage, setOriginalProfileImage] = useState(null);

  const user = FIREBASE_AUTH.currentUser;

useEffect(() => {
  setLoading(true);

  const fetchUserData = async () => {
    try {
      const docRef = doc(FIREBASE_DB, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setfullName(data.fullName);
        setProfileImage(data.profileImage);
        setOriginalProfileImage(data.profileImage);

        // Fetch feed list if it exists in user document
        if (data.feedList) {
          setFeedList(data.feedList);
        } 

        // Fetch media list from the 'media' collection where the userId matches the current user
        await fetchUserMedia(); // Call the new function to fetch media from the 'media' collection
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMedia = async () => {
    try {
      // Create a query to get all media documents where userId matches the current user's UID
      const mediaQuery = query(collection(FIREBASE_DB, 'media'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(mediaQuery);

      const userMediaList = [];
      querySnapshot.forEach((doc) => {
        userMediaList.push({ id: doc.id, ...doc.data() }); // Include the document ID
      });

      setMediaList(userMediaList); // Update the media list with fetched data
    } catch (error) {
      console.error('Error fetching media from collection:', error);
    }
  };

  fetchUserData();

  // Refresh media list periodically
  const interval = setInterval(() => {
    fetchUserMedia(); // Refresh the media list every minute
  }, 60000);

  return () => clearInterval(interval); // Cleanup interval on component unmount
}, []); // No dependency on mediaList to avoid infinite loop

  const checkPermissionsAndSetLoading = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return false;
    }
    setLoading(true);
    return true;
  };
  

  const selectImage = async () => {
    const hasPermission = await checkPermissionsAndSetLoading(); // Assuming this function handles permissions
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        setSaveConfirmModalVisible(true);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    } finally {
      setLoading(false);
    }
  }; 

  const uploadImage = async (imageUri) => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const filename = `profile_${userId}_${Date.now()}.jpg`; // Unique filename for profile image
      const storage = getStorage();
      const profileImageRef = ref(storage, `profileImages/${filename}`);

      // Fetch the image as a blob
      const response = await fetch(imageUri);
      const blob = await response.blob(); // Convert the image URI to a Blob

      // Upload the blob to Firebase Storage
      const snapshot = await uploadBytes(profileImageRef, blob);
      console.log('Uploaded profile image!', snapshot);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; // Return the download URL
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Rethrow the error for handling in handleSaveData
    }
  };

  const handleSaveData = async () => {
    if (!profileImage) {
      Alert.alert('Please select a profile image');
      return;
    }

    setLoading(true);
    try {
      const uploadedImageUrl = await uploadImage(profileImage); // Upload image and get URL
      const userId = FIREBASE_AUTH.currentUser.uid; // Get the current user's UID

      // Save the profile image URL to Firestore
      await updateDoc(doc(FIREBASE_DB, 'users', userId), {
        profileImage: uploadedImageUrl, // Save the download URL to Firestore
      });

      showSuccessMessage('Profile picture uploaded successfully!');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
      setOriginalProfileImage(uploadedImageUrl); // Update the state with the new image URL
    } catch (error) {
      console.error('Error saving profile picture:', error);
    } finally {
      setSaveConfirmModalVisible(false);
      setLoading(false);
    }
  };

const handleCancel = () => {
  setProfileImage(originalProfileImage); // Revert to the original profile image URI
  setSaveConfirmModalVisible(false);
};

const handleCancell = () => {
  setCaptionModalVisible(false); // Close modal without submitting
  setCaption(''); // Reset the caption input
};



const uploadMedia = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permission to access gallery is required!');
    return;
  }

  setUploading(true);
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const selectedMedia = {
      uri: result.assets[0].uri,
      type: result.assets[0].type,
      date: new Date(),
      fullName: fullName,
      caption: '',
      profileImage: profileImage,
    };

    setSelectedMedia(selectedMedia);
    console.log('Selected media: ', selectedMedia); // Check if the media selection works
    setCaptionModalVisible(true); // Open caption modal to allow user to input caption
  } else {
    console.log('Media selection was canceled');
  }

  setUploading(false);
};

const uploadMediaToStorage = async (mediaUri, mediaType) => {
  try {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const fileExtension = mediaType === 'image' ? 'jpg' : 'mp4'; // Handle different media types
    const filename = `media_${userId}_${Date.now()}.${fileExtension}`; // Unique filename
    const storage = getStorage();
    const mediaRef = ref(storage, `media/${filename}`);

    // Fetch the media as a blob
    const response = await fetch(mediaUri);
    const blob = await response.blob(); // Convert the media URI to a Blob

    // Upload the blob to Firebase Storage
    const snapshot = await uploadBytes(mediaRef, blob);
    console.log('Uploaded media!', snapshot);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL; // Return the download URL
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};


const handleSaveMedia = async () => {
  if (!selectedMedia) return;  // Ensure media is selected before proceeding

  setLoading(true);

  try {
    // Upload the selected media (image or video) and get the media URL from Firebase Storage
    const mediaUrl = await uploadMediaToStorage(selectedMedia.uri, selectedMedia.type); 

    const userId = FIREBASE_AUTH.currentUser.uid; // Get the current user's UID

    // Prepare the media data object with necessary information
    const mediaData = {
      ...selectedMedia,    // Copy over the selected media fields (like uri, type, etc.)
      userId,              // Add the current user's ID
      caption,             // Add the caption input by the user
      mediaUrl,            // The URL returned from Firebase Storage
      createdAt: new Date(), // Timestamp for when the media is uploaded
      likes: 0,            // Initialize likes to 0
      likedBy: [],
      type: selectedMedia.type,     
    };

    // Log the media data to ensure it's correct
    console.log('Saving media data to Firestore:', mediaData);

    // Save media data into the 'media' collection in Firestore
    await addDoc(collection(FIREBASE_DB, 'media'), mediaData);

    // Update local lists or state if necessary
    const updatedMediaList = [...mediaList, mediaData];
    const updatedFeedList = [...feedList, mediaData];
    
    setMediaList(updatedMediaList);  // Update the media list
    setFeedList(updatedFeedList);    // Update the feed list

    Alert.alert('Media uploaded successfully!');
  } catch (error) {
    console.error('Error saving media:', error);
  } finally {
    setCaptionModalVisible(false); // Close the modal after saving
    setLoading(false); // Stop the loading state
    setSelectedMedia(null); // Clear the selected media after saving
    setCaption(''); // Reset the caption input
  }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen', { user_id: user.uid })}>
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

        <Text style={styles.profileName}>{fullName}</Text>

        <Modal
          animationType="fade"
          transparent={true}
          visible={saveConfirmModalVisible}
          onRequestClose={() => setSaveConfirmModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Save the profile picture?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSaveData}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.successContainer}>
          <View style={styles.successContent}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.menuContainer}>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveSubscreen('Photo')}>
          <Text style={styles.menuItemText}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setActiveSubscreen('Trainer')}>
          <Text style={styles.menuItemText}>Timeline</Text>
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

          {/* FlatList for Grid Layout */}
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
                </TouchableOpacity>
              </View>
            )}
            numColumns={3} // Display 3 items per row
          />

          <TouchableOpacity style={styles.uploadButton} onPress={uploadMedia}>
            {uploading ? (
              <ActivityIndicator size="small" color="#ffffff" style={styles.uploadingIndicator} />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={24} color="white" />
                <Text style={styles.uploadButtonText}>Upload Media</Text>
              </>
            )}
          </TouchableOpacity>
          {/* Caption Modal */}
          <Modal
                  visible={isCaptionModalVisible}  // Modal visibility depends on this state
                  animationType="fade"
                  transparent={true}
                  onRequestClose={() => setCaptionModalVisible(false)}
                >
                  <View style={styles.captionModalContainer}>
                    <View style={styles.captionModalContent}>
                      <Text style={styles.modalTitle}>Add a caption</Text>
                      <TextInput
                        style={styles.captionInput}
                        value={caption}
                        onChangeText={setCaption}
                        placeholder="Enter a caption..."
                        placeholderTextColor="gray"
                      />
                      <View style={styles.modalButtons}>
                        {/* Upload Button in Caption Modal */}
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={handleSaveMedia}
                          disabled={uploading} // Disable if uploading
                        >
                          {uploading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                          ) : (
                            <Text style={styles.modalButtonText}>Upload</Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={handleCancell}
                        >
                          <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
            </Modal>
        </View>
      )}

      {activeSubscreen === 'Trainer' && (
          <FlatList style={styles.contentContainer}
          data={mediaList} // mediaList fetched from Firestore
          keyExtractor={(item) => item.id} // Ensure each item has a unique key
          renderItem={({ item }) => <FeedItem item={item} />} // Pass each media item to FeedItem
          />
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
    backgroundColor: '#101629',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 1,
    marginTop:-10,
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
    borderColor: '#2196F3', // Accent color to match the workout screen
    borderWidth: 2,
  },
  profileName: {
    color: '#FFFFFF', // White text to contrast against dark background
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3', // Accent color for camera icon background
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
    color: '#FFFFFF', // White text for menu items
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitle: {
    color: '#1DB954', // Green accent color for subtitles
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#333333', // Darker background for the progress bar
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    width: '80%',
    height: '100%',
    backgroundColor: '#1DB954', // Green fill for the progress bar
  },
  progressText: {
    color: '#FFFFFF', // White text for progress text
    fontSize: 14,
    marginTop: 5,
  },
  goalText: {
    color: '#FFFFFF', // White text for goal text
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
    backgroundColor: '#333333', // Dark background for delete icon
    borderRadius: 12,
    padding: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1DB954', // Green background for upload button
    paddingVertical: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#FFFFFF', // White text for upload button
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  commentInput: {
    backgroundColor: '#383838', // Dark background for comment input
    color: '#FFFFFF', // White text for comment input
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background for modal
  },
  modalContent: {
    backgroundColor: '#FFFFFF', // White background for modal content
    borderRadius: 10,
    padding: 20,
  },
  modalText: {
    color: '#000000', // Black text for modal
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediaModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark background for media modal
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
    color: '#FFFFFF', // White text for media modal date
    fontSize: 16,
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  captionModalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
captionModalContent: {
  width: '80%',
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
},
captionInput: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  borderRadius: 5,
  marginBottom: 20,
  color: 'black',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
modalButton: {
  padding: 10,
  backgroundColor: '#1DB954',
  borderRadius: 5,
  width: '45%',
  alignItems: 'center',
},
modalButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
photoItem: {
  flex: 1 / 3, // Ensure each item takes up 1/3rd of the available width
  margin: 5,
},
photo: {
  width: '100%',  // Ensure the photo fills the item container
  height: 120,
  borderRadius: 10,
},



});
export default ProfileScreen;