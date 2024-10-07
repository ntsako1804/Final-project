import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';

const PostDetailsScreen = ({ route }) => {
  const { post } = route.params;
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{post.username}</Text>
      <Text style={styles.caption}>{post.caption}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  username: { fontWeight: 'bold', fontSize: 18 },
  caption: { marginVertical: 10 },
  comment: { paddingVertical: 5 },
  commentInput: { borderColor: 'gray', borderWidth: 1, padding: 8, borderRadius: 5, marginTop: 10 }
});

export default PostDetailsScreen;
