import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export const LoaderMore = ({ small = false }) => (
    <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <ActivityIndicator size={small ? "small" : "large"} color="blue" />
    </View>
);