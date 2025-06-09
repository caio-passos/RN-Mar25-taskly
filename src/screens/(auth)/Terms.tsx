import React, { useContext } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import ReturnLeft from '../../assets/caretLeft.svg';
import { WebView } from 'react-native-webview';
import { AppContext } from "../../../App";

interface TermsProps {
    setControl: Function
}

const Terms = (props: TermsProps) => {
    const { colors, darkMode } = useContext(AppContext)!;

    const styles = StyleSheet.create({
        Container: {
            flex: 1,
            justifyContent: 'flex-start',
            width: '100%',
            paddingTop: 50,
        },
        returnPressable: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.SecondaryText,
            padding: 10,
            borderRadius: 5,
        },
        boxTextVoltar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2,
        },
        textVoltar: {
            color: colors.Background,
            fontSize: 18,
        },
        containerBack: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 25,
            paddingRight: 25,
            paddingBottom: 16,
            backgroundColor: colors.Background,
            zIndex: 1,
        },
        textTerms: {
            fontWeight: 400,
            fontSize: 16,
            color: colors.MainText,
        },
        containerWeb: {
            zIndex: 2,
            position: 'absolute',
            top: -49.5,
            left: 0,
            width: '100%',
            height: '150%',
        },
    });

    return (
        <View style={styles.Container}>
            <View style={styles.containerBack}>
                <Pressable style={styles.returnPressable} onPress={() => props.setControl(false)}>
                    <ReturnLeft width={23} height={17.25} />
                    <View style={styles.boxTextVoltar}>
                        <Text style={styles.textVoltar}>VOLTAR</Text>
                    </View>
                </Pressable>
                <Text style={styles.textTerms}>Termos e regulamentos</Text>
            </View>

            <WebView style={styles.containerWeb} source={{ uri: 'https://sobreuol.noticias.uol.com.br/normas-de-seguranca-e-privacidade/en/' }} />
        </View>

    );
};

export default Terms;
