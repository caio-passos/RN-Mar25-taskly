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

    const { colors, darkMode } = useContext(AppContext)!;
    const styles = StyleSheet.create({
        buttonFilled: {
            backgroundColor: colors.Primary,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center'
        },
        buttonTextCriarTarefa: {
            textAlign: 'center',
            fontWeight: '600',
            includeFontPadding:false,
            lineHeight: 20
        },
    });


    return (
        <Pressable onPress={onPress} style={[style, styles.buttonFilled]}>
            <Text style={[textStyle, styles.buttonTextCriarTarefa]}>
                {textProps}
            </Text>
        </Pressable>
    );
}

export default LongPressable;