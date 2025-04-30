import React, { useContext } from "react";
import { StyleSheet, Text, Pressable} from "react-native";
import { AppContext } from "../App";

interface LongPressableProps {
    textProps: string;
    onPress: () => void;
}

function LongPressable({ textProps, onPress}: LongPressableProps) {

    const colors = useContext(AppContext);
    const styles = StyleSheet.create({
        buttonFilled: {
            backgroundColor: colors.Primary,
            borderRadius: 8,
            width: 329,
            height: 47,
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 25,
        },
        buttonTextCriarTarefa: {
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: '600',
        }
    })


    return (
        <Pressable onPress={onPress} style={styles.buttonFilled}>
            <Text style={styles.buttonTextCriarTarefa}>
                {textProps}
            </Text>
        </Pressable>
    )
}

export default LongPressable;