import React from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';
import { useTheme } from '../theme/useTheme';

export function TextInput({ style, placeholderTextColor, ...props }: TextInputProps) {
    const theme = useTheme();

    return (
        <RNTextInput
            {...props}
            selectionColor={theme.primary} 
            placeholderTextColor={placeholderTextColor || theme.textDim}
            style={[
                { 
                  color: theme.text, 
                  backgroundColor: theme.background,
                  paddingVertical: 13,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  borderColor: theme.border,
                  borderWidth: 1
                }, 
                style
            ]}
        />
    );
}