import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { AppContext } from "../../App";
import { } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NoTasks from "../../assets/icons/darkmode/nocontent";
import ModalCriarTarefas from "../Modal/Criartarefa";
import Tasks from "../../components/Tasks";
import IconFilter from "../../assets/icons/lightmode/filter";

const InicioContent = () => {
    const colors = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false);

    const handleModalOpen = () => {
        setModalVisible(true);
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            bottom: 60,
            paddingTop: 80,
            paddingHorizontal: 32,
            backgroundColor: colors.Background,
        },
        topBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            fontSize: 32,
            fontWeight: '700',
            color: colors.MainText,
        },
        middleSection: {
            justifyContent: 'center',
        },
        TasksStyle: {
            height: '100%',
            paddingTop: 10,
        },
        IconFilterStyle:{
            paddingTop: 40,
            paddingBottom: 16,
            alignItems: 'flex-end',
        },
        svgNoTasks: {
            alignItems: 'center',
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
            <View style={styles.topBar}>
                <Text style={styles.title}>Taskly</Text>
                <Image source={require('../../assets/icons/lightmode/useravatar.png')} style={{ width: 50, height: 50 }} />
            </View>
            <View style={styles.middleSection}>
                <View style={styles.TasksStyle}>
                    <View style={styles.IconFilterStyle}>
                        <Pressable onPress={()=> {''}}>
                            <IconFilter width={24} height={24} />
                        </Pressable>
                    </View>
                    <Tasks />
                </View>
                {/* <View style={styles.svgNoTasks}>
                    <NoTasks height={173} width={259} />
                </View> */}
                <View>
                    {/* <Pressable onPress={ handleModalOpen}>
                        <View style={styles.buttonFilled}>
                            <Text style={styles.buttonTextCriarTarefa}>Criar Tarefa</Text>
                        </View>
                    </Pressable> */}
                    <ModalCriarTarefas
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />

                </View>
            </View>
        </View>
    );
}

export default InicioContent;