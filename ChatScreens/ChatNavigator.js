//ChatNavigator.js
import React, { useLayoutEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

import ExploreScreen from './Explore';
import MessageList from './MessageList'; // Ensure this is the correct path
import NotificationScreen from './Notification';
import Chat from './Chat'; // Import the Chat screen
import { FIREBASE_AUTH } from '../firebaseConfig';

const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();

function ChatNavigator({ route, navigation }) {
  const user = route.params.user_id;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={signOutNow}>
          <Text>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const signOutNow = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        console.error('Sign Out Error: ', error);
      });
  };

  return (
    <ChatStack.Navigator>
      <ChatStack.Screen 
        name="MessageList" 
        component={MessageList} 
        initialParams={{ user_id: user }} 
        options={{ headerShown: true, title: 'Messages' }} 
      />
      <ChatStack.Screen 
        name="Chat" 
        component={Chat} 
        options={{ headerShown: true, title: 'Chat' }} 
      />
      {/* Add more screens to the stack as needed */}
    </ChatStack.Navigator>
  );
}

export default function MyTabs({ route, navigation }) {
  const user = route.params.user_id;

  return (
    <Tab.Navigator
      initialRouteName="ExploreScreen"
      screenOptions={{
        tabBarActiveTintColor: '#FF6B76',
        tabBarStyle: {
          backgroundColor: '#373838',
          padding: 10,
        },
      }}
    >
      <Tab.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        initialParams={{ user_id: user }}
        options={{
          headerBackVisible: false,
          headerShown: false,
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="explore" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
        initialParams={{ user_id: user }}
        options={{
          headerBackVisible: false,
          headerShown: false,
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        initialParams={{ user_id: user }}
        options={{
          headerBackVisible: false,
          headerShown: false,
          tabBarLabel: 'Notification',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}