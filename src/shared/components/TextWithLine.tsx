import React from "react";
import { ViewStyle } from "react-native";
import { View, Text } from "../ui"; // custom UI
import { useTheme } from "../theme/useTheme";

interface TextWithLineProps {
    text?: string;
    style?: ViewStyle;
}

const TextWithLine = ({ text, style }: TextWithLineProps) => {
    const theme = useTheme();

    return (
        <View style={[{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10
        }, style]}>
            {/* The Left Line */}
            <View style={{
                flex: 1,
                height: 1,
                backgroundColor: theme.border // Uses dynamic border color
            }} />

            {/* The Text Middle */}
            {text && (
                <Text style={{
                    marginHorizontal: 12,
                    color: theme.textDim, // Uses muted text color
                    fontSize: 14,
                    fontWeight: '500'
                }}>
                    {text}
                </Text>
            )}

            {/* The Right Line */}
            <View style={{
                flex: 1,
                height: 1,
                backgroundColor: theme.border
            }} />
        </View>
    );
};

export default React.memo(TextWithLine);