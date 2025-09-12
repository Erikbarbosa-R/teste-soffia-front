import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import { COLORS } from '../constants';
import {
  HomeScreen,
  SearchScreen,
  FavoritesScreen,
  AuthScreen,
  CreatePostScreen,
  PostDetailScreen,
} from '../screens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator para autenticação
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Auth" component={AuthScreen} />
  </Stack.Navigator>
);

// Tab Navigator principal
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Início') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Favoritos') {
          iconName = focused ? 'star' : 'star-outline';
        } else {
          iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E5E5EA',
        height: 80,
        paddingBottom: 20,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Início" component={HomeScreen} />
    <Tab.Screen name="Favoritos" component={FavoritesScreen} />
  </Tab.Navigator>
);

// Stack Navigator principal
const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.surface,
        borderBottomColor: COLORS.border,
      },
      headerTintColor: COLORS.text,
    }}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabs} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="CreatePost" 
      component={CreatePostScreen}
      options={{ title: 'Criar Post' }}
    />
    <Stack.Screen 
      name="PostDetail" 
      component={PostDetailScreen}
      options={{ title: 'Detalhes do Post' }}
    />
  </Stack.Navigator>
);

// Navegação principal
export const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
