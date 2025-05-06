import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Pressable, Modal } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/routingTypes';
import { AppContext } from '../App';
import ReturnLeft from '../assets/caretLeft.svg';
import ModalAlert from './Modal/Alert';
import { useUserStore } from '../services/cache/stores/storeZustand';
import { UserDataTypes } from '../types/userTypes';

interface CadastroProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Cadastro', 'Home'>;
}

type DataInfoUser = { nome: string, email: string, telefone: string, senha: string, checkSenha: string }

function Cadastro({ navigation }: CadastroProps) {
    const colors = useContext(AppContext)!.colors;
    const error: Array<{ tag: string, error: string }> = [];

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



    const [formData, setFormData] = useState<UserDataTypes>({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
    })

    const { setUserData, updateUserData } = useUserStore();

    const handleFormSubmit = () => {
        if (isFilled && !senhaError) {
            updateUserData((draft) => {
                draft.nome = formData.nome;
                draft.email= formData.email;
                draft.telefone = Number(formData.telefone);
                draft.senha = formData.senha;
            })

            console.log('Formulário enviado com sucesso!');
            navigation.navigate('Inicio');
        }
    }
    useEffect(() => {
        const handlesenhaVerification = () => {
            if (senha !== checkSenha) {
                setSenhaError(true);
            }
            if (senha === checkSenha && senha.length > 0) {
                setSenhaError(false);
            }
            handlesenhaVerification();
        }
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
            backgroundColor: colors.SecondaryText,
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

    function createAccount(data: DataInfoUser) {
        const { isValid, errors } = verifyData(data);
        !isValid ? showErrors(isValid, errors) : hideErrors();
    }

    function verifyData(data: DataInfoUser) {
        const regexEmail: RegExp = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
        const errors: Array<{ tag: string, error: string }> = [];
        const regexsenhaSpecial = /[^a-zA-Z0-9]/;
        const regexsenhaUpper = /[A-Z]/;
        const regexsenhaLower = /[a-z]/;

        function verifyName() {
            const name = data.nome.split(' ');
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
            const lenghtPhone = data.telefone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').length;

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

        if (data.senha.length < 8) {
            errors.push({ tag: 'senha', error: 'A senha deve ter no mínimo 8 caracteres' });
        } else if (data.senha.length >= 8 && data.senha.length > 20) {
            errors.push({ tag: 'senha', error: 'A senha deve ter no máximo 20 caracteres' });
        } else if (data.senha !== '' && !isSequence(data.senha)) {
            errors.push({ tag: 'senha', error: 'A senha não pode ser uma sequência igual' });
        } else if (!regexsenhaUpper.test(data.senha)) {
            errors.push({ tag: 'senha', error: 'A senha deve ter uma letra maiúscula' });
        } else if (!regexsenhaLower.test(data.senha)) {
            errors.push({ tag: 'senha', error: 'A senha deve ter uma letra minúscula' });
        } else if (!regexsenhaSpecial.test(data.senha)) {
            errors.push({ tag: 'senha', error: 'A senha deve ter um caractere especial' });
        }

        if (data.checkSenha !== data.senha || data.checkSenha=== '') {
            errors.push({ tag: 'senhaConfirm', error: 'A senhas devem ser iguais' });
        }

        const isValid = errors.length <= 0;

        return {
            isValid,
            errors,
        };
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
                <Text style={styles.textTitleInput}>Nome Completo</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu nome completo"
                        keyboardType="default"
                        value={nome}
                        onChangeText={(value) => {
                            setNome(String(value));
                            setNome(value)
                        }}
                        placeholderTextColor={colorPlace}
                    />
                </View>
                {<Text style={styles.textError}>{errorsNome.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>E-mail</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        value={emailValidation}
                        onChangeText={(value) => {
                            setEmailValidation(String(value));
                            setEmail(value);
                        }}
                        placeholderTextColor={colorPlace}
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
                        value={senha}
                        onChangeText={(text) => {
                            setSenha(text);
                            setSenha(String(text))
                        }}
                        placeholderTextColor={colorPlace}
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
                        onChangeText={(value) => setCheckSenha(String(value))}
                        placeholderTextColor={colorPlace}
                    />
                </View>
                {<Text style={styles.textError}>{errorsCheckSenha.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <Pressable
                style={styles.buttonFilled}
                onPress={() => {
                    handleOpenModal();
                    createAccount({ nome: nome, email: emailValidation, telefone: telefone, senha: senha, checkSenha: checkSenha});
                }}>
                <Text style={styles.textCriarConta}>CRIAR CONTA</Text>
            </Pressable>
            <ModalAlert
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false)
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