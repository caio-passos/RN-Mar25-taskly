import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, Modal } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/routingTypes';
import { AppContext } from '../App';
import CaretLeft from '../assets/caretLeft.svg';
import ModalBiometria from './Modal/Biometria';

interface CadastroProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Cadastro', 'Home'>;
}


function Cadastro({ navigation }: CadastroProps) {
    const colors = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenModal = () => {
        setModalVisible(true);
    }

    { console.log('Modal visible: ', modalVisible); }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 32,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        },
        title: {
            top: 40,
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.MainText,
            marginBottom: 20,
        },
        returnPressable: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            top: 50,
            left: 20,
            backgroundColor: colors.SecundaryText,
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
        boxLogo: {
            justifyContent: 'center',
            paddingBottom: 24,
        },
        loginForm: {
            width: '100%',
            marginTop: 33,
            gap: 4,
        },
        boxInput: {
            width: '100%',
            height: 47,
            borderWidth: 2,
            borderColor: '#5B3CC4',
            borderRadius: 8,
            justifyContent: 'center',
        },
        boxLembrar: {
            flexDirection: 'row',
            alignSelf: 'flex-start',
        },
        textLembrar: {
            alignSelf: 'flex-start',
            paddingHorizontal: 4,
        },
        buttonFilled: {
            backgroundColor: '#5B3CC4',
            borderRadius: 8,
            width: '100%',
            height: 47,
            justifyContent: 'center',
            marginTop: 25,
        },
        textCriarConta: {
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: 700,
        },
        buttonEmptyFill: {
            borderColor: '#5B3CC4',
            borderWidth: 2,
            borderRadius: 8,
            width: '100%',
            height: 47,
            justifyContent: 'center',
            marginTop: 25,
        },


    });

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.returnPressable}
                onPress={() => navigation.goBack()}>
                <CaretLeft width={23} height={17.25} />
                <View style={styles.boxTextVoltar}>
                    <Text style={styles.textVoltar}>VOLTAR</Text>
                </View>
            </Pressable>
            <Text style={styles.title}>CADASTRO</Text>
            <View style={styles.loginForm}>
                <Text>Nome Completo</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu nome completo"
                        keyboardType="default" />
                </View>
            </View>
            <View style={styles.loginForm}>
                <Text>E-mail</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address" />
                </View>
            </View>
            <View style={styles.loginForm}>
                <Text>Número</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu número de telefone"
                        keyboardType="phone-pad" />
                </View>
            </View>

            <View style={styles.loginForm}>
                <Text>Senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Digite sua senha"
                    />
                </View>
            </View>
            <View style={styles.loginForm}>
                <Text>Confirmar senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Confirme sua senha"
                    />
                </View>
            </View>

            <Pressable
                style={styles.buttonFilled}
                onPress={() => handleOpenModal()}>
                <Text style={styles.textCriarConta}>CRIAR CONTA</Text>
            </Pressable>
            <ModalBiometria
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

        </View>

    );

}

export default Cadastro;