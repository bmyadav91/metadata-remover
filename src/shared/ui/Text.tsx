import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '../theme/useTheme';

export function Text({ style, ...props }: TextProps) {
    const theme = useTheme();

    return (
        <RNText
            {...props}
            style={[{ color: theme.text, letterSpacing: .2 }, style]}
        />
    );
}