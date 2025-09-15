import React from 'react';
import { InputContainer, InputLabel, Input, ErrorText } from './styled';
interface CustomInputProps {
label: string;
placeholder: string;
value: string;
onChangeText: (text: string) => void;
onBlur?: () => void;
secureTextEntry?: boolean;
multiline?: boolean;
numberOfLines?: number;
error?: string;
keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}
export const CustomInput: React.FC<CustomInputProps> = ({
label,
placeholder,
value,
onChangeText,
onBlur,
secureTextEntry = false,
multiline = false,
numberOfLines = 1,
error,
keyboardType = 'default',
}) => {
return (
<InputContainer error={!!error}>
<InputLabel error={!!error}>{label}</InputLabel>
<Input
placeholder={placeholder}
value={value}
onChangeText={onChangeText}
onBlur={onBlur}
secureTextEntry={secureTextEntry}
multiline={multiline}
numberOfLines={numberOfLines}
error={!!error}
keyboardType={keyboardType}
placeholderTextColor="#8E8E93"
/>
{error && <ErrorText>{error}</ErrorText>}
</InputContainer>
);
};
