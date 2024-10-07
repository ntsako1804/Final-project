import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native'; // import useNavigation for back arrow
import { doc, getDoc, collection, addDoc, increment, query, updateDoc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebaseConfig';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import debounce from 'lodash/debounce';

dayjs.extend(relativeTime);

const CommentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); // for back arrow
  const { commentsData, mediaId } = route.params;
  const [comments, setComments] = useState(commentsData || []);
  const [newComment, setNewComment] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const commentsQuery = query(collection(FIREBASE_DB, 'mediaPosts', mediaId, 'comments'));
        const querySnapshot = await getDocs(commentsQuery);

        const commentsData = [];
        let commentCount = 0;
        for (const docSnap of querySnapshot.docs) {
          const comment = docSnap.data();
          comment.id = docSnap.id;

          if (comment.timestamp) {
            comment.timestamp = comment.timestamp.toDate();
          } else {
            comment.timestamp = new Date();
          }

          const repliesQuery = query(collection(FIREBASE_DB, 'mediaPosts', mediaId, 'comments', docSnap.id, 'replies'));
          const repliesSnap = await getDocs(repliesQuery);
          const replies = repliesSnap.docs.map((replyDoc) => {
            const reply = replyDoc.data();
            reply.timestamp = reply.timestamp ? reply.timestamp.toDate() : new Date();
            return { id: replyDoc.id, ...reply };
          });

          comment.replies = replies;
          commentsData.push(comment);

          commentCount += 1 + replies.length;
        }

        setComments(commentsData);
        setTotalComments(commentCount);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [mediaId]);

  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(FIREBASE_DB, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateTotalCommentsCount = async (mediaId, incrementValue) => {
    try {
      const mediaDocRef = doc(FIREBASE_DB, 'mediaPosts', mediaId);
      const mediaDocSnap = await getDoc(mediaDocRef);

      if (mediaDocSnap.exists()) {
        await updateDoc(mediaDocRef, {
          totalCommentsCount: increment(incrementValue),
        });
      } else {
        await setDoc(mediaDocRef, { totalCommentsCount: incrementValue });
      }

      setTotalComments((prevCount) => prevCount + incrementValue);
    } catch (error) {
      console.error('Error updating total comments count: ', error);
    }
  };

  const debouncedAddComment = debounce(async () => {
    if (newComment.trim()) {
      setIsPostingComment(true);
      const user = FIREBASE_AUTH.currentUser;
      const userProfile = await fetchUserProfile(user.uid);

      const newCommentObj = {
        uid: user.uid,
        comment: newComment,
        likes: [],
        replies: [],
        timestamp: new Date(),
        username: userProfile?.name || 'Anonymous',
        userImage: userProfile?.profileImage || 'https://example.com/default-profile.jpg',
      };

      try {
        const mediaDocRef = doc(FIREBASE_DB, 'mediaPosts', route.params.mediaId);
        const commentsCollectionRef = collection(mediaDocRef, 'comments');
        const commentDocRef = await addDoc(commentsCollectionRef, newCommentObj);

        await updateTotalCommentsCount(route.params.mediaId, 1);

        setComments([{ id: commentDocRef.id, ...newCommentObj, username: 'Loading...', userImage: 'https://example.com/default-profile.jpg' }, ...comments]);
        setNewComment('');

        const userProfile = await fetchUserProfile(user.uid);
        if (userProfile) {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentDocRef.id
                ? { ...comment, username: userProfile.name || 'Anonymous', userImage: userProfile.profileImage || 'https://example.com/default-profile.jpg' }
                : comment
            )
          );
        }
      } catch (error) {
        console.error('Error adding comment: ', error);
      } finally {
        setIsPostingComment(false);
      }
    }
  }, 500);

  const handleAddComment = () => debouncedAddComment();

  const handleToggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleAddReply = async (commentId) => {
    if (replyText[commentId]?.trim()) {
      setIsPostingReply(true);
      const user = FIREBASE_AUTH.currentUser;
      const userProfile = await fetchUserProfile(user.uid);

      const newReplyObj = {
        uid: user.uid,
        comment: replyText[commentId],
        likes: [],
        timestamp: new Date(),
        username: userProfile?.name || 'Anonymous',
        userImage: userProfile?.profileImage || 'https://example.com/default-profile.jpg',
      };

      try {
        const mediaDocRef = doc(FIREBASE_DB, 'mediaPosts', route.params.mediaId);
        const commentDocRef = doc(mediaDocRef, 'comments', commentId);
        const repliesCollectionRef = collection(commentDocRef, 'replies');
        const replyDocRef = await addDoc(repliesCollectionRef, newReplyObj);

        await updateTotalCommentsCount(route.params.mediaId, 1);

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    { id: replyDocRef.id, ...newReplyObj, username: 'Loading...', userImage: 'https://example.com/default-profile.jpg' },
                  ],
                }
              : comment
          )
        );
        setReplyText((prev) => ({ ...prev, [commentId]: '' }));

        const userProfile = await fetchUserProfile(user.uid);
        if (userProfile) {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                      reply.id === replyDocRef.id
                        ? {
                            ...reply,
                            username: userProfile.name || 'Anonymous',
                            userImage: userProfile.profileImage || 'https://example.com/default-profile.jpg',
                          }
                        : reply
                    ),
                  }
                : comment
            )
          );
        }
      } catch (error) {
        console.error('Error adding reply: ', error);
      } finally {
        setIsPostingReply(false);
      }
    }
  };

  const handleLike = async (commentId, replyId = null) => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      const commentIndex = comments.findIndex((comment) => comment.id === commentId);
      if (commentIndex === -1) return;

      let updatedComments = [...comments];
      if (replyId) {
        const replyIndex = updatedComments[commentIndex].replies.findIndex((reply) => reply.id === replyId);
        if (replyIndex === -1) return;

        const replyLikes = updatedComments[commentIndex].replies[replyIndex].likes || [];
        const likedIndex = replyLikes.indexOf(user.uid);
        if (likedIndex !== -1) {
          replyLikes.splice(likedIndex, 1); // Remove like
        } else {
          replyLikes.push(user.uid); // Add like
        }
        updatedComments[commentIndex].replies[replyIndex].likes = replyLikes;
      } else {
        const commentLikes = updatedComments[commentIndex].likes || [];
        const likedIndex = commentLikes.indexOf(user.uid);
        if (likedIndex !== -1) {
          commentLikes.splice(likedIndex, 1); // Remove like
        } else {
          commentLikes.push(user.uid); // Add like
        }
        updatedComments[commentIndex].likes = commentLikes;
      }
      setComments(updatedComments);
    } catch (error) {
      console.error('Error liking comment: ', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back arrow */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Comments FlatList */}
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Image source={{ uri: item.userImage }} style={styles.userImage} />
            <View style={styles.commentContent}>
              <Text style={styles.commentUsername}>{item.username}</Text>
              <Text style={styles.commentText}>{item.comment}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity onPress={() => handleLike(item.id)}>
                  <Ionicons name={item.likes.includes(FIREBASE_AUTH.currentUser.uid) ? 'heart' : 'heart-outline'} size={20} color="red" />
                </TouchableOpacity>
                <Text style={styles.commentTimestamp}>{dayjs(item.timestamp).fromNow()}</Text>
                <TouchableOpacity onPress={() => handleToggleReplies(item.id)}>
                  <Text style={styles.replyButtonText}>
                    {showReplies[item.id] ? 'Hide Replies' : `Show Replies (${item.replies.length})`}
                  </Text>
                </TouchableOpacity>
              </View>
              {showReplies[item.id] && (
                <View style={styles.repliesContainer}>
                  {item.replies.map((reply) => (
                    <View key={reply.id} style={styles.replyContainer}>
                      <Image source={{ uri: reply.userImage }} style={styles.replyUserImage} />
                      <View style={styles.replyContent}>
                        <Text style={styles.replyUsername}>{reply.username}</Text>
                        <Text style={styles.replyText}>{reply.comment}</Text>
                        <View style={styles.replyActions}>
                          <TouchableOpacity onPress={() => handleLike(item.id, reply.id)}>
                            <Ionicons name={reply.likes.includes(FIREBASE_AUTH.currentUser.uid) ? 'heart' : 'heart-outline'} size={16} color="red" />
                          </TouchableOpacity>
                          <Text style={styles.replyTimestamp}>{dayjs(reply.timestamp).fromNow()}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Write a reply..."
                    placeholderTextColor="#777"
                    value={replyText[item.id] || ''}
                    onChangeText={(text) => setReplyText((prev) => ({ ...prev, [item.id]: text }))}
                    onSubmitEditing={() => handleAddReply(item.id)}
                  />
                </View>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={styles.commentsCountContainer}>
            <Text style={styles.commentsCountText}>{totalComments} Comments</Text>
          </View>
        )}
        contentContainerStyle={styles.commentsList}
      />

      {/* New comment input */}
      <View style={styles.newCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          placeholderTextColor="#777"
          value={newComment}
          onChangeText={setNewComment}
          onSubmitEditing={handleAddComment}
        />
        <TouchableOpacity onPress={handleAddComment} disabled={isPostingComment}>
          <Ionicons name="send" size={24} color={isPostingComment ? 'gray' : 'white'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101629', // Black background
  },
  backArrow: {
    padding: 10,
    position: 'absolute',
    top: 40, // Adjust the top position as necessary
    left: 20,
    zIndex: 10,
  },
  commentsList: {
    paddingTop: 80, // This pushes the comment section down to create space for the back arrow
  },
  commentContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  commentText: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  replyButtonText: {
    color: 'white',
    marginLeft: 15,
  },
  commentTimestamp: {
    color: 'gray',
    marginLeft: 15,
  },
  repliesContainer: {
    marginTop: 10,
  },
  replyContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    marginLeft: 50,
  },
  replyUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  replyContent: {
    flex: 1,
    marginLeft: 10,
  },
  replyUsername: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  replyText: {
    fontSize: 12,
    color: 'white',
    marginTop: 3,
  },
  replyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  replyTimestamp: {
    color: 'gray',
    marginLeft: 15,
  },
  replyInput: {
    marginTop: 5,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    color: 'white',
  },
  newCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#222',
    borderTopColor: '#333',
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    color: 'white',
    backgroundColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  commentsCountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  commentsCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CommentScreen;
