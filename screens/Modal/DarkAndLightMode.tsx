import React, { useEffect, useState, useContext } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../App';
import LightModeBtn from '../../assets/improviso2.png';
import DarkModeBtn from '../../assets/improviso1.png';
import { useAuthStore } from '../../services/cache/stores/storeZustand';


interface DarkAndLigthMode {
    setControl: Function;
}

const DarkAndLigthMode = (props: DarkAndLigthMode) => {
    const colors = useContext(AppContext)!.colors;
    const [controlThemeModal, setControlThemeModal] = useState(
        colors.Background === '#282828'
    );
    const { userData } = useAuthStore();
    const setTheme = useAuthStore(state => state.setTheme);

    const getButtonStyle = (isSelected: boolean) => ({
        padding: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: isSelected ? colors.Primary : 'transparent',
        backgroundColor: colors.Background,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center'
    });

    useEffect(() => {

    }, [setTheme])

    const handleThemeChange = () => {
        console.log('Setting theme to:', controlThemeModal);
        if (userData) {
            setTheme({ darkMode: controlThemeModal });
            props.setControl(false);
        }
    };

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
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: 8

        },
        containerBtn: {
            display: 'flex',
            flexDirection: 'row',
            gap: 15,
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
        },
        btnNotAgain: {
            width: '48%',
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
            width: '48%',
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
        selectedButton: {
            borderColor: colors.Primary
        }
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
                        <Pressable
                            style={getButtonStyle(controlThemeModal)}
                            onPress={() => setControlThemeModal(true)}
                        >
                            <Image source={DarkModeBtn} />
                        </Pressable>
                        <Pressable
                            style={getButtonStyle(!controlThemeModal)}
                            onPress={() => setControlThemeModal(false)}
                        >
                            <Image source={LightModeBtn} />
                        </Pressable>
                    </View>
                    <View style={styles.containerBtn}>
                        <Pressable
                            onPress={() => props.setControl(false)}
                            style={styles.btnNotAgain}
                        >
                            <Text style={styles.textBtnNotAgain}>Agora não</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleThemeChange}
                            style={styles.btnConfirm}
                        >
                            <Text style={styles.textBtnConfirm}>Confirmar</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.transparentContainer}>
                    <Pressable style={styles.pressableStyle} onPress={() => props.setControl(false)} />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default DarkAndLigthMode;
