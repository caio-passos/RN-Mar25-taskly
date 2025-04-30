import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppContext } from "../App";

interface ShortPressableProps {
    textProps: string;
}

function ShortPressable({ textProps }: ShortPressableProps) {

    const colors = useContext(AppContext);
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
        <View style={styles.buttonFilled}>
            <Text style={styles.buttonTextCriarTarefa}>
                {textProps}
            </Text>
        </View>
    )
}

export default ShortPressable;