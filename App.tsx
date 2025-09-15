import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { KeyboardProvider } from './src/navigation/AppNavigator';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <FavoritesProvider>
          <KeyboardProvider>
            <StatusBar style="dark" backgroundColor={COLORS.surface} />
            <AppNavigator />
          </KeyboardProvider>
        </FavoritesProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}