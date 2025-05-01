import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, Modal } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/routingTypes';
import { AppContext } from '../App';
import ReturnLeft from '../assets/caretLeft.svg';
import ModalBiometria from './Modal/Biometria';

interface CadastroProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Cadastro', 'Home'>;
}

type DataInfoUser = { nameAndSurname: string, email: string, numberPhone: string, password: string, confirmPassword: string }

function Cadastro({ navigation }: CadastroProps) {
    const colors = useContext(AppContext);
    const [nameAndSurname, setNameAndSurname] = useState('');
    const [emailValidation, setEmailValidation] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const error: Array<{ tag: string, error: string }> = [];
    const [errorsNameAndSurname, setErrorsNameAndSurname] = useState(error);
    const [errorsEmailShow, setErrorsEmailShow] = useState(error);
    const [errorsNumberPhone, setErrorsNumberPhone] = useState(error);
    const [errorsPasswordShow, setErrorsPasswordShow] = useState(error);
    const [errorsConfirmPassword, setErrorsConfirmPassword] = useState(error);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState<string>('');
    const [checkSenha, setCheckSenha] = useState<string>('');
    const [senhaError, setSenhaError] = useState(false);
    
    const handleFormSubmit = () => {
        if (isFilled && !senhaError) {
            console.log('Formulário enviado com sucesso!');
            navigation.navigate('Inicio');
        }
    }
    useEffect(() => {
        const handlePasswordVerification = () => {
            if (senha !== checkSenha) {
                setSenhaError(true);
            }
            if(senha === checkSenha && senha.length > 0) {
                setSenhaError(false);
            }
            handlePasswordVerification();
        }
    }, [senha, checkSenha]);

    useEffect(() => {
        const handleFormValidation = () => {
            if (nome && email && telefone && senhaError===false) {
                setIsFilled(true);
            } else {
                setIsFilled(false);
            }
        }
        handleFormValidation();
    },[nome, email, telefone, senhaError]);

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
          textError: {
              color: '#EF4444',
              fontWeight: 400,
              fontSize: 12,
              position: 'absolute',
              left: 0,
              bottom: -35,
          },
      });
    
      function createAccount(data: DataInfoUser) {
        const { isValid, errors } = verifyData(data);
        !isValid ? showErrors(isValid, errors) : hideErrors();
    }

    function verifyData(data: DataInfoUser) {
        const regexEmail: RegExp = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
        const errors: Array<{ tag: string, error: string }> = [];
        const regexPasswordSpecial = /[^a-zA-Z0-9]/;
        const regexPasswordUpper = /[A-Z]/;
        const regexPasswordLower = /[a-z]/;

        function verifyName() {
            const name = data.nameAndSurname.split(' ');
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
            const lenghtPhone = data.numberPhone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').length;

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
            errors.push({ tag: 'name', error: 'O nome deve ser composto (mínimo dois nomes)' });
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
            errors.push({ tag: 'password', error: 'A senha deve ter no mínimo 8 caracteres' });
        } else if (data.password.length >= 8 && data.password.length > 20) {
            errors.push({ tag: 'password', error: 'A senha deve ter no máximo 20 caracteres' });
        } else if (data.password !== '' && !isSequence(data.password)) {
            errors.push({ tag: 'password', error: 'A senha não pode ser uma sequência igual' });
        } else if (!regexPasswordUpper.test(data.password)) {
            errors.push({ tag: 'password', error: 'A senha deve ter uma letra maiúscula' });
        } else if (!regexPasswordLower.test(data.password)) {
            errors.push({ tag: 'password', error: 'A senha deve ter uma letra minúscula' });
        } else if (!regexPasswordSpecial.test(data.password)) {
            errors.push({ tag: 'password', error: 'A senha deve ter um caractere especial' });
        }

        if (data.confirmPassword !== data.password || data.confirmPassword === '') {
            errors.push({ tag: 'passwordConfirm', error: 'A senhas devem ser iguais' });
        }

        const isValid = errors.length <= 0;

        return {
            isValid,
            errors,
        };
    }

    function showErrors(isValid: boolean, errors: Array<{ tag: string, error: string }>) {
        if (!isValid) {
            const errorsNameAndSurname = errors.filter((value) => value.tag === 'name');
            const errorsEmail = errors.filter((value) => value.tag === 'email');
            const errorsNumberPhone = errors.filter((value) => value.tag === 'phone');
            const errorsPassword = errors.filter((value) => value.tag === 'password');
            const errorsPasswordConfirm = errors.filter((value) => value.tag === 'passwordConfirm');

            setErrorsNameAndSurname(errorsNameAndSurname);
            setErrorsEmailShow(errorsEmail);
            setErrorsNumberPhone(errorsNumberPhone);
            setErrorsPasswordShow(errorsPassword);
            setErrorsConfirmPassword(errorsPasswordConfirm);
        }
    }

    function hideErrors() {
        setNameAndSurname('');
        setEmailValidation('');
        setNumberPhone('');
        setPassword('');
        setConfirmPassword('');
    }

    function formatPhone(data: string) {
        const phone = data;
        let digitNumber;
        let ddd;

        const phoneNumber = phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');

        if (phoneNumber.length === 11 && phoneNumber.length < 12 || phoneNumber.length === 12 && phoneNumber.length < 13) {
            digitNumber = phoneNumber.slice(phoneNumber.length - 9, phoneNumber.length);
            ddd = phoneNumber.slice(0, phoneNumber.length - 9);

            setNumberPhone(`(${ddd}) ${digitNumber.slice(0, 5)}-${digitNumber.slice(5, 9)}`);
        } else {
            phoneNumber.length <= 10 ? setNumberPhone(phoneNumber) : null;
        }

        return String(ddd);
    }

    return (
        <View style={styles.container}>
            <Pressable 
            style={styles.returnPressable}
            onPress={() => navigation.goBack()}>
                <ReturnLeft width={23} height={17.25} />
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
                        keyboardType="default"
                        value={nameAndSurname}
                        onChangeText={(value) => {
                          setNameAndSurname(String(value));
                          setNome(value)
                        }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsNameAndSurname.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text>E-mail</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        value={emailValidation}
                        onChangeText={(value) => {
                          setEmailValidation(String(value));
                          setEmail(value);
                        }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsEmailShow.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text>Número</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu número de telefone"
                        keyboardType="phone-pad"
                        value={numberPhone}
                        onChangeText={(value) => {
                            formatPhone(String(value));
                            setTelefone(value)
                        }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsNumberPhone.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <View style={styles.loginForm}>
                <Text>Senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Digite sua senha"
                        value={password}
                        onChangeText={(text) => {
                          setSenha(text);
                          setPassword(String(text))
                        }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsPasswordShow.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text>Confirmar senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChangeText={(value) => setConfirmPassword(String(value))}
                    />
                </View>
                {<Text style={styles.textError}>{errorsConfirmPassword.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <Pressable
                style={styles.buttonFilled}
                onPress={() => {
                  handleOpenModal();
                  createAccount({ nameAndSurname: nameAndSurname, email: emailValidation, numberPhone: numberPhone, password: password, confirmPassword: confirmPassword });
                }}>
                <Text style={styles.textCriarConta}>CRIAR CONTA</Text>
            </Pressable>
            <ModalBiometria
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false)
                    navigation.navigate('Dashboard');
                }}
            />
        </View>

    );
}

export default Cadastro;