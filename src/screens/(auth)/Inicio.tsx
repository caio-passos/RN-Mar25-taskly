import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  BackHandler,
  KeyboardAvoidingView
} from 'react-native';
import { AppContext } from '../../../App';
import ModalCriarTarefas from '../Modal/Criartarefa';
import Tasks from '../../components/Tasks';
import DetalhesTask from '../../components/DetalhesTask';
import type { TaskTypes } from '../../types/taskTypes';
import { useTaskStore } from '../../services/cache/stores/storeZustand';
import AvatarDisplay from '../../components/AvatarDisplay';
import FilterModal from '../Modal/Filter';
import { TaskFilters } from '../../types/taskTypes';
import { filterTasks } from '../../services/filterTasks';
import { getThemedIcon } from '../../services/IconService';
import { useUserStore } from '../../services/cache/stores/storeZustand';

const InicioContent = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCriarTarefa, setModalCriarTarefa] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskTypes | null>(null);
  const [ShowDetalhes, setShowDetalhes] = useState(false);
  const [control, setControl] = useState(false);
  const [controlTheme, setControlTheme] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});
  const tasks = useTaskStore(state => state.tasks);

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, filters);
  }, [tasks, filters]);

  const handleApplyFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    setFilterVisible(false);
  };
  const handleClearFilters = () => {
    setFilters({});
  };

  useEffect(() => {
    console.log('Tasks update: ', tasks.length);
    if (ShowDetalhes && selectedTask) {
      const updatedTask = tasks.find(task => task.id === selectedTask.id);
      if (!updatedTask) {
        setShowDetalhes(false);
        setSelectedTask(null);
      } else if (updatedTask !== selectedTask) {
        setSelectedTask(updatedTask);
      }
    }
  }, [tasks, selectedTask, ShowDetalhes]);

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
    );

    return () => backHandler.remove();
  }, [modalCriarTarefa, ShowDetalhes]);

  const { colors, darkMode } = useContext(AppContext)!;
  const isDarkMode = useUserStore(state => state.userData?.theme);
  const styles = StyleSheet.create({
    backgroundFixer: {
      backgroundColor: colors.Background,
      zIndex: -1000,
      height: '100%',
    },
    container: {
      flex: 1,
      bottom: 60,
      paddingTop: 80,
      paddingHorizontal: 27,
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
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
      <View style={styles.backgroundFixer}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            {ShowDetalhes && null}
            <Text style={styles.title}>Taskly</Text>
            <AvatarDisplay />
          </View>
          <View style={styles.middleSection}>
            <View style={styles.TasksStyle}>
              {!ShowDetalhes && (
                <View style={styles.IconFilterStyle}>
                  <Pressable
                    onPress={() => setFilterVisible(true)}>
                    {React.createElement(getThemedIcon('filter', isDarkMode), { width: 24, height: 24 })}
                  </Pressable>
                  <FilterModal
                    visible={filterVisible}
                    onClose={() => setFilterVisible(false)}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                  />
                </View>
              )}
              {ShowDetalhes ? (
                <DetalhesTask item={selectedTask} />
              ) : (
                <Tasks
                  tasks={filteredTasks}
                  onOpenModal={() => setModalCriarTarefa(true)}
                  onOpenDetalhes={handleShowDetalhes}
                />
              )}
              <ModalCriarTarefas
                visible={modalCriarTarefa}
                onClose={() => setModalCriarTarefa(false)}
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InicioContent;
