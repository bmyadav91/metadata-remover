import React from 'react';
import { View as RNView, ViewProps } from 'react-native';
import { useTheme } from '@/shared/theme/useTheme';

export function View({ style, ...props }: ViewProps) {
    const theme = useTheme();

    return (
        <RNView
            {...props}
            style={[{ backgroundColor: theme.background }, style]}
        />
    );
}