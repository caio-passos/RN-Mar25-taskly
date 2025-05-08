import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextStyle, Pressable, View, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../App';

interface ModalAlertProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    leftButtonText?: string;
    rightButtonText?: string;
    style?: StyleProp<ViewStyle>;
    rightButtonStyle?: StyleProp<ViewStyle>; 
    rightButtonTextStyle?: StyleProp<TextStyle>;
    onRightButtonPress?: () => void;
}

const ModalAlert = ({
    visible,
    onClose,
    title,
    description,
    leftButtonText,
    rightButtonText,
    style,
    rightButtonStyle,
    rightButtonTextStyle,
    onRightButtonPress
}: ModalAlertProps) => {
    const colors = React.useContext(AppContext)!.colors;

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
            justifyContent: 'space-between',
            gap: 12,
            width: '100%',
        },
        buttonFilled: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.Primary,
            borderRadius: 8,
            height: 37,
            marginTop: 25,
        },
        buttonEmptyFill: {
            flex: 1,
            flexDirection: 'row',
            borderColor: colors.Primary,
            borderWidth: 2,
            borderRadius: 8,
            height: 37,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 25,
        },
        textStyle: {
            width: '100%',
            textAlign: 'justify',
            justifyContent: 'center',
            color: colors.MainText,
        },
        buttonText: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: colors.MainText,
        },
        buttonRightText: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: colors.SecondaryBG,
        },
        titleText: {
            width: '100%',
            fontSize: 17,
            marginBottom: 15,
            textAlign: 'center',
            fontWeight: 'bold',
            color: colors.MainText,
        },
        textModal: {
            color: colors.MainText,
        },
    });
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
                    <Text style={styles.textStyle}>
                        {description}
                    </Text>
                    <View style={styles.boxButtons}>
                        <Pressable style={styles.buttonEmptyFill} onPress={onClose}>
                            <Text style={[styles.buttonText]}>{leftButtonText}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.buttonFilled, rightButtonStyle]}
                                onPress={() => {
                                console.log('Right button pressed');
                                
                                if (onRightButtonPress) {
                                    onRightButtonPress();
                                }
                                console.log('Calling onClose'); 
                                onClose(); 
                            }}
                        >
                            <Text style={[rightButtonTextStyle, styles.buttonRightText]}>{rightButtonText}</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
        </Modal>

    );
};

export default ModalAlert;