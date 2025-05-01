import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import MenuCarrousel from "../../components/carrousel/MenuCarrousel";
import IconEditar from '../../assets/icons/lightmode/carrousel/editarInfo';
import IconBiometria from '../../assets/icons/lightmode/carrousel/mudarBiometria';
import IconSair from '../../assets/icons/lightmode/carrousel/sairConta';
import IconExcluir from '../../assets/icons/lightmode/carrousel/excluirConta';

const Menu = () => {
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
        ContainerCarrousel: {
            flex: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        },
    });
    return (
        <View style={styles.Container}>
            <View style={styles.Header}>
                <Image source={require("../../assets/icons/lightmode/useravatar.png")}
                    style={{ width: 150, height: 150 }} />
                <Text>Rafaela Santos</Text>
                <Text>rafaela.santos@compasso.com.br</Text>
                <Text>(81) 98650 - 9240</Text>
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
                ]}/>
            </View>
        </View>
    )
}


export default Menu;