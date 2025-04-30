import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import Logo from '../assets/taskly.svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/routingTypes';
import { AppContext } from '../App';

interface LoginProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Cadastro'>;
}

function Login({ navigation }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const error: Array<{ tag: string, error: string }> = [];
    const [errorsEmailShow, setErrorsEmailShow] = useState(error);
    const [errorsPasswordShow, setErrorsPasswordShow] = useState(error);

    const colors = useContext(AppContext);
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
    });

    function login(data: { email: string, password: string }) {
        const { isValid, errors } = verifyData(data);
        !isValid ? showErrors(isValid, errors) : hideErrors();
    }

    function verifyData(data: { email: string, password: string }) {
        const regexEmail: RegExp = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
        const errors: Array<{ tag: string, error: string }> = [];

        if (!regexEmail.test(data.email)) {
            errors.push({ tag: 'email', error: 'Email inválido' });
        }

        if (data.password.length < 8) {
            errors.push({ tag: 'password', error: 'A senha deve ter no mínimo 8 caracteres' });
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

    return (
        <View style={styles.container}>
            <View style={styles.boxLogo}>
                <Logo width={329} height={56} />
            </View>
            <View style={styles.loginForm}>
                <Text>E-mail</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        onChangeText={(value) => setEmail(String(value))}
                        />
                </View>
                {<Text style={styles.textError}>{errorsEmailShow.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <View style={styles.loginForm}>
                <Text>Senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Digite sua senha"
                        keyboardType='ascii-capable'
                        onChangeText={(value) => setPassword(String(value))}
                        />
                </View>
                {<Text style={styles.textError}>{errorsPasswordShow.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.boxLembrar}>
                <Icon name="checkbox-outline" size={20} color="#32C25B" />
                <View style={styles.textLembrar}>
                    <Text>Lembrar de mim</Text>
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
