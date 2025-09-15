import React, { createContext, useContext, useState, ReactNode } from 'react';
interface KeyboardContextType {
isKeyboardVisible: boolean;
setIsKeyboardVisible: (visible: boolean) => void;
}
const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);
interface KeyboardProviderProps {
children: ReactNode;
}
export const KeyboardProvider: React.FC<KeyboardProviderProps> = ({ children }) => {
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
