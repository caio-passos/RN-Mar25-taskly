import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../App';
import LightModeBtn from '../../assets/improviso2.png';
import DarkModeBtn from '../../assets/improviso1.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DarkAndLigthMode {
    setControl: Function;
}

const DarkAndLigthMode = (props: DarkAndLigthMode) => {
    const colors = React.useContext(AppContext)!.colors;
    const setControlTheme = React.useContext(AppContext)!.setControlTheme;
    const [controlThemeModal, setControlThemeModal] = useState(false);

    const styles = StyleSheet.create({
        modalContainer: {
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
        },
        containerAll: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.Background,
            width: '90%',
            height: 274.5,
            gap: 15,
            borderRadius: 12,
            padding: 24,
            alignSelf: 'center',
            margin: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
        },
        textTitle: {
            fontWeight: 500,
            fontSize: 18,
            textDecorationLine: 'underline',
            alignSelf: 'flex-start',
            color: colors.MainText,
        },
        containerSvg: {
            display: 'flex',
            flexDirection: 'row',
            gap: 15,
        },
        containerBtn: {
            display: 'flex',
            flexDirection: 'row',
            gap: 15,
        },
        btnNotAgain: {
            width: 134.5,
            height: 37,
            borderRadius: 8,
            fontWeight: 500,
            borderWidth: 2,
            borderColor: colors.Primary,
            borderStyle: 'solid',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        btnConfirm: {
            backgroundColor: colors.SecondaryAccent,
            width: 134.5,
            height: 37,
            borderRadius: 8,
            fontWeight: 500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        textBtnNotAgain: {
            color: colors.Primary,
            fontWeight: 500,
            fontSize: 18,
            display: 'flex',
        },
        textBtnConfirm: {
            color: '#FFFFFF',
            fontWeight: 500,
            fontSize: 18,
            display: 'flex',
        },
        transparentContainer: {
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(17, 24, 39, 0.7)',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: -1,
        },
        pressableStyle: {
            width: '100%',
            height: '100%',
        },
    });

    return (
        <SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                style={styles.modalContainer}
            >
                <View style={styles.containerAll}>
                    <Text style={styles.textTitle}>Escolha o tema</Text>

                    <View style={styles.containerSvg}>
                        <Pressable onPress={() => setControlThemeModal(true)}><Image source={DarkModeBtn} /></Pressable>
                        <Pressable onPress={() => setControlThemeModal(false)}><Image source={LightModeBtn} /></Pressable>
                    </View>

                    <View style={styles.containerBtn}>
                        <Pressable onPress={() => props.setControl(false)} style={styles.btnNotAgain}><Text style={styles.textBtnNotAgain}>Agora não</Text></Pressable>
                        <Pressable onPress={() => {
                            AsyncStorage.setItem('theme', JSON.stringify(`${controlThemeModal}`)).then(() => setControlTheme(controlThemeModal));
                            props.setControl(false);
                        }} style={styles.btnConfirm}><Text style={styles.textBtnConfirm}>Confirmar</Text></Pressable>
                    </View>
                </View>
                <View style={styles.transparentContainer}><Pressable style={styles.pressableStyle} onPress={() => props.setControl(false)}></Pressable></View>
            </Modal>
        </SafeAreaView>
    );
};

export default DarkAndLigthMode;
