import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { Screen } from '../ui';
import { useTheme } from '../theme/useTheme';

type SkeletonProps = {
    count?: number;
    width?: number;
    height?: number;
    horizontal?: boolean;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export const Skeleton = ({ count = 5, width, height, horizontal }: SkeletonProps) => {
    const theme = useTheme();
    const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

    useEffect(() => {
        const shimmer = Animated.loop(
            Animated.timing(translateX, {
                toValue: SCREEN_WIDTH,
                duration: 1000,
                useNativeDriver: true,
            })
        );

        shimmer.start();

        return () => {
            shimmer.stop();
        };
    }, []);

    const renderShimmer = () => (
        <Animated.View
            style={[
                styles.shimmerOverlay,
                {
                    transform: [{ translateX }],
                },
            ]}
        />
    );

    const renderSkeletonItem = (index: number) => {
        return (
            <View
                key={`other-${index}`}
                style={[
                    styles.otherContainer,
                    width !== undefined ? { width } : {},
                    height !== undefined ? { height } : {},
                    { backgroundColor: theme.border }
                ]}
            >
                {renderShimmer()}
            </View>
        );
    };

    return (
        <Screen
            style={[
                styles.wrapper,
                horizontal ? styles.horizontalWrapper : styles.verticalWrapper,
            ]}
        >
            {Array.from({ length: count }).map((_, i) => renderSkeletonItem(i))}
        </Screen>
    );
};


const base = {
    backgroundColor: '#e5e5e5',
    overflow: 'hidden' as const,
};

const styles = StyleSheet.create({
    wrapper: {
        margin: 10,
        gap: 15,
    },
    verticalWrapper: {
        flexDirection: 'column',
        gap: 15,
    },
    horizontalWrapper: {
        flexDirection: 'row',
        gap: 15,
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#f5f5f5',
        opacity: 0.3,
    },

    otherContainer: {
        height: 80,
        borderRadius: 8,
        ...base,
    },
});
