import React, { useContext } from "react";
import { StyleSheet, Text, Pressable, ViewStyle} from "react-native";
import { AppContext } from "../App";

interface LongNoFillPressableProps {
    textProps: string;
    onPress: () => void;
    style?: ViewStyle;
}

function LongNoFillPressable({ textProps, onPress, style}: LongNoFillPressableProps) {

    const colors = useContext(AppContext);
    const styles = StyleSheet.create({
        buttonFilled: {
            borderRadius: 8,
            borderColor: colors.Primary,
            borderWidth:2,
            width: 329,
            height: 47,
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