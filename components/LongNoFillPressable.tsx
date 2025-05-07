import React, { useContext } from "react";
import { StyleSheet, Text, Pressable, ViewStyle} from "react-native";
import { AppContext } from "../App";
import type { TapGesture } from "react-native-gesture-handler";

interface LongNoFillPressableProps {
    textProps: string;
    onPress?: () => void;
    style?: ViewStyle;
    Tap?: TapGesture;
}

function LongNoFillPressable({ textProps, onPress, style, Tap}: LongNoFillPressableProps) {

    const colors = useContext(AppContext)!.colors;
    const styles = StyleSheet.create({
        buttonFilled: {
            borderRadius: 8,
            borderColor: colors.SecondaryBG,
            borderWidth:2,
            width: '100%',
            height: 27,
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 25,
        },
        buttonTextCriarTarefa: {
            color: colors.Primary,
            textAlign: 'center',
            fontWeight: '600',
            
        }
    })

    return (
        <Pressable onPress={onPress} style={[styles.buttonFilled, style]}>
            <Text style={styles.buttonTextCriarTarefa}>
                {textProps}
            </Text>
        </Pressable>
    )
}

export default LongNoFillPressable;