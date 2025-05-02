import React, { useContext, useState } from "react";
import { View, Image, StyleSheet, Text, StyleProp, TextStyle, Pressable } from "react-native";
import MenuCarrousel from "../../components/carrousel/MenuCarrousel";
import IconEditar from '../../assets/icons/lightmode/carrousel/editarInfo';
import IconBiometria from '../../assets/icons/lightmode/carrousel/mudarBiometria';
import IconSair from '../../assets/icons/lightmode/carrousel/sairConta';
import IconExcluir from '../../assets/icons/lightmode/carrousel/excluirConta';
import IconRightArrow from '../../assets/icons/lightmode/rightArrow'
import ModalAlert from "../Modal/Alert";
import DarkAndLigthMode from '../Modal/DarkAndLigthMode';

import { AppContext } from "../../App";
import { RootStackParamList } from "../../types/routingTypes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface MenuProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Menu', 'Theme'>;
}

const Menu = (props: MenuProps) => {
    const colors = useContext(AppContext);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [biometria, setBiometria] = useState(false);

    const handleOpenModal = (modalId: string) => {
        setActiveModal(activeModal === modalId ? null : modalId);
    };

    const handleDisableBiometria = () => {
        setBiometria(true);
    }

    const styles = StyleSheet.create({
        Container: {
            flex: 1,
            justifyContent: 'center',
        },
        Header: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 40,
            paddingBottom: 32,
        },
        ContainerTitle: {
            paddingTop: 12,
        },
        ContainerCarrousel: {
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        },
        Title: {
            fontWeight: 'bold',
            fontSize: 18,
        },
        ContainerBottom: {
            flex: 3,
            gap: 16,
            justifyContent: 'flex-start',
            paddingHorizontal: 32,
        },
        ShadowContainer: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.46,
            shadowRadius: 11.14,
        },
        ContainerPressables: {
            flexDirection: 'row',
            height: 72,
            borderRadius: 8,
            elevation: 2,
            backgroundColor: colors.SecondaryBG,
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingHorizontal: 16,
        },
        PressablesText: {
            fontSize: 18,
            fontWeight: 'bold',
            flex: 1,
        },
        RightArrow: {
            marginRight: 8
        }
    });
    return (
        <View style={styles.Container}>
            <View style={styles.ContainerBottom}>
                <View style={styles.ShadowContainer}>
                    <Pressable onPress={() => props.navigation.navigate('Avatarx')}>
                        <View style={styles.ContainerPressables}>
                            <Text style={styles.PressablesText}>Habilitar tema claro</Text>
                            <View style={styles.RightArrow}>
                                <IconRightArrow height={24} width={24} />
                            </View>
                        </View>
                    </Pressable>
                    <DarkAndLigthMode />
                </View>
            </View>
        </View>
    )
}


export default Menu;