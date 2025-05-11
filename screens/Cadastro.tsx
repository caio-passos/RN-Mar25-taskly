import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, Modal, SafeAreaView } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/routingTypes';
import { AppContext } from '../App';
import ReturnLeft from '../assets/caretLeft.svg';
import ModalAlert from './Modal/Alert';
import { useUserStore } from '../services/cache/stores/storeZustand';
import { UserDataTypes } from '../types/userTypes';
import { mmkvStorage } from '../services/db/storageMMKV';
import { v4, V4Options } from 'uuid';

interface CadastroProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Cadastro'>;
}

type dataUser = { uid: V4Options, nome: string, email: string, telefone: string, senha: string, checkSenha: string }

function Cadastro({ navigation }: CadastroProps) {
    const { colors, darkMode } = useContext(AppContext)!;
    const error: Array<{ tag: string, error: string }> = [];

    const [uid, setUid] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [emailValidation, setEmailValidation] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [checkSenha, setCheckSenha] = useState('');

    const [errorsNome, setErrorsNameAndSurname] = useState(error);
    const [errorsEmail, setErrorsEmail] = useState(error);
    const [errorsTelefone, setErrorsTelefone] = useState(error);
    const [errorsSenha, setErrorsSenha] = useState(error);
    const [errorsCheckSenha, setErrorsCheckSenha] = useState(error);
    const [senhaError, setSenhaError] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        setFormData({
            uid: v4,
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha,
            checkSenha: checkSenha

        });
    }, [nome, email, telefone, senha, checkSenha]);


    const [formData, setFormData] = useState<UserDataTypes>({
        uid: v4,
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        checkSenha: ''
    })

    const { setItemUserData } = useUserStore();
    console.log('user data')
    console.log("Stored data after creation: ", mmkvStorage.getItem('user-storage'));

    useEffect(() => {
        const userData = mmkvStorage.getItem('user-storage');
        console.log('Current stored user data:', userData);
    }, []);

    const handleFormSubmit = () => {
        if (isFilled && !senhaError) {
            createAccount(formData);
            console.log('Formulário enviado com sucesso!');
            navigation.navigate('Dashboard');
        }
    }
    useEffect(() => {
        const verifyPasswords = () => {
            if (checkSenha === '') {
                setSenhaError(false);
                return;
            }
            if (senha !== checkSenha) {
                setSenhaError(true);
            } else {
                setSenhaError(false);
            }
        };
        verifyPasswords();
    }, [senha, checkSenha]);

    useEffect(() => {
        const handleFormValidation = () => {
            if (nome && email && telefone && senhaError === false) {
                setIsFilled(true);
            } else {
                setIsFilled(false);
            }
        }
        handleFormValidation();
    }, [nome, email, telefone, senhaError]);

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
            backgroundColor: colors.Background,
        },
        title: {
            fontSize: 24,
            fontWeight: 700,
            paddingTop: 32,
            color: colors.MainText,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2,
        },
        headerContainer: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
        },
        returnPressable: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: colors.SecondaryText,
            padding: 10,
            borderRadius: 5,
            alignSelf: 'flex-start',
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
            position: 'relative',
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
            color: colors.Background,
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

    async function createAccount(data: dataUser) {
        const { isValid, errors } = verifyData(data);

        if (!isValid) {
            showErrors(isValid, errors);
        } else {
            hideErrors();
            setItemUserData({ ...data, loggedIn: true });
        }
    }

    function verifyData(data: dataUser) {
        console.log("DEBUG: Skipping validation, assuming valid.");
        return { isValid: true, errors: [] };
    }

    function showErrors(isValid: boolean, errors: Array<{ tag: string, error: string }>) {
        if (!isValid) {
            const errorsNome = errors.filter((value) => value.tag === 'name');
            const errorsEmail = errors.filter((value) => value.tag === 'email');
            const errorsTelefone = errors.filter((value) => value.tag === 'phone');
            const errorssenha = errors.filter((value) => value.tag === 'senha');
            const errorssenhaConfirm = errors.filter((value) => value.tag === 'senhaConfirm');

            setErrorsNameAndSurname(errorsNome);
            setErrorsEmail(errorsEmail);
            setErrorsTelefone(errorsTelefone);
            setErrorsSenha(errorssenha);
            setErrorsCheckSenha(errorssenhaConfirm);
        }
    }

    function hideErrors() {
        setNome('');
        setEmailValidation('');
        setTelefone('');
        setSenha('');
        setCheckSenha('');
    }

    function formatPhone(data: string) {
        const phone = data;
        let digitNumber;
        let ddd;

        const phoneNumber = phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');

        if (phoneNumber.length === 11 && phoneNumber.length < 12 || phoneNumber.length === 12 && phoneNumber.length < 13) {
            digitNumber = phoneNumber.slice(phoneNumber.length - 9, phoneNumber.length);
            ddd = phoneNumber.slice(0, phoneNumber.length - 9);

            setTelefone(`(${ddd}) ${digitNumber.slice(0, 5)}-${digitNumber.slice(5, 9)}`);
        } else {
            phoneNumber.length <= 10 ? setTelefone(phoneNumber) : null;
        }

        return String(ddd);
    }

    const colorPlace = styles.textTitleInput.color;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Pressable
                    style={styles.returnPressable}
                    onPress={() => navigation.goBack()}
                >
                    <ReturnLeft width={23} height={17.25} />
                    <View style={styles.boxTextVoltar}>
                        <Text style={styles.textVoltar}>VOLTAR</Text>
                    </View>
                </Pressable>
            </View>
            <Text style={styles.title}>CADASTRO</Text>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Nome Completo</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu nome completo"
                        placeholderTextColor={colors.MainText}
                        keyboardType="default"
                        value={nome}
                        onChangeText={setNome}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsNome.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>E-mail</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu e-mail"
                        placeholderTextColor={colors.MainText}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsEmail.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Número</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu número de telefone"
                        keyboardType="phone-pad"
                        value={telefone}
                        onChangeText={(value) => {
                            formatPhone(String(value));
                            setTelefone(value)
                        }}
                        placeholderTextColor={colorPlace}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsTelefone.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Digite sua senha"
                        placeholderTextColor={colors.MainText}
                        value={senha}
                        onChangeText={setSenha}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsSenha.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Confirmar senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Confirme sua senha"
                        value={checkSenha}
                        onChangeText={setCheckSenha}
                        placeholderTextColor={colorPlace}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsCheckSenha.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <Pressable
                style={styles.buttonFilled}
                onPress={() => {
                    if (isFilled && !senhaError) {
                        createAccount(formData);
                        handleOpenModal();
                        // add api post to create account
                    } else {
                        console.log("Submit blocked: isFilled=", isFilled, "senhaError=", senhaError);
                    }
                }}>
                <Text style={styles.textCriarConta}>CRIAR CONTA</Text>
            </Pressable>
            <ModalAlert
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false)
                    setTimeout(() => {
                        useUserStore.getState().partialUpdate({ loggedIn: true });
                    }, 100);
                    navigation.navigate('Avatar');
                }}
                title='Ative o Desbloqueio por Biometria'
                description='Use sua impressão digital para acessar seu app de tarefas com rapidez e segurança. Se preferir, você ainda poderá usar sua senha sempre que quiser.'
                leftButtonText='Agora não'
                rightButtonText='ATIVAR'
            />

        </View>

    );
}
export default Cadastro;