import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
// Tipos para o contexto
interface AppContextState {
isOnline: boolean;
theme: 'light' | 'dark';
notifications: boolean;
language: 'pt' | 'en';
}
interface AppContextActions {
setOnline: (isOnline: boolean) => void;
toggleTheme: () => void;
toggleNotifications: () => void;
setLanguage: (language: 'pt' | 'en') => void;
}
type AppContextType = AppContextState & AppContextActions;
// Estado inicial
const initialState: AppContextState = {
isOnline: true,
theme: 'light',
notifications: true,
language: 'pt',
};
// Actions
type AppAction =
| { type: 'SET_ONLINE'; payload: boolean }
| { type: 'TOGGLE_THEME' }
| { type: 'TOGGLE_NOTIFICATIONS' }
| { type: 'SET_LANGUAGE'; payload: 'pt' | 'en' }
| { type: 'LOAD_SETTINGS'; payload: Partial<AppContextState> };
// Reducer
const appReducer = (state: AppContextState, action: AppAction): AppContextState => {
switch (action.type) {
case 'SET_ONLINE':
return { ...state, isOnline: action.payload };
case 'TOGGLE_THEME':
return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
case 'TOGGLE_NOTIFICATIONS':
return { ...state, notifications: !state.notifications };
case 'SET_LANGUAGE':
return { ...state, language: action.payload };
case 'LOAD_SETTINGS':
return { ...state, ...action.payload };
default:
return state;
}
};
// Context
const AppContext = createContext<AppContextType | undefined>(undefined);
// Provider
interface AppProviderProps {
children: ReactNode;
}
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
const [state, dispatch] = useReducer(appReducer, initialState);
// Carregar configurações salvas
useEffect(() => {
const loadSettings = async () => {
try {
const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
if (savedSettings) {
const settings = JSON.parse(savedSettings);
dispatch({ type: 'LOAD_SETTINGS', payload: settings });
}
} catch (error) {
console.error('Erro ao carregar configurações:', error);
}
};
loadSettings();
}, []);
// Salvar configurações quando mudarem
useEffect(() => {
const saveSettings = async () => {
try {
await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state));
} catch (error) {
console.error('Erro ao salvar configurações:', error);
}
};
saveSettings();
}, [state]);
// Actions
const setOnline = (isOnline: boolean) => {
dispatch({ type: 'SET_ONLINE', payload: isOnline });
};
const toggleTheme = () => {
dispatch({ type: 'TOGGLE_THEME' });
};
const toggleNotifications = () => {
dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
};
const setLanguage = (language: 'pt' | 'en') => {
dispatch({ type: 'SET_LANGUAGE', payload: language });
};
const value: AppContextType = {
...state,
setOnline,
toggleTheme,
toggleNotifications,
setLanguage,
};
return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
// Hook personalizado
export const useApp = (): AppContextType => {
const context = useContext(AppContext);
if (context === undefined) {
throw new Error('useApp deve ser usado dentro de um AppProvider');
}
return context;
};
