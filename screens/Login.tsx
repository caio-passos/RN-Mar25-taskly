import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, Alert } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import Logo from '../assets/taskly.svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/routingTypes';
import { AppContext } from '../App';
import { useUserStore } from '../services/cache/stores/storeZustand';
import { UserDataTypes } from '../types/userTypes';

interface LoginProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Login'>;
}


interface loginData {
    email: string,
    password: string
}

function Login({ navigation }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [passLogin, setPassLogin] = useState(false);
    const error: Array<{ tag: string, error: string }> = [];
    const [errorsEmailShow, setErrorsEmailShow] = useState(error);
    const [errorsPasswordShow, setErrorsPasswordShow] = useState(error);

    const colors = useContext(AppContext)!.colors;
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 32,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.Background,
        },
        boxLogo: {
            justifyContent: 'center',
            paddingBottom: 24,
        },
        loginForm: {
            width: '100%',
            marginBottom: 20,
            gap: 4,
            position: 'relative',
        },
        boxInput: {
            width: '100%',
            height: 47,
            borderWidth: 2,
            borderColor: colors.Primary,
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
            backgroundColor: colors.Primary,
            borderRadius: 8,
            width: '100%',
            height: 47,
            justifyContent: 'center',
            marginTop: 25,
        },
        textEntrar: {
            color: '#FFFFFF',
            textAlign: 'center',
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
        textCriarConta: {
            color: colors.Primary,
            textAlign: 'center',
        },
        textError: {
            color: '#EF4444',
            fontWeight: 400,
            fontSize: 12,
            position: 'absolute',
            left: 0,
            bottom: -35,
        },
        textTitleInput: {
            color: colors.MainText,
        },
    });

    function login(data: loginData) {
        const { isValid, errors } = verifyData(data);

        if (!isValid) {
            showErrors(isValid, errors);
            return;
        }

        hideErrors();
        const storedUserData = useUserStore.getState().userData;

        if (
            storedUserData &&
            storedUserData.email === data.email &&
            storedUserData.senha === data.password
        ) {
            useUserStore.getState().partialUpdate({
                loggedIn: true
            });

            navigation.navigate('Inicio');

        } else {
            Alert.alert(
                'Erro de Login',
                'Credenciais inválidas. Verifique seu e-mail e senha.'
            );
        }
    }

    function verifyData(data: loginData) {
        const regexEmail: RegExp = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
        const errors: Array<{ tag: string, error: string }> = [];

        if (!regexEmail.test(data.email)) {
            errors.push({ tag: 'email', error: 'Email inv�lido' });
        }

        if (data.password.length < 8) {
            errors.push({ tag: 'password', error: 'A senha deve ter no m�nimo 8 caracteres' });
        }

        const isValid = errors.length <= 0;

        return {
            isValid,
            errors,
        };
    }

    function showErrors(isValid: boolean, errors: Array<{ tag: string, error: string }>) {
        if (!isValid) {
            const errorsEmail = errors.filter((value) => value.tag === 'email');
            const errorsPassword = errors.filter((value) => value.tag === 'password');

            setErrorsEmailShow(errorsEmail);
            setErrorsPasswordShow(errorsPassword);
        }
    }

    function hideErrors() {
        setErrorsEmailShow(error);
        setErrorsPasswordShow(error);
    }

    const colorPlace = styles.textTitleInput.color;

    return (
        <View style={styles.container}>
            <View style={styles.boxLogo}>
                <Logo width={329} height={56} />
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>E-mail</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        onChangeText={(value) => setEmail(String(value))}
                        placeholderTextColor={colorPlace}
                        style={{ color: colorPlace }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsEmailShow.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Digite sua senha"
                        keyboardType='ascii-capable'
                        onChangeText={(value) => setPassword(String(value))}
                        placeholderTextColor={colorPlace}
                        style={{ color: colorPlace }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsPasswordShow.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.boxLembrar}>
                <Icon name="checkbox-outline" size={20} color="#32C25B" />
                <View style={styles.textLembrar}>
                    <Text style={styles.textTitleInput}>Lembrar de mim</Text>
                </View>
            </View>
            <Pressable style={styles.buttonFilled} onPress={() => login({ email: email, password: password })}>
                <Text style={styles.textEntrar}>Entrar</Text>
            </Pressable>
            <Pressable style={styles.buttonEmptyFill}
                onPress={() => navigation.navigate('Cadastro')}
            >
                <Text style={styles.textCriarConta}>Criar conta</Text>
            </Pressable>

        </View>
    );
}


export default Login;
