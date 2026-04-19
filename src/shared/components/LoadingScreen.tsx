import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';


export const LoadingScreen = () => {

    return (
        <View style={styles.container}>
            <Text style={styles.BrandName}>GIGCORN</Text>
            <ActivityIndicator size="small" color="#fff" style={{ marginTop: 10 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    BrandName: {
        fontSize: 40,
        fontWeight: '500',
        color: '#fff',
        letterSpacing: 1,
    },
})