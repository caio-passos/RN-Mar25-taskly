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
import ReturnLeft from '../../assets/caretLeft.svg';

import { AppContext } from "../../App";
import { RootStackParamList } from "../../types/routingTypes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface ThemeProps {
    setControlTheme: Function
}

const Theme = (props: ThemeProps) => {
    const colors = useContext(AppContext);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [control, setControl] = useState(false);

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
        },
        returnPressable: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
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
        containerBack: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
            paddingBottom: 30,
            backgroundColor: colors.Background,
            zIndex: 1,
        },
        textTerms: {
            fontWeight: 400,
            fontSize: 16,
        },
    });
    return (
        <View style={styles.Container}>
            <View style={styles.containerBack}>
                <Pressable style={styles.returnPressable} onPress={() => props.setControlTheme(false)}>
                    <ReturnLeft width={23} height={17.25} />
                    <View style={styles.boxTextVoltar}>
                        <Text style={styles.textVoltar}>VOLTAR</Text>
                    </View>
                </Pressable>
                <Text style={styles.textTerms}>Preferências</Text>
            </View>

            <View style={styles.ContainerBottom}>
                <View style={styles.ShadowContainer}>
                    <Pressable onPress={() => {
                        setControl(true);
                    }}>
                        <View style={styles.ContainerPressables}>
                            <Text style={styles.PressablesText}>Habilitar tema claro</Text>
                            <View style={styles.RightArrow}>
                                <IconRightArrow height={24} width={24} />
                            </View>
                        </View>
                    </Pressable>
                    {control && <DarkAndLigthMode setControl={setControl} />}
                </View>
            </View>
        </View>
    )
}


export default Theme;