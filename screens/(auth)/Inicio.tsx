import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AppContext } from "../../App";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();


function InicioContent() {
    const colors = React.useContext(AppContext);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: colors.Background,
        },
        buttonFilled: {
            backgroundColor: colors.Primary,
            borderRadius: 8,
            width: '100%',
            height: 47,
            justifyContent: 'center',
            marginTop: 25,
        },
        buttonTextCriarTarefa: {
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.container}>
            <Text>Taskly</Text>
            <View>
                <Pressable>
                    <View style={styles.buttonFilled}>
                        <Text style={styles.buttonTextCriarTarefa}>Criar Tarefa</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

export default InicioContent;