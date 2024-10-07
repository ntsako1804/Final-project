import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_DB, FIREBASE_AUTH } from './firebaseConfig'; // Import Firebase Auth
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const FeedItem = ({ item }) => {
  const navigation = useNavigation();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [userProfile, setUserProfile] = useState({ username: '', profileImage: '' });
  const [commentCount, setCommentCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mediaType, setMediaType] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const unsubscribeLikes = onSnapshot(doc(FIREBASE_DB, 'mediaPosts', item.id), (docSnap) => {
      if (docSnap.exists()) {
        const mediaData = docSnap.data();
        setLikes(mediaData.likes || 0);
  
        // Ensure mediaData.likedBy is a valid array before proceeding
        const likedBy = Array.isArray(mediaData.likedBy) ? mediaData.likedBy : [];
        
        // Get the current user
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          setHasLiked(likedBy.includes(currentUser.uid)); // Safely check if current user has liked the post
        }
      }
    });
  
    const unsubscribeComments = onSnapshot(doc(FIREBASE_DB, 'mediaPosts', item.id, 'comments', 'totalCommentsCount'), (docSnap) => {
      if (docSnap.exists()) {
        const commentsData = docSnap.data();
        setCommentCount(commentsData.totalCommentsCount || 0);
      }
    });
  
    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [item.id]);
  

  const handleLike = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) return;

    const mediaDocRef = doc(FIREBASE_DB, 'mediaPosts', item.id);

    try {
      if (hasLiked) {
        await updateDoc(mediaDocRef, {
          likes: likes - 1,
          likedBy: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(mediaDocRef, {
          likes: likes + 1,
          likedBy: arrayUnion(currentUser.uid),
        });
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const handleCommentNavigate = () => {
    navigation.navigate('CommentScreen', {
      mediaId: item.id,
    });
  };

  const handleMediaPress = (type) => {
    setMediaType(type);
    setIsFullScreen(true);
  };

  const renderMediaContent = () => {
    const { mediaUrl, type } = item;

    if (type === 'image') {
      return (
        <TouchableOpacity onPress={() => handleMediaPress('image')}>
          <Image source={{ uri: mediaUrl }} style={styles.mediaImage} resizeMode="cover" />
        </TouchableOpacity>
      );
    }

    if (type === 'video') {
      return (
        <TouchableOpacity onPress={() => handleMediaPress('video')}>
          <Video
            source={{ uri: mediaUrl }}
            style={styles.mediaVideo}
            useNativeControls
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    return <Text>Unsupported media type</Text>;
  };

  const renderFullScreenMedia = () => {
    if (mediaType === 'image') {
      return (
        <Image source={{ uri: item.mediaUrl }} style={styles.fullScreenImage} resizeMode="contain" />
      );
    } else if (mediaType === 'video') {
      return (
        <Video
          source={{ uri: item.mediaUrl }}
          style={styles.fullScreenVideo}
          useNativeControls
          isLooping
          resizeMode="contain"
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.feedItem}>
      {/* Normal Feed Item Display */}
      <View style={styles.feedHeader}>
        <View style={styles.feedUserDetails}>
          <Image source={{ uri: userProfile.profileImage }} style={styles.feedProfileImage} />
          <Text style={styles.feedUsername}>{userProfile.username}</Text>
        </View>
        <Text style={styles.feedTime}>
          {item.date && item.date.toDate ? (
            dayjs().diff(item.date.toDate(), 'hour') > 48
              ? dayjs(item.date.toDate()).format('MMM D, YYYY')
              : dayjs(item.date.toDate()).fromNow()
          ) : (
            'No date available'
          )}
        </Text>
      </View>

      <Text style={styles.feedCaption}>{item.caption}</Text>

      <View style={styles.feedMedia}>{renderMediaContent()}</View>

      <View style={styles.feedReactions}>
        <TouchableOpacity onPress={handleLike} style={styles.reactionButton}>
          <Ionicons name={hasLiked ? 'heart' : 'heart-outline'} size={24} color={hasLiked ? 'red' : 'white'} />
          <Text style={styles.reactionCount}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCommentNavigate} style={styles.reactionButton}>
          <Ionicons name="chatbubble" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleMediaPress(item.type)} style={styles.reactionButton}>
          <Ionicons name="eye-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Full-Screen Modal */}
      <Modal visible={isFullScreen} transparent={true} onRequestClose={() => setIsFullScreen(false)}>
        <View style={styles.fullScreenModal}>
          <TouchableOpacity onPress={() => setIsFullScreen(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {renderFullScreenMedia()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  feedItem: {
    backgroundColor: '#1E2742',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  feedUsername: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  feedTime: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  feedCaption: {
    color: '#ECECEC',
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  feedMedia: {
    marginBottom: 15,
  },
  mediaImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  mediaVideo: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  feedReactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionCount: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 6,
  },
  // Full-Screen Modal Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  fullScreenVideo: {
    width: '100%',
    height: '80%',
  },
});

export default FeedItem;
