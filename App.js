import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { FIREBASE_AUTH } from './firebaseConfig';
import * as SplashScreen from 'expo-splash-screen'; 

// Import screen components
import SignUpScreen from './components/SignUpScreen';
import LoginScreen from './components/LoginScreen';
import FirstScreen from './components/FirstScreen';
import EmailVerification from './components/EmailVerification';
import VerifiedScreen from './components/VerifiedScreen';
import PasswordResetScreen from './components/PasswordResetScreen';
import SuccessScreen from './components/SuccessScreen';
import OnBoardingScreen1 from './components/OnboardingScreen1';
import OnBoardingScreen2 from './components/OnboardingScreen2';
import OnBoardingScreen3 from './components/OnboardingScreen3';
import OnBoardingScreen4 from './components/OnboardingScreen4';
import SettingsScreen from './components/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './HomeMain/HomeScreen';
import ArticleScreen from './HomeMain/ArticleScreen';
import PeopleScreen from './HomeMain/PeopleScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import MealPlan from './screens/MealPlan';
import ScheduleScreen from './screens/ScheduleScreen';
import ChatNavigator from './ChatScreens/ChatNavigator'; // Chat stack navigator
import Chat from './ChatScreens/Chat'; // Chat stack navigator
import MessageScreen from './screens/ChatScreen'; // Chat stack navigator
import ExploreScreen from './components/ExploreScreen';

import Inbox from './components/MessagesScreen';

import ExercisesScreen from './components/ExercisesScreen';
import ExerciseDetailScreen from './components/ExerciseDetailScreen';
import WorkoutsScreen from './components/WorkoutsScreen';
import WorkoutPlanScreen from './components/WorkoutPlanScreen';
import GainMuscleScreen from './components/GainMuscleScreen';
import WeightExerciseScreen from './components/WeightExerciseScreen';

import PostDetailsScreen from './components/PostDetailsScreen';

import MusicAndSoundScreen from './components/MusicAndSoundScreen'; 
//import { SoundSettingsScreen } from './MusicAndSoundScreen'; 
import ExerciseInProgressScreen from './components/ExerciseInProgressScreen';
import WorkoutCompletedScreen from './components/WorkoutCompletedScreen';
import NotificationScreen from './components/NotificationScreen';

import RecipeDetail from './components/RecipeDetail';
import RecipeSearch from './components/RecipeSearch';
import RecipeSearchDetails from './components/RecipeSearchDetails';

import CommentScreen from './components/CommentScreen';
import StepCounter from './StepCounter';

import EditProfileScreen from './components/EditProfileScreen';
import AccountSettingsScreen from './components/AccountSettingsScreen';
import NotificationSettingsScreen from './components/NotificationSettingsScreen';
import LegalAndAboutScreen from './components/LegalAndAboutScreen';
import SupportFeedbackScreen from './components/SupportFeedbackScreen'; 


// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define the main tab navigator
function MyTabs({ user }) {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#101629', // Set the background color of the tab bar
      },
      headerStyle: {
        backgroundColor: '#101629', // Set the background color of the header
      },
      headerTitleStyle: {
        fontWeight: 50, // Optionally, style the header title font
        color: '#FFF', 

      },
      tabBarInactiveTintColor: '#d3d3d3', // Set inactive tab icon color
    }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="dumbbell" size={24} color={color}/>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={MessageScreen}
        initialParams={{ user_id: user?.uid }} // Pass user_id to ChatNavigator
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-sharp" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={MealPlan}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant-menu" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StepCounter"
        component={StepCounter}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shoe-prints" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Define the main app component with the stack navigator
const MainApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('First'); // Default to First screen
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          FIREBASE_AUTH.onAuthStateChanged((authUser) => {
            if (authUser) {
              setUser(authUser);
              setInitialRoute('MainTabs');
            } else {
              setInitialRoute('First');
            }
          });
        } else {
          setInitialRoute('First');
        }
      } catch (error) {
        console.error("Error checking user login status:", error);
        setInitialRoute('First');
      } finally {
        setIsLoading(false);
      }
    };
  
    checkUser();
  }, []);
  


  useEffect(() => {
    // Prevent the splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();

    const checkUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          FIREBASE_AUTH.onAuthStateChanged((authUser) => {
            if (authUser) {
              setUser(authUser);
              setInitialRoute('MainTabs');
            } else {
              setInitialRoute('First');
            }
          });
        } else {
          setInitialRoute('First');
        }
      } catch (error) {
        console.error("Error checking user login status:", error);
        setInitialRoute('First');
      } finally {
        setIsLoading(false);
        // Hide the splash screen after initialization is done
        SplashScreen.hideAsync();
      }
    };

    checkUser();
  }, []);

  if (isLoading) {
    return null; // You can return a loading screen if needed
  }

  console.log("Initial Route:", initialRoute); // Debugging initial route
  

  if (isLoading) {
    // Show a loading screen or spinner while checking user status
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}
      >
        <Stack.Screen name="First" component={FirstScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerificationScreen" component={EmailVerification} options={{ headerShown: false }} />
        <Stack.Screen name="Verified" component={VerifiedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FitnessOnboarding" component={OnBoardingScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="FitnessGoalScreen" component={OnBoardingScreen2} options={{ headerShown: false }} />
        <Stack.Screen name="HealthInformationScreen" component={OnBoardingScreen3} options={{ headerShown: false }} />
        <Stack.Screen name="OptionalDataScreen" component={OnBoardingScreen4} options={{ headerShown: false }} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{ headerShown: false }} />
        
        <Stack.Screen name="MainTabs">
          {() => <MyTabs user={user} />} 
        </Stack.Screen>
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TaskAppScreen" component={WorkoutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ArticleScreen" component={ArticleScreen} options={{ headerShown: false }} />
        <Stack.Screen name = "PeopleScreen" component={PeopleScreen} options ={{headerShown: false}}/>
        

        <Stack.Screen name="Exercises" component={ExercisesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="WorkoutsScreen" component={WorkoutsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} options={{ headerShown: false }}/> 
        <Stack.Screen name="GainMuscle" component={GainMuscleScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="WeightExercise" component={WeightExerciseScreen} options={{ headerShown: false }}/>
        
        <Stack.Screen name="ChatScreen" component={MessageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />

        <Stack.Screen name="Inbox" component={Inbox} options={{ headerShown: true, title: 'Messages' }} />
        <Stack.Screen name="ExploreScreen" component={ExploreScreen} options={{ headerShown: true, title: 'Find Friends' }} />

        <Stack.Screen name="MusicAndSoundScreen" component={MusicAndSoundScreen} />
        <Stack.Screen name="ExerciseInProgress" component={ExerciseInProgressScreen} />
        <Stack.Screen name="WorkoutCompleted" component={WorkoutCompletedScreen} />

        <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: true, title: 'Notifications' }} />

        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
        <Stack.Screen name ="RecipeSearch" component = {RecipeSearch}/>
        <Stack.Screen name = "RecipeSearchDetails" component = {RecipeSearchDetails}/>

        <Stack.Screen name="PostDetailsScreen" component={PostDetailsScreen} />
        <Stack.Screen name = "CommentScreen" component={CommentScreen}/>

        <Stack.Screen name = "StepCounter" component={StepCounter}/>

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="LegalAndAbout" component={LegalAndAboutScreen} />

        <Stack.Screen name="SupportFeedback" component={SupportFeedbackScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Register the main app component
AppRegistry.registerComponent(appName, () => MainApp);

export default MainApp;
