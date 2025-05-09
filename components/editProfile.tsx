import React, { useState, useContext, useEffect } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useAuthStore } from "../services/cache/stores/storeZustand";
import { AppContext } from '../App';
import { useUserStore } from '../services/cache/stores/storeZustand';
import type { UserDataTypes } from '../types/userTypes';
import Avatar from '../screens/(auth)/Avatar';
import LongPressable from './LongPressable';
import ReturnLeft from '../assets/caretLeft.svg';
import ProgressBar from './progressbar';

interface editProfileProps {
    onCloseEdit: () => void; // Callback to notify parent when EditProfile is closed
}

const EditProfile = ({ onCloseEdit }: editProfileProps) => {
    const { userData: initialUserData } = useUserStore();
    const colors = useContext(AppContext)!.colors;
    const [name, setName] = useState(initialUserData?.nome || '');
    const [email, setEmail] = useState(initialUserData?.email || '');
    const [phone, setPhone] = useState(initialUserData?.telefone || '');
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [continuar, setContinuar] = useState<boolean>(false);

    useEffect(() => {
        console.log('userData: ', name, email, phone);
    }, [name, email, phone]);

    const handleCloseEdit = () => {
        onCloseEdit(); // Notify parent component (Menu.tsx) that EditProfile is closed
        setName('');
        setEmail('');
        setPhone('');
    };

    const userUpdater = () => {
        const updates: Partial<UserDataTypes> = {};
        if (name !== (initialUserData?.nome || '')) updates.nome = name;
        if (email !== (initialUserData?.email || '')) updates.email = email;
        if (phone !== (initialUserData?.telefone || '')) updates.telefone = phone;

        if (Object.keys(updates).length > 0) {
            useUserStore.getState().partialUpdate(updates);
        }
        useAuthStore.getState().updateUserData(draft => {
            if (updates.nome !== undefined) draft.nome = updates.nome;
            if (updates.email !== undefined) draft.email = updates.email;
            if (updates.telefone !== undefined) draft.telefone = updates.telefone;
        });
        onCloseEdit(); // Notify parent component (Menu.tsx) that EditProfile is closed
        setContinuar(false);
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
            fontWeight: '700',
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
            marginHorizontal: 16,
            color: colors.MainText,
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
            fontWeight: '700',
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
            color: colors.MainText,
        },
        boxTextVoltar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2,
        },
        textVoltar: {
            fontSize: 18,
            color: colors.MainText,
        },
    });

    const colorPlace = styles.textTitleInput.color;

    return (
        <View style={styles.container}>
            {continuar ? (
                <>
                    <Pressable style={styles.returnPressable} onPress={() => handleCloseEdit()}>
                        <ReturnLeft width={23} height={17.25} />
                        <View style={styles.boxTextVoltar}>
                            <Text style={styles.textVoltar}>VOLTAR</Text>
                        </View>
                    </Pressable>
                    <ProgressBar progress={100} />
                    <Avatar onEditProfile={userUpdater} />
                </>
            ) : (
                <>
                    <Pressable style={styles.returnPressable} onPress={() => handleCloseEdit()}>
                        <ReturnLeft width={23} height={17.25} />
                        <View style={styles.boxTextVoltar}>
                            <Text style={styles.textVoltar}>VOLTAR</Text>
                        </View>
                    </Pressable>
                    <ProgressBar progress={30} />
                    <View style={styles.editTitle}>
                        <Text style={styles.editTitleText}>EDIÇÃO DE PERFIL</Text>
                    </View>
                    <View style={styles.loginForm}>
                        <Text style={styles.textTitleInput}>Nome Completo</Text>
                        <View style={styles.boxInput}>
                            <TextInput
                                placeholder="Digite seu nome completo"
                                placeholderTextColor={colors.MainText}
                                keyboardType="ascii-capable"
                                value={name}
                                onChangeText={setName}
                                cursorColor={colors.MainText}
                                underlineColorAndroid="transparent"
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
                                    setPhone(value);
                                }}
                                placeholderTextColor={colorPlace}
                                style={styles.textInput}
                            />
                        </View>
                        <LongPressable
                            textProps="Continuar"
                            onPress={() => setContinuar(true)}
                            style={{
                                marginTop: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

export default EditProfile;