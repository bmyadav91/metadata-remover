import { StyleSheet, TextProps } from "react-native";
import { Text } from "@/shared/ui";

export const ScreenHeading = ({ style, children, ...props }: TextProps) => {
    return (
        <Text {...props} style={[styles.screenHeading, style]}>
            {children}
        </Text>
    );
};





const styles = StyleSheet.create({
    screenHeading: {
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: .5,
        padding: 5,
        marginBottom: 10,
    },

});
