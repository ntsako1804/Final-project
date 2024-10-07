import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';

const ArticleScreen = ({ route }) => {
    const { article } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {article.thumbnail && <Image source={{ uri: article.thumbnail }} style={styles.thumbnail} />}
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.excerpt}>{article.excerpt}</Text>
            <Text style={styles.date}>Published on: {new Date(article.date).toDateString()}</Text>
            {article.publisher && (
                <View style={styles.publisherContainer}>
                    <Text style={styles.publisherText}>Publisher: {article.publisher.name}</Text>
                    <TouchableOpacity
                        style={styles.publisherButton}
                        onPress={() => Linking.openURL(article.publisher.url)}
                    >
                        <Text style={styles.publisherButtonText}>Visit Publisher</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#101629', // Dark background
    },
    thumbnail: {
        width: '100%',
        height: 250, // Larger image size
        borderRadius: 10,
        marginBottom: 20,
        marginTop:30,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#FFF', // White text
        marginBottom: 15,
    },
    excerpt: {
        fontSize: 16,
        color: '#B0C4DE', // Light color text for contrast
        marginBottom: 15,
    },
    date: {
        fontSize: 14,
        color: '#B0C4DE',
        marginBottom: 20,
    },
    publisherContainer: {
        marginTop: 20,
        backgroundColor: '#1E2742', // Slightly lighter background for contrast
        padding: 15,
        borderRadius: 10,
    },
    publisherText: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 10,
    },
    publisherButton: {
        backgroundColor: '#083061', // Button color from other screens
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    publisherButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ArticleScreen;
