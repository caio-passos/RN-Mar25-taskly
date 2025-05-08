import React, { useState, useContext } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';
import { useAuthStore } from "../services/cache/stores/storeZustand";
import { AppContext } from '../App';
import { useUserStore } from '../services/cache/stores/storeZustand';
import type { UserDataTypes } from '../types/userTypes';
import Avatar from '../screens/(auth)/Avatar';
import LongPressable from '../components/LongPressable';
import ReturnLeft from '../assets/caretLeft.svg';


interface editProfileProps {
    onCloseEdit: () => void;
}
const EditProfile = ({ onCloseEdit }: editProfileProps) => {

    const colors = useContext(AppContext)!.colors;
    const { userData } = useUserStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [continuar, setContinuar] = useState<boolean>(false);


    const [isDarkMode, setIsDarkMode] = useState(
        useAuthStore.getState().userData?.theme?.darkMode ?? false
    );

    const handleCloseEdit = () => {
        onCloseEdit();
    }

    const handleContinuar = () => {
        const typedName = name.trim() !== '';
        const typedEmail = email.trim() !== '';
        const typedPhone = phone.trim() !== '';
        if (typedEmail && typedName && typedPhone) {
            setContinuar(!continuar);
        }
    }

    interface userDataEdit {
        name: string,
        email: string,
        phone: string,
    }
    const handleUserUpdate = (userData: { name: string, email: string, phone: string }) => {
        useAuthStore.getState().updateUserData((data: UserDataTypes) => {
            data.nome = userData.name;
            data.email = userData.email;
            data.telefone = userData.phone;
        })
    }


    const handlePress = (id: number) => {
        setSelectedAvatar(selectedAvatar === id ? null : id);
    };
    const avatars = [
        { id: 1, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#5B3CC4' },
        { id: 2, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#E6E0F7' },
        { id: 3, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#32C25B' },
        { id: 4, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#FF0000' },
        { id: 5, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#B58B46' },
    ];
    const handleConfirmAvatar = () => {
        const avatar = avatars.find(a => a.id === selectedAvatar);
        if (avatar) {
            useUserStore.getState().partialUpdate({ loggedIn: true })
            useAuthStore.getState().setAvatar(avatar)
            // navigation.navigate('Inicio');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 32,
            paddingTop: 130,
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
        textTitleInput: {
            color: colors.MainText,
        },
        textInput: {
            backgroundColor: colors.SecondaryBG,
            marginHorizontal: 16
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
            borderColor: colors.Background,
            borderRadius: 8,
            justifyContent: 'center',
            backgroundColor: colors.SecondaryBG,
        },
        buttonFilled: {
            backgroundColor: colors.Background,
            borderRadius: 8,
            width: '100%',
            height: 47,
            justifyContent: 'center',
            marginTop: 100,
        },
        textEditar: {
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: 700,
        },
        returnPressable: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            top: 50,
            left: 20,
            padding: 10,
            borderRadius: 5,
        },
        editTitle: {
            position: 'absolute',
            top: 50,
            right: 20,
            padding: 10,
        },
        editTitleText: {
            color: colors.MainText
        },
        boxTextVoltar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2,
        },
        textVoltar: {
            fontSize: 18,
            color: colors.MainText
        },
    });
    const colorPlace = styles.textTitleInput.color;
    return (
        <View style={styles.container}>
            <Pressable style={styles.returnPressable} onPress={() => handleCloseEdit()}>
                <ReturnLeft width={23} height={17.25} />
                <View style={styles.boxTextVoltar}>
                    <Text style={styles.textVoltar}>VOLTAR</Text>
                </View>
            </Pressable>
            <View style={styles.editTitle}>
                <Text style={styles.editTitleText}>EDIÇÃO DE PERFIL</Text>
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Nome Completo</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu nome completo"
                        placeholderTextColor={colors.MainText}
                        keyboardType="default"
                        value={name}
                        onChangeText={setName}
                        style={styles.textInput}
                    />
                </View>
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
                        style={styles.textInput}
                    />
                </View>
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.textTitleInput}>Número</Text>
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder="Digite seu número de telefone"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={(value) => {
                            setPhone(value)
                        }}
                        placeholderTextColor={colorPlace}
                        style={styles.textInput}
                    />
                </View>
                <LongPressable
                    textProps='Continuar'
                    onPress={handleContinuar}
                    style={{
                        marginTop: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                />
                {continuar && (
                    <Avatar />
                )}
            </View>
        </View>
    );
};

export default EditProfile;