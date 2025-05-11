import React, { useContext } from "react";
import { StyleSheet, Text, Pressable} from "react-native";
import { AppContext } from "../App";

interface ShortPressableProps {
    textProps: string;
    onPress?: () => void;
}

function ShortPressable({ textProps, onPress}: ShortPressableProps) {

    const { colors, darkMode } = useContext(AppContext)!;
    const styles = StyleSheet.create({
        buttonFilled: {
            backgroundColor: colors.Primary,
            borderRadius: 8,
            width: 127,
            height: 27,
            justifyContent: 'center',
            alignSelf: 'center',
        },
        buttonTextCriarTarefa: {
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: '600',
        }
    })

    return (
        <Pressable style={styles.buttonFilled} onPress={onPress}>
            <Text style={styles.buttonTextCriarTarefa}>
                {textProps}
            </Text>
        </Pressable>
    )
}

export default ShortPressable;