import React, { useContext } from "react";
import { StyleSheet, Text, Pressable, ViewStyle} from "react-native";
import { AppContext } from "../../App";
import type { TapGesture } from "react-native-gesture-handler";

interface LongNoFillPressableProps {
    textProps: string;
    onPress?: () => void;
    style?: ViewStyle;
    Tap?: TapGesture;
}

function LongNoFillPressable({ textProps, onPress, style, Tap}: LongNoFillPressableProps) {

    const { colors, darkMode } = useContext(AppContext)!;
    const styles = StyleSheet.create({
        buttonFilled: {
            borderRadius: 8,
            borderColor: colors.SecondaryBG,
            borderWidth: 2,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonTextCriarTarefa: {
            color: colors.Primary,
            textAlign: 'center',
            fontWeight: '600',
            includeFontPadding: false,
            fontSize: 16,
        },
    });

    return (
        <Pressable onPress={onPress} style={[styles.buttonFilled, style]}>
            <Text style={styles.buttonTextCriarTarefa}>
                {textProps}
            </Text>
        </Pressable>
    );
}

export default LongNoFillPressable;