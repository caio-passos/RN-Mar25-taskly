import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../App';

interface ModalBiometriaProps {
    text?: string;
    visible: boolean;
    onClose: () => void;
}

const ModalBiometria = ({ visible, onClose, text}: ModalBiometriaProps) => {
    const colors = React.useContext(AppContext);

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            paddingHorizontal: 32,
        },
        modalView: {
            width: '90%',
            paddingVertical: 30,
            paddingHorizontal: 20,
            alignItems: 'center',
            elevation: 5,
            backgroundColor: colors.Background,
            borderRadius: 12,
        },
        boxButtons: {
            flexDirection: 'row',
            gap: 12,
        },
        buttonOpen: {
            backgroundColor: '#F194FF',
        },
        buttonClose: {
            backgroundColor: '#2196F3',
        },
        buttonFilled: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#5B3CC4',
            borderRadius: 8,
            height: 37,
            justifyContent: 'space-around',
            marginTop: 25,
        },
        buttonEmptyFill: {
            borderColor: colors.Primary,
            borderWidth: 2,
            borderRadius: 8,
            width: '100%',
            height: 47,
            justifyContent: 'center',
            marginTop: 25,
        },
        textStyle: {
            width: '100%',
            textAlign: 'justify',
            justifyContent: 'center',
        },
        buttonText: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        },
        titleText: {
            width: '100%',
            fontSize: 17,
            marginBottom: 15,
            textAlign: 'center',
            fontWeight: 'bold',
        },
    })
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.titleText} numberOfLines={1}>Ative o Desbloqueio por Biometria</Text>
                    <Text style={styles.textStyle}>
                        Use sua impressão digital para acessar seu app de tarefas com rapidez e segurança. Se preferir, você ainda poderá usar sua senha sempre que quiser.
                    </Text>
                    <View style={styles.boxButtons}>
                        <Pressable
                            style={[styles.buttonFilled, { backgroundColor: colors.Background, borderColor: colors.Primary, borderWidth: 2 }]}
                            onPress={onClose}
                        >
                            <Pressable>

                                <Text style={styles.buttonText}>Agora não</Text>
                            </Pressable>
                        </Pressable>
                        <Pressable
                            style={styles.buttonFilled}
                            onPress={onClose}
                        >
                            <Pressable
                            onPress={onClose}
                            >
                                <Text style={styles.buttonText}>ATIVAR</Text>
                            </Pressable>
                        </Pressable>

                    </View>

                </View>
            </View>
        </Modal>

    );
};

export default ModalBiometria;  