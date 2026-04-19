import React, { ReactNode } from 'react';
import {
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle,
    View
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/useTheme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    icon?: ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    title,
    variant = 'primary',
    loading = false,
    icon,
    disabled,
    style,
    textStyle,
    ...props
}: ButtonProps) {
    const theme = useTheme();

    const isOutline = variant === 'outline';
    const isSecondary = variant === 'secondary';

    const getBackgroundColor = () => {
        if (isOutline) return theme.background;
        if (isSecondary) return theme.border;
        return theme.primary;
    };

    const getTextColor = () => {
        if (isOutline || isSecondary) return theme.text;
        return '#FFFFFF';
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled || loading}
            style={[
                styles.base,
                {
                    backgroundColor: getBackgroundColor(),
                    borderWidth: isOutline ? 1 : 0,
                    borderColor: theme.border,
                    elevation: isOutline ? 1 : 0,
                },
                (disabled || loading) && { opacity: 0.5 },
                style
            ]}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <View style={styles.content}>
                    {icon && (
                        <View style={styles.iconContainer}>
                            {React.isValidElement(icon)
                                ? React.cloneElement(icon as React.ReactElement<any>, {
                                    color: (icon.props as any).color || getTextColor(),
                                    size: (icon.props as any).size || 20
                                })
                                : icon}
                        </View>
                    )}
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
    },
});