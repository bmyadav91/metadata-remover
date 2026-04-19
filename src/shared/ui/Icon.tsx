import React from 'react';
import { useTheme } from '../theme/useTheme';

import Icon from '@react-native-vector-icons/material-icons';
import type { MaterialIconsIconName } from '@react-native-vector-icons/material-icons';



interface AppIconProps {
    name: MaterialIconsIconName;
    size?: number;
    color?: string;
}

export function AppIcon({ name, size = 24, color }: AppIconProps) {
    const theme = useTheme();

    return (
        <Icon
            name={name}
            size={size}
            color={color || theme.text} // Defaults to theme color
        />
    );
}