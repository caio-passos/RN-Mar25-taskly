import React, { useContext, useState, useEffect, useMemo} from "react";
import { StyleSheet, View, FlatList, Pressable } from "react-native";
import { AppContext } from "../../../App";
import type { CarrouselTypes } from "../../types/carrouselTypes";
import { useThemedIcons } from "./carrouselIcons";

interface CarrouselIconsSize {
    height: number,
    width: number,
    items: CarrouselTypes[];
};

const MenuCarrousel = ({ height, width, items }: CarrouselIconsSize) => {
    const themedIcons = useThemedIcons();

    const iconComponents = useMemo(() => [
        {
            id: "edit",
            icon: <themedIcons.IconEditar height={height} width={width} />,
            onPress: () => { }
        },
        {
            id: "Biometria",
            icon: <themedIcons.IconBiometria height={height} width={width} />,
            onPress: () => { }
        },
        {
            id: "Sair",
            icon: <themedIcons.IconSair height={height} width={width} />,
            onPress: () => { }
        },
        {
            id: "Excluir",
            icon: <themedIcons.IconExcluir height={height} width={width} />,
            onPress: () => { }
        }
    
    ],[height, width, themedIcons]);

    const { colors, darkMode } = useContext(AppContext)!;

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
            backgroundColor: colors.Background
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
                renderItem={({ item }) =>
                    <View>
                        <Pressable
                            onPress={() => {
                                console.log(`Pressed item: ${item.id}`);
                                item.onPress();
                            }}
                        >
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