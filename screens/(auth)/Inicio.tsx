import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import { AppContext } from '../../App';
import ModalCriarTarefas from '../Modal/Criartarefa';
import Tasks from '../../components/Tasks';
import IconFilter from '../../assets/icons/lightmode/filter';
import { data } from '../../services/db/mockData';
import DetalhesTask from '../../components/DetalhesTask';
import type { TaskTypes } from '../../types/taskTypes';
import {
  useAvatarStore,
  useTaskStore,
  useUserStore,
} from '../../services/cache/stores/storeZustand';
import AvatarDisplay from '../../components/AvatarDisplay';

const InicioContent = () => {
<<<<<<< HEAD
  const colors = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCriarTarefa, setModalCriarTarefa] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskTypes | null>(null);
  const [ShowDetalhes, setShowDetalhes] = useState(false);
  const [control, setControl] = useState(false);
  const [controlTheme, setControlTheme] = useState(false);
=======
    const colors = useContext(AppContext)!.colors;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalCriarTarefa, setModalCriarTarefa] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskTypes | null>(null);
    const [ShowDetalhes, setShowDetalhes] = useState(false);
    const [inicioStackOne, setInicioStackOne] = useState(true);
    const [inicioStackTwo, setInicioStackTwo] = useState(false);
>>>>>>> feature/changeTheme

  const { userData } = useUserStore();
  const tasks = useTaskStore(state => state.tasks);

  useEffect(() => {
    console.log('Tasks update: ', tasks.length);
    if (ShowDetalhes && selectedTask) {
      const taskExists = tasks.some(task => task.id === selectedTask.id);
      if (!taskExists) {
        setShowDetalhes(false);
        setSelectedTask(null);
      }
    }
  }, [tasks, selectedTask, ShowDetalhes]);
  console.log('User data:', userData);

<<<<<<< HEAD
  const handleModalOpen = () => {
    setModalVisible(true);
  };
  const handleShowDetalhes = (item: TaskTypes) => {
    setSelectedTask(item);
    setShowDetalhes(true);
  };
  useEffect(() => {
    function backAction() {
      if (modalCriarTarefa) {
        setModalCriarTarefa(false);
        return true;
      }
      if (ShowDetalhes) {
        setShowDetalhes(false);
        setSelectedTask(null);
        return true;
      }
      setControl(false);
      setControlTheme(false);
      return false;
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
=======
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 80,
            paddingHorizontal: 32,
            backgroundColor: colors.Background,
        },
        topBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
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
        IconFilterStyle: {
            paddingTop: 40,
            paddingBottom: 16,
            alignItems: 'flex-end',
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
        containerBack: {
            display: 'flex',
            flexDirection: 'row',
            width: 'auto',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.Background,
            zIndex: 1,
        },
        returnPressable: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.SecondaryText,
            padding: 10,
            borderRadius: 5,
        },
        containerAllMin: {
            position: 'relative',
            bottom: 60,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.containerAllMin}>
                <View style={styles.topBar}>
                    {inicioStackTwo && ShowDetalhes && <View style={styles.containerBack}>
                        <Pressable style={styles.returnPressable} onPress={() => {
                            setInicioStackOne(true);
                            setInicioStackTwo(false);
                            setShowDetalhes(false);
                        }}>
                            <ReturnLeft width={23} height={17.25} />
                        </Pressable>
                    </View>}
                    <Text style={styles.title}>Taskly</Text>
                    <Image source={require('../../assets/icons/lightmode/useravatar.png')} style={{ width: 50, height: 50 }} />
                </View>
                <View style={styles.middleSection}>
                    <View style={styles.TasksStyle}>
                        {!ShowDetalhes && (
                            <View style={styles.IconFilterStyle}>
                                <Pressable onPress={() => { '' }}>
                                    <IconFilter width={24} height={24} />
                                </Pressable>
                            </View>
                        )
                        }
                        {inicioStackTwo && ShowDetalhes && <DetalhesTask item={selectedTask} />}
                        {inicioStackOne && <Tasks
                            onOpenModal={() => setModalCriarTarefa(true)}
                            onOpenDetalhes={handleShowDetalhes}
                            setInicioStackOne={setInicioStackOne}
                            setInicioStackTwo={setInicioStackTwo}
                        />}
                        <ModalCriarTarefas
                            visible={modalCriarTarefa}
                            onClose={() => setModalCriarTarefa(false)}
                        />
                    </View>
                    <View>


                    </View>
                </View>
            </View>
        </View>
>>>>>>> feature/changeTheme
    );

    return () => backHandler.remove();
  }, [modalCriarTarefa, ShowDetalhes]);

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
    IconFilterStyle: {
      paddingTop: 40,
      paddingBottom: 16,
      alignItems: 'flex-end',
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Taskly</Text>
          <AvatarDisplay />
        </View>
        <View style={styles.middleSection}>
          <View style={styles.TasksStyle}>
            {!ShowDetalhes && (
              <View style={styles.IconFilterStyle}>
                <Pressable
                  onPress={() => {
                    ('');
                  }}>
                  <IconFilter width={24} height={24} />
                </Pressable>
              </View>
            )}
            {ShowDetalhes ? (
              <DetalhesTask item={selectedTask} />
            ) : (
              <Tasks
                onOpenModal={() => setModalCriarTarefa(true)}
                onOpenDetalhes={handleShowDetalhes}
              />
            )}
            <ModalCriarTarefas
              visible={modalCriarTarefa}
              onClose={() => setModalCriarTarefa(false)}
            />
          </View>
          <View></View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InicioContent;
