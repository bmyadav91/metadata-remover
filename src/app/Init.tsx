import { StyleSheet } from "react-native";
import { Screen, Text } from "@/shared/ui";

export const InitScreen = () => {
    return (
        <Screen style={styles.container}>
            <Text>Loading</Text>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignContent: "center",
        padding: 20,
        backgroundColor: 'red'
    }
});