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
import { mmkvStorage } from '../services/db/storageMMKV';

interface CadastroProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Cadastro'>;
}

type dataUser = { nome: string, email: string, telefone: string, senha: string, checkSenha: string }

function Cadastro({ navigation }: CadastroProps) {
    const colors = useContext(AppContext);
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

    useEffect(() => {
        setFormData({
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha
        });
    }, [nome, email, telefone, senha]);


    const [formData, setFormData] = useState<UserDataTypes>({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
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

    async function createAccount(data: dataUser) {
        const { isValid, errors } = verifyData(data);

        if (!isValid) {
            showErrors(isValid, errors);
        } else {
            hideErrors(); 
            setItemUserData({...data, loggedIn: true});
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
                        value={nome}
                        onChangeText={setNome}
                    />
                </View>
                {<Text style={styles.textError}>{errorsNome.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text>E-mail</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                {<Text style={styles.textError}>{errorsEmail.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text>Número</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu número de telefone"
                        keyboardType="phone-pad"
                        value={telefone}
                        onChangeText={(value) => {
                            formatPhone(String(value));
                            setTelefone(value)
                        }}
                    />
                </View>
                {<Text style={styles.textError}>{errorsTelefone.map((value) => `${value.error}\n`)}</Text>}
            </View>

            <View style={styles.loginForm}>
                <Text>Senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Digite sua senha"
                        value={senha}
                        onChangeText={setSenha}
                    />
                </View>
                {<Text style={styles.textError}>{errorsSenha.map((value) => `${value.error}\n`)}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text>Confirmar senha</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Confirme sua senha"
                        value={checkSenha}
                        onChangeText={setCheckSenha}
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
                    navigation.navigate('Inicio');
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