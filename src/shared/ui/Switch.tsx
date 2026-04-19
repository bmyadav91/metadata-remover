import React from 'react';
import { Switch as RNSwitch, SwitchProps } from 'react-native';
import { useTheme } from '../theme/useTheme';

type Props = SwitchProps & {
    disabled?: boolean;
};

export function AppSwitch({ disabled, ...props }: Props) {
    const theme = useTheme();

    return (
        <RNSwitch
            {...props}
            disabled={disabled}
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor={
                disabled
                    ? '#ccc'
                    : props.value
                        ? theme.primary
                        : '#f4f3f4'
            }
            ios_backgroundColor={theme.border || '#767577'}
        />
    );
}