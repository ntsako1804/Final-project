import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { fetchArticles } from './apiService'; // Ensure this fetches articles properly
import { Ionicons } from '@expo/vector-icons'; // Expo icon support
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebaseConfig'; // Firebase setup
import FeedItem from '../FeedItem'; // Feed component for media posts
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Navigation hook

const HomeScreen = () => {
  const [articles, setArticles] = useState([]); // All articles
  const [filteredArticles, setFilteredArticles] = useState([]); // Searched articles
  const [loading, setLoading] = useState(true); // Loading state for articles
  const [searchQuery, setSearchQuery] = useState('Fitness'); // Initial query for search
  const [selectedTab, setSelectedTab] = useState('Articles'); // 'Articles' or 'People' tabs
  const [friendsMedia, setFriendsMedia] = useState([]); // Friends' media posts
  const [loadingMedia, setLoadingMedia] = useState(false); // Loading state for media posts

  const navigation = useNavigation(); // Navigation hook
  const currentUser = FIREBASE_AUTH.currentUser; // Current user from Firebase

  // Fetch articles based on search query
  const fetchAndFilterArticles = async (query) => {
    setLoading(true);
    try {
      const articlesData = await fetchArticles(query); // Fetch articles with the current query
      const filtered = articlesData.filter(article =>
        article.title.toLowerCase().includes('gym') ||
        article.title.toLowerCase().includes('fitness') ||
        article.title.toLowerCase().includes('health')
      );
      setArticles(filtered);
      setFilteredArticles(filtered);
    } catch (error) {
      console.error("Error fetching filtered articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Fetch default articles automatically on app entry
  useEffect(() => {
    fetchAndFilterArticles(searchQuery); // Fetch articles on mount
  }, []); // Empty dependency array to run only on component mount

  // 2. Fetch friends' media posts when 'People' tab is selected
  useEffect(() => {
    const fetchFriendsMedia = async () => {
      if (!currentUser) {
        console.log('User is not authenticated');
        return;
      }
      setLoadingMedia(true);
      try {
        const mediaQuery = query(
          collection(FIREBASE_DB, 'media'),
          where('userId', '!=', currentUser.uid)
        );
        const querySnapshot = await getDocs(mediaQuery);
        const mediaData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId) {
            mediaData.push({ id: doc.id, ...data });
          }
        });
        setFriendsMedia(mediaData);
      } catch (error) {
        console.error('Error fetching friends media:', error);
      } finally {
        setLoadingMedia(false);
      }
    };

    if (selectedTab === 'People') {
      fetchFriendsMedia();
    }
  }, [selectedTab, currentUser]);

  // Handle search button press to fetch new articles based on the search query
  const handleSearch = () => {
    fetchAndFilterArticles(searchQuery);
  };

  // Render individual article item
  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ArticleScreen', { article: item })}
    >
      {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.excerpt}>{item.excerpt}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render feed item for the "People" tab
  const renderFeedItem = ({ item }) => (
    <FeedItem item={item} /> // Use FeedItem to display media
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Articles' && styles.activeTab]}
          onPress={() => setSelectedTab('Articles')}
        >
          <Text style={[styles.tabText, selectedTab === 'Articles' && styles.activeTabText]}>
            Articles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'People' && styles.activeTab]}
          onPress={() => setSelectedTab('People')}
        >
          <Text style={[styles.tabText, selectedTab === 'People' && styles.activeTabText]}>
            People
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'Articles' && (
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search articles..."
              placeholderTextColor="#B0C4DE"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="search" size={24} color="#fff" style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <FlatList
              data={filteredArticles}
              renderItem={renderArticleItem}
              keyExtractor={(item) => item.url}
              contentContainerStyle={styles.articleList}
            />
          )}
        </View>
      )}

      {selectedTab === 'People' && (
        <View>
          {loadingMedia ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <FlatList
              data={friendsMedia}
              renderItem={renderFeedItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.articleList}
            />
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101629',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#B0C4DE',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2742',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#FFF',
  },
  searchIcon: {
    paddingLeft: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#1E2742',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 5,
  },
  excerpt: {
    color: '#B0C4DE',
  },
  articleList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B636E',
  },
});

export default HomeScreen;
