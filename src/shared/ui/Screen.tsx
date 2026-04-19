import React from 'react';
import { ViewProps } from 'react-native';
import { View } from './View';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "@/shared/theme/useTheme"; 

export function Screen({ style, ...props }: ViewProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme?.background }}>
      <View 
        {...props} 
        style={[{ flex: 1, backgroundColor: theme?.background }, style]} 
      />
    </SafeAreaView>
  );
}