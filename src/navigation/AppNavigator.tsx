import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { AuthProvider, useAuthContext } from '../context/AuthContext';
import { AuthLoading } from '../components/AuthLoading';
import {
  HomeScreen,
  SearchScreen,
  FavoritesScreen,
  AuthScreen,
  CreatePostScreen,
  EditPostScreen,
  PostDetailScreen,
} from '../screens';
import { ProfileScreen } from '../screens/ProfileScreenSimple';

// Contexto do teclado inline
interface KeyboardContextType {
  isKeyboardVisible: boolean;
  setIsKeyboardVisible: (visible: boolean) => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export const KeyboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  return (
    <KeyboardContext.Provider value={{ isKeyboardVisible, setIsKeyboardVisible }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = (): KeyboardContextType => {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error('useKeyboard deve ser usado dentro de um KeyboardProvider');
  }
  return context;
};

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

// Componente wrapper para PostDetailScreen
const PostDetailScreenWrapper = ({ navigation, route }: any) => {
  return <PostDetailScreen navigation={navigation} route={route} />;
};

// Componente wrapper para ProfileScreen
const ProfileScreenWrapper = ({ navigation, route }: any) => {
  return <ProfileScreen navigation={navigation} route={route} />;
};

// Stack Navigator principal
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.text,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
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
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 250,
            },
          },
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreatePost" 
        component={CreatePostScreen}
        options={{ 
          headerShown: false, // Desabilitar header padrão para usar o header customizado
        }}
      />
      <Stack.Screen 
        name="EditPost" 
        component={EditPostScreen}
        options={{ 
          headerShown: false, // Desabilitar header padrão para usar o header customizado
        }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreenWrapper}
        options={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            };
          },
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 300,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 250,
              },
            },
          },
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreenWrapper}
        options={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            };
          },
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 300,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 250,
              },
            },
          },
        }}
      />
    </Stack.Navigator>
  );
};

// Navegação principal
const AppNavigatorContent = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <AuthLoading text="Verificando autenticação..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export const AppNavigator = () => {
  return (
    <AuthProvider>
      <AppNavigatorContent />
    </AuthProvider>
  );
};
