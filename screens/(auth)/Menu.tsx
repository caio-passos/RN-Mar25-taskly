import React, { useContext } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import MenuCarrousel from "../../components/carrousel/MenuCarrousel";
import IconEditar from '../../assets/icons/lightmode/carrousel/editarInfo';
import IconBiometria from '../../assets/icons/lightmode/carrousel/mudarBiometria';
import IconSair from '../../assets/icons/lightmode/carrousel/sairConta';
import IconExcluir from '../../assets/icons/lightmode/carrousel/excluirConta';
import IconRightArrow from '../../assets/icons/lightmode/rightArrow'

import { AppContext } from "../../App";

const Menu = () => {
    const colors = useContext(AppContext);

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
            flex: 1,
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
            flex:1,
        },
        RightArrow:{
            marginRight: 8
        }
    });
    return (
        <View style={styles.Container}>
            <View style={styles.Header}>
                <Image source={require("../../assets/icons/lightmode/useravatar.png")}
                    style={{ width: 150, height: 150 }} />
                <View style={styles.ContainerTitle}>
                    <Text style={styles.Title}>Rafaela Santos</Text>
                </View>
                <View>
                    <Text>rafaela.santos@compasso.com.br</Text>
                </View>
                <View>
                    <Text>(81) 98650 - 9240</Text>
                </View>
            </View>
            <View style={styles.ContainerCarrousel}>
                <MenuCarrousel
                    height={131}
                    width={134}
                    items={[
                        {
                            id: "Edit",
                            icon: <IconEditar height={131} width={134} />,
                            onPress: () => { }
                        },
                        {
                            id: "Biometria",
                            icon: <IconBiometria height={131} width={134} />,
                            onPress: () => { }
                        },
                        {
                            id: "Sair",
                            icon: <IconSair height={131} width={134} />,
                            onPress: () => { }
                        },
                        {
                            id: "Excluir",
                            icon: <IconExcluir height={131} width={134} />,
                            onPress: () => { }
                        }
                    ]} />
            </View>
            <View style={styles.ContainerBottom}>
                <View style={styles.ShadowContainer}>
                    <View style={styles.ContainerPressables}>
                        <Text style={styles.PressablesText}>Preferências</Text>
                        <View style={styles.RightArrow}>
                            <IconRightArrow height={24} width={24} />
                        </View>
                    </View>

                </View>
                <View style={styles.ShadowContainer}>
                    <View style={styles.ContainerPressables}>
                        <Text style={styles.PressablesText}>Termos e regulamentos</Text>
                            <View style={styles.RightArrow}>
                                <IconRightArrow height={24} width={24} />
                            </View>
                    </View>
                </View>


            </View>

        </View>
    )
}


export default Menu;