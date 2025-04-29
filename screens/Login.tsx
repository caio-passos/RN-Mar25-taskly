import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import Logo from '../components/taskly.svg';
import Colorscheme from '../hooks/Colorscheme';


const { DarkPrimary, Primary, Background, PrimaryLight, SecundaryAccent, MainText, SecundaryText, Error } = Colorscheme();


function Login() {
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
                        keyboardType="email-address" />
                </View>
            </View>

            <View style={styles.loginForm}>
                <Text>Senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Digite sua senha"
                        keyboardType='ascii-capable' />
                </View>
            </View>
            <View style={styles.boxLembrar}>
                <Icon name="checkbox-outline" size={20} color="#32C25B" />
                <View style={styles.textLembrar}>
                    <Text>Lembrar de mim</Text>
                </View>
            </View>
            <Pressable style={styles.buttonFilled}>
                <Text style={styles.textEntrar}>Entrar</Text>
            </Pressable>
            <Pressable style={styles.buttonEmptyFill}>
                <Text style={styles.textCriarConta}>Criar conta</Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Background,
    },
    boxLogo: {
        justifyContent: 'center',
        paddingBottom: 24,
    },
    loginForm: {
        width: '100%',
        marginBottom: 20,
        gap: 4,
    },
    boxInput: {
        width: '100%',
        height: 47,
        borderWidth: 2,
        borderColor: Primary,
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
        backgroundColor: Primary,
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
        borderColor: Primary,
        borderWidth: 2,
        borderRadius: 8,
        width: '100%',
        height: 47,
        justifyContent: 'center',
        marginTop: 25,
    },
    textCriarConta: {
        color: Primary,
        textAlign: 'center',
    },

});

export default Login;