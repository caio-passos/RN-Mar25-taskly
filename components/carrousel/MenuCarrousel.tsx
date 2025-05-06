import React, { useContext, useState } from "react";
import { StyleSheet, View, FlatList, Pressable } from "react-native";
import IconEditar from '../../assets/icons/lightmode/carrousel/editarInfo';
import IconBiometria from '../../assets/icons/lightmode/carrousel/mudarBiometria';
import IconSair from '../../assets/icons/lightmode/carrousel/sairConta';
import IconExcluir from '../../assets/icons/lightmode/carrousel/excluirConta';
import { AppContext } from "../../App";
import type { CarrouselTypes } from "../../types/carrouselTypes";

interface CarrouselIconsSize {
    height: number,
    width: number,
    items: CarrouselTypes[];
};

const MenuCarrousel = ({ height, width, items }: CarrouselIconsSize) => {
    const [isSelected, setIsSelected] = useState(false);
    const handleSelection = () => {
        setIsSelected(true);
    };

    const iconComponents = [
        {
            id: "edit",
            icon: <IconEditar height={height} width={width} />,
            onPress: () => { }
        },
        {
            id: "Biometria",
            icon: <IconBiometria height={height} width={width} />,
            onPress: () => { }
        },
        {
            id: "Sair",
            icon: <IconSair height={height} width={width} />,
            onPress: () => { }
        },
        {
            id: "Excluir",
            icon: <IconExcluir height={height} width={width} />,
            onPress: () => { }
        }
    ];

    const colors = useContext(AppContext)!.colors;

    const styles = StyleSheet.create({
        ShadowContainer: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.46,
            shadowRadius: 11.14,
        },

        container: {
            paddingLeft: 32,
            paddingRight: 32,
            elevation: 5,
        },
        boxStyle: {
            backgroundColor: colors.Background,
        },
    });

    return (

        <View style={styles.ShadowContainer}>
            <FlatList
                horizontal
                data={items || iconComponents}
                renderItem=
                {({ item }) =>
                    <View>
                        <Pressable onPress={item.onPress}>
                            {item.icon}
                        </Pressable>
                    </View>
                }
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.container}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}

export default MenuCarrousel;