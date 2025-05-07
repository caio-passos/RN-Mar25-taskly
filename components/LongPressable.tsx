import React, { useContext } from "react";
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle} from "react-native";
import { AppContext } from "../App";

interface LongPressableProps {
    textProps: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

function LongPressable({ textProps, onPress, style, textStyle}: LongPressableProps) {

    const colors = useContext(AppContext);
    const styles = StyleSheet.create({
        buttonFilled: {
            backgroundColor: colors.Primary,
            borderRadius: 8,
            height: 42,
        },
        buttonTextCriarTarefa: {
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: '600',
        },
    });


    return (
        <Pressable onPress={onPress} style={[style, styles.buttonFilled]}>
            <Text style={styles.buttonTextCriarTarefa}>
                {textProps}
            </Text>
        </Pressable>
    );
}

export default LongPressable;