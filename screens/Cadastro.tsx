import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, Modal, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import MaskTextInput from 'react-native-mask-input';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/routingTypes';
import { AppContext } from '../App';
import ReturnLeft from '../assets/caretLeft.svg';
import ModalAlert from './Modal/Alert';
import { useUserStore } from '../services/cache/stores/storeZustand';
import { UserDataTypes } from '../types/userTypes';
import { mmkvStorage } from '../services/db/storageMMKV';
import { UserTypes } from '../model/userModel';
import { registerUser } from '../services/db/api/api';
import MaskInput, { Masks } from 'react-native-mask-input';

interface CadastroProps extends NativeStackScreenProps<RootStackParamList, 'Cadastro'> { }

function Cadastro({ navigation }: CadastroProps) {
    const { colors, darkMode } = useContext(AppContext)!;
    const error: Array<{ tag: string, error: string }> = [];

    const [uid, setUid] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailValidation, setEmailValidation] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');

    const [nameAndSurname, setNameAndSurname] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorsname, setErrorsNameAndSurname] = useState(error);
    const [errorsEmail, setErrorsEmail] = useState(error);
    const [errorsphone, setErrorsPhone] = useState(error);
    const [errorspassword, setErrorsPassword] = useState(error);
    const [errorscheckPassword, setErrorsCheckPassword] = useState(error);
    const [passwordError, setPasswordError] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const [userData, setUserData] = useState<UserTypes>({ email: '', password: '', name: '', phone_number: '' });

    console.log('Phone number:', phone)
    const sanitizePhone = (phone: string) => {
        return phone.replace(/\D/g, '');
    };

    useEffect(() => {
        setUserData({
            email: email,
            password: password,
            name: name,
            phone_number: sanitizePhone(phone)
        });
        console.log('User data updated:', userData);
    }, [name, email, phone, password]);

    const { setItemUserData } = useUserStore();
    console.log('user data')
    console.log("Stored data after creation: ", mmkvStorage.getItem('user-storage'));

    useEffect(() => {
        const userData = mmkvStorage.getItem('user-storage');
        console.log('Current stored user data:', userData);
    }, []);

    useEffect(() => {
        setNameAndSurname(name);
        setNumberPhone(phone);
        setPassword(password);
        setConfirmPassword(checkPassword);
        setEmailValidation(email);
    }, [name, phone, password, checkPassword, email]);

    useEffect(() => {
        const verifyPasswords = () => {
            if (checkPassword === '') {
                setPasswordError(false);
                return;
            }
            if (password !== checkPassword) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }
        };
        verifyPasswords();
    }, [password, checkPassword]);

    useEffect(() => {
        const handleFormValidation = () => {
            if (name && email && phone && passwordError === false) {
                setIsFilled(true);
            } else {
                setIsFilled(false);
            }
        }
        handleFormValidation();
    }, [name, email, phone, passwordError]);

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
            flexDirection: 'row', alignItems: 'center',
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

    const createAccount = async (userData: UserTypes) => {
        try {
            const registerResponse = await registerUser(userData);
            if (!registerResponse) {
                return { success: false, error: 'Registration failed' };
            }
            return { success: true}
        } catch (error) {
            console.error('Account creation failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    };

    function verifyData(data: UserTypes, confirmPassword: string) {
        const regexEmail: RegExp = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
        const errors: Array<{ tag: string, error: string }> = [];
        const regexPasswordSpecial = /[^a-zA-Z0-9]/;
        const regexPasswordUpper = /[A-Z]/;
        const regexPasswordLower = /[a-z]/;

        function verifyName() {
            const name = data.name.split(' ');
            const errors = { notSurname: '', notLength: '' };

            if (name.length < 2 || name[1] === '') {
                errors.notSurname = 'notSurname';
            }

            if (name.join('').length > 120) {
                errors.notLength = 'notLength';
            }

            return errors;
        }

        function verifyPhone() {
            const errors = { notLength: '' };
            const lenghtPhone = data.phone_number.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').length;

            if (lenghtPhone < 10 || lenghtPhone < 11) {
                errors.notLength = 'notLength';
            }

            return errors;
        }

        function isSequence(text: string) {
            const chars: Array<string> = [];
            const numberSequence: Array<string> = text.split('');
            const textOrder: string = numberSequence.sort().join('');

            for (let i: number = 0; i < text.length; i++) {
                if (text[i + 1] !== text[i] && i < text.length && !/\d/.test(text[i])) {
                    chars.push(text[i]);
                } else if (textOrder[i + 1] !== textOrder[i] && Number(textOrder[i + 1]) - 1 !== (Number(textOrder[i])) && i < textOrder.length) {
                    chars.push(text[i]);
                }
            }

            return chars.length === text.length;
        }

        if (verifyName().notSurname === 'notSurname') {
            errors.push({ tag: 'name', error: 'O name deve ser composto (mínimo dois nomes)' });
        }

        if (verifyName().notLength === 'notLength') {
            errors.push({ tag: 'name', error: 'Máximo de 120 caracteres' });
        }

        if (!regexEmail.test(data.email)) {
            errors.push({ tag: 'email', error: 'Email inválido' });
        }

        if (verifyPhone().notLength === 'notLength') {
            errors.push({ tag: 'phone', error: 'O número deve ter 11 ou 12 digitos' });
        }

        if (data.password.length < 8) {
            errors.push({ tag: 'password', error: 'A password deve ter no mínimo 8 caracteres' });
        } else if (data.password.length >= 8 && data.password.length > 20) {
            errors.push({ tag: 'password', error: 'A password deve ter no máximo 20 caracteres' });
        } else if (data.password !== '' && !isSequence(data.password)) {
            errors.push({ tag: 'password', error: 'A password não pode ser uma sequência igual' });
        } else if (!regexPasswordUpper.test(data.password)) {
            errors.push({ tag: 'password', error: 'A password deve ter uma letra maiúscula' });
        } else if (!regexPasswordLower.test(data.password)) {
            errors.push({ tag: 'password', error: 'A password deve ter uma letra minúscula' });
        } else if (!regexPasswordSpecial.test(data.password)) {
            errors.push({ tag: 'password', error: 'A password deve ter um caractere especial' });
        }

        if (confirmPassword !== data.password || confirmPassword === '') {
            errors.push({ tag: 'passwordConfirm', error: 'A passwords devem ser iguais' });
        }

        const isValid = errors.length <= 0;

        return {
            isValid,
            errors,
        };
    }

    function showErrors(isValid: boolean, errors: Array<{ tag: string, error: string }>) {
        if (!isValid) {
            const errorsname = errors.filter((value) => value.tag === 'name');
            const errorsEmail = errors.filter((value) => value.tag === 'email');
            const errorsPhone = errors.filter((value) => value.tag === 'phone');
            const errorsPassword = errors.filter((value) => value.tag === 'password');
            const errorsPasswordConfirm = errors.filter((value) => value.tag === 'passwordConfirm');

            setErrorsNameAndSurname(errorsname);
            setErrorsEmail(errorsEmail);
            setErrorsPhone(errorsPhone);
            setErrorsPassword(errorsPassword);
            setErrorsCheckPassword(errorsPasswordConfirm);
        }
    }

    function hideErrors() {
        setName('');
        setEmailValidation('');
        setPhone('');
        setPassword('');
        setCheckPassword('');
    }

    function formatPhone(data: string) {
        const phone = data;
        let digitNumber;
        let ddd;

        const phoneNumber = phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');

        if (phoneNumber.length === 11 && phoneNumber.length < 12 || phoneNumber.length === 12 && phoneNumber.length < 13) {
            digitNumber = phoneNumber.slice(phoneNumber.length - 9, phoneNumber.length);
            ddd = phoneNumber.slice(0, phoneNumber.length - 9);

            setPhone(`(${ddd}) ${digitNumber.slice(0, 5)}-${digitNumber.slice(5, 9)}`);
        } else {
            phoneNumber.length <= 10 ? setPhone(phoneNumber) : null;
        }

        return String(ddd);
    }

    const colorPlace = styles.textTitleInput.color;

    return (
        <SafeAreaView style={styles.container}>
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
                <Text style={styles.textTitleInput}>name Completo</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu name completo"
                        placeholderTextColor={colors.MainText}
                        keyboardType="default"
                        value={name}
                        onChangeText={setName}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsname.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>E-mail</Text>
                <View style={styles.boxInput}>
                    <MaskTextInput
                        placeholder="Digite seu e-mail"
                        placeholderTextColor={colors.MainText}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        style={{ color: colors.MainText }}
                        mask={[
                            /\S/, /\S/, /\S/, /\S/, /\S/,
                            /\S/, /\S/, /\S/, /\S/, /\S/,
                            /\S/, /\S/, /\S/, /\S/, /\S/,
                            /\S/, /\S/, /\S/, /\S/, /\S/,
                            /\S/, /\S/, /\S/, /\S/, /\S/,
                            '@'
                        ]}
                    />
                </View>
                {<Text style={styles.textError}>{errorsEmail.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Número</Text>
                <View style={styles.boxInput}>
                    <MaskInput
                        placeholder="Digite seu número de celular"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        mask={Masks.BRL_PHONE}
                        placeholderTextColor={colorPlace}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsphone.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>password</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Digite sua password"
                        placeholderTextColor={colors.MainText}
                        value={password}
                        onChangeText={setPassword}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorspassword.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Confirmar password</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Confirme sua password"
                        value={checkPassword}
                        onChangeText={setCheckPassword}
                        placeholderTextColor={colorPlace}
                        style={{ color: colors.MainText }}
                    />
                </View>
                {<Text style={styles.textError}>{errorscheckPassword.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <Pressable
                style={styles.buttonFilled}
                onPress={async() => {
                    try {
                        const result = await createAccount(userData);
                        console.log('Account creation result:', result);
                        if (result?.success) {
                            handleOpenModal();
                        }
                    } catch (error) {
                        console.error('Error during account creation:', error);
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
                description='Use sua impressão digital para acessar seu app de tarefas com rapidez e segurança. Se preferir, você ainda poderá usar sua password sempre que quiser.'
                leftButtonText='Agora não'
                rightButtonText='ATIVAR'
            />
        </SafeAreaView>

    );
}
export default Cadastro;
