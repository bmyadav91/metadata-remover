import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';

export function ScrollScreen({ contentContainerStyle, ...props }: ScrollViewProps) {
  const colors  = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        {...props}
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          { paddingBottom: 20 },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}