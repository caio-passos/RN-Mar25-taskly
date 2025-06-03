import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  createRef,
  RefObject,
} from 'react';
import { AppContext } from '../../App';
import LongNoFillPressable from './LongNoFillPressable';
import LongPressable from './LongPressable';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { TaskTypes } from '../types/taskTypes';
import { PrioridadeType } from '../types/taskTypes';
import { useTaskStore } from '../services/cache/stores/storeZustand';
import { RectButton } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useIcon } from '../hooks/useIcon';
import EditarTask from '../screens/Modal/EditarTask';

type DetalhesProps = {
  item: TaskTypes | null;
};

const DetalhesTask = ({ item }: DetalhesProps) => {
  const { colors, darkMode } = useContext(AppContext)!;
  const {
    trash: IconTrash,
    edit: IconEdit,
    editYellow: IconEditYellow,
    checkboxUnchecked: IconCheckboxUnchecked,
    checkboxChecked: IconCheckboxChecked,
    greenArrow: IconGreenArrow,
  } = useIcon(['trash', 'edit', 'editYellow', 'checkboxUnchecked', 'checkboxChecked', 'greenArrow'], darkMode);

  const showSubtasks = useTaskStore.getState()
  const handleToggleSubtaskStatus = (subtaskId: string) => {
    useTaskStore.getState().toggleSubtaskStatus(item!.id, subtaskId);
    triggerUpdate();
  };

  const [finishTask, setFinishTask] = useState(true);
  const { tasks } = useTaskStore();
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [currentTask, setCurrentTask] = useState<TaskTypes | null>(null);
  const deleteTask = useTaskStore().deleteTask;
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const updateCount = useRef(0);
  const [subtaskRefs, setSubtaskRefs] = useState<RefObject<SwipeableMethods>[]>([]);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState('');
  const [editMode, setEditMode] = useState(false);



  const triggerUpdate = () => setForceUpdate(prev => prev + 1);

  const generateUniqueId = () => {
    return `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddSubtask = () => {
    if (newSubtaskText.length > 200) {
        return;
    }

    if (newSubtaskText.trim() && item) {
      const newSubtask = {
        id: generateUniqueId(),
        title: newSubtaskText.trim(),
        done: false,
      };

      useTaskStore.getState().addSubtask(item.id, newSubtask);

      setNewSubtaskText('');
      setIsAddingSubtask(false);
      setIsInputFocused(false);
    }
  };

  const handleEditSubtask = (subtask: { id: string; title: string }) => {
    setEditingSubtaskId(subtask.id);
    setEditedSubtaskTitle(subtask.title);
  };

  const saveSubtaskEdit = () => {
    if (editingSubtaskId && editedSubtaskTitle.trim()) {
      (useTaskStore.getState() as any).updateSubtask(item!.id, editingSubtaskId, {
        title: editedSubtaskTitle.trim()
      });
      setEditingSubtaskId(null);
      triggerUpdate();
    }
  };

  const saveEditTask = (id: string, updatedTask: TaskTypes) => {
    useTaskStore.getState().updateTask(id, (task) => {
      Object.assign(task, updatedTask);
    });
    updateCount.current += 1;
    setEditMode(false);
  }

  const handleCancelSubtask = () => {
    setNewSubtaskText('');
    setIsAddingSubtask(false);
  };

  const handleResolveTask = useCallback(() => {
    if (swipeRef.current) {
      swipeRef.current.openRight();
    }
    setFinishTask(true);
  }, []);


  const swipeRef = useRef<SwipeableMethods>(null);
  const sv = useSharedValue(50);

  const renderRightActionsSubtask = (
    progress: Animated.SharedValue<number>,
    dragX: Animated.SharedValue<number>,
    subtaskId: string
  ) => {
    const scale = interpolate(sv.value, [0, 100], [0, 1], {
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const handleDeleteSubtask = () => {
      if (item?.id) {
        useTaskStore.getState().deleteSubtask(item.id, subtaskId)
      }
    };

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <RectButton
          style={{
            justifyContent: 'center',
            paddingLeft: 26,
            paddingRight: 44,
            alignItems: 'center',
          }}
          onPress={handleDeleteSubtask}>
          <IconTrash height={40} width={40} />
        </RectButton>
      </Animated.View>
    );
  };
  const renderRightActions = () => {
    const scale = interpolate(sv.value, [0, 100], [0, 1], {
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const handleDeleteTask = () => {
      if (item?.id) {
        deleteTask(item.id);
        swipeRef.current?.close();
      }
    }
    //force update para as tasks
    useEffect(() => {
      const updatedTask = tasks.find(t => t.id === item?.id);
      if (updatedTask) {
        setCurrentTask(updatedTask);
      } else {
        setCurrentTask(item);
      }
    }, [tasks, item?.id]);

    //refs para todas as tasks
    useEffect(() => {
      const validSubtaskRefs = currentTask?.Subtask?.map(() =>
        createRef<SwipeableMethods>() as React.RefObject<SwipeableMethods>
      ) || [];
      setSubtaskRefs(validSubtaskRefs);
    }, [currentTask?.Subtask]);

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <RectButton
          style={{
            justifyContent: 'center',
            paddingLeft: 26,
            paddingRight: 44,
            alignItems: 'center',
          }}
          onPress={handleDeleteTask}>
          <IconTrash height={40} width={40} />
        </RectButton>
      </Animated.View>
    );
  };
  const getNomePrioridade = (priority?: PrioridadeType) => {
    switch (priority) {
      case 'baixa':
        return 'Baixa';
      case 'média':
        return 'Média';
      case 'alta':
        return 'Alta';
      default: return 'Não definida';
    }
  };

  const getCorPrioridade = (priority?: PrioridadeType) => {
    switch (priority) {
      case 'baixa':
        return colors.SecondaryAccent;
      case 'média':
        return colors.Warning;
      case 'alta':
        return colors.Error;
      default:
        return undefined;
    }
  };

  const styles = StyleSheet.create({
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tagStyle: {
      backgroundColor: colors.PrimaryLight,
      paddingHorizontal: 4,
      paddingVertical: 4,
      borderRadius: 8,
    },
    RootContainer: {
      marginTop: 40,
    },
    ShadowContainer: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.46,
      shadowRadius: 11.14,
    },
    ContentContainer: {
      paddingTop: 24,
      paddingHorizontal: 22,
      paddingBottom: 15,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: colors.SecondaryBG,
      width: '100%',
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    ContentContainerSubtasks: {
      marginBottom: 18,
      paddingHorizontal: 32,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: colors.SecondaryBG,
    },
    SubtaskContentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: colors.SecondaryBG,
    },
    subtaskTitle: {
      color: colors.MainText,
      textAlign: 'left',
      width: '78%'
      
    },
    TaskStyle: {
      color: colors.MainText,
      fontSize: 17,
      fontWeight: 600,
      paddingBottom: 16,
    },
    TitleStyle: {
      fontWeight: 500,
      fontSize: 16,
      color: colors.SecondaryText,
    },
    ColorText: {
      color: colors.MainText,
    },
    DescriçãoStyle: {
      paddingBottom: 16,
    },
    TagsStyle: {
      paddingBottom: 16,
    },
    PrioridadeTextColor: {
      backgroundColor: colors.SecondaryAccent,
      width: 45,
      height: 27,
      textAlign: 'center',
      textAlignVertical: 'center',
      borderRadius: 8,
      opacity: 0.8,
      color: colors.SecondaryBG,
    },
    SubtaskContainer: {
      marginTop: 24,
    },
    SubtaskListContainer: {
      paddingTop: 16,
      borderRadius: 8,
      marginTop: 16,
    },
    subtaskInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.SecondaryBG,
      borderRadius: 8,
    },
    subtaskInput: {
      textAlign: 'left',
      textAlignVertical: 'bottom',
      paddingHorizontal: 26,
      borderRadius: 6,
      borderBottomColor: colors.Primary,
      color: colors.MainText
    },
    inlineSubtaskEdit: {
      flex: 1,
      justifyContent: 'flex-start',
      borderBottomWidth: 1,
      marginLeft: 10,
      borderBottomColor: colors.Primary,
      color: colors.MainText,
      padding: 0,
    },
    subtaskInputActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    actionButtonText: {
      color: colors.Primary,
      fontWeight: '600',
    },
    subtaskItem: {
      marginBottom: 12,
      borderRadius: 8,
      backgroundColor: colors.Background,
    },
    subtaskItemLast: {
      marginBottom: 0,
    },
    fixedButtonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
    },
    addButton: {
      justifyContent: 'center',
      width: '100%',
      height: 30,
    },
  });


  const renderSubtaskInput = () => {
    if (!isAddingSubtask) return null;
    return (
      <View style={styles.ContentContainerSubtasks}>
        <View style={styles.ShadowContainer}>
          <View style={styles.subtaskInputContainer}>
            <TextInput
              placeholder="Digite sua subtask"
              value={newSubtaskText}
              onChangeText={setNewSubtaskText}
              style={styles.subtaskInput}
              underlineColorAndroid="transparent"
              autoFocus={true}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {
                if (isInputFocused) {
                  setTimeout(() => {
                    if (newSubtaskText.trim()) {
                      handleAddSubtask();
                    } else {
                      handleCancelSubtask();
                    }
                  }, 100);
                }
              }}
              onSubmitEditing={(e) => {
                e.preventDefault();
                handleAddSubtask();
              }}
            />
            <Pressable onPress={() => handleAddSubtask()}>
              <IconGreenArrow height={25} width={25} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {editMode && (
          <EditarTask
            visible={editMode}
            task={item!}
            onSave={(id, editedTask) => {
              saveEditTask(id, editedTask);
              triggerUpdate()
            }}
            onCancel={() => setEditMode(false)}
          />

      )}

      {!editMode && (

        <View style={{ flex: 1 }}>
          <GestureHandlerRootView>
            <ScrollView
              style={styles.RootContainer}
              contentContainerStyle={{ paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              indicatorStyle='black'
            >

              <Swipeable
                ref={swipeRef}
                friction={2}
                rightThreshold={40}
                renderRightActions={renderRightActions}
                onSwipeableOpen={direction => {
                  console.log('Swiped', direction);
                }}
                containerStyle={{ paddingVertical: 5, paddingHorizontal: 3 }}>

                <View style={styles.ShadowContainer}>
                  <View style={styles.ContentContainer}>
                    <View style={styles.topBar}>
                      <Text style={styles.TitleStyle}>Título</Text>
                      <Pressable onPress={() => setEditMode(true)}>
                        <IconEditYellow height={25} width={25} />
                      </Pressable>
                    </View>
                    <Text style={styles.TaskStyle}>{item?.Task}</Text>

                    <View style={styles.DescriçãoStyle}>
                      <Text style={[styles.ColorText, styles.TitleStyle]}>Descrição</Text>
                      <Text style={styles.ColorText}>{item?.Descricao}</Text>
                    </View>

                    <View style={styles.TagsStyle}>
                      <Text style={[styles.ColorText, styles.TitleStyle]}>Tags</Text>
                      <View style={styles.tagsContainer}>
                        {item?.Tags?.map((tag, index) => (
                          <Text key={index} style={styles.tagStyle}>
                            {tag.toUpperCase()}
                          </Text>
                        ))}
                      </View>
                    </View>

                    <View>
                      <Text style={[styles.ColorText, styles.TitleStyle]}>Prioridade</Text>
                      {item?.Prioridade && (
                        <Text style={styles.PrioridadeTextColor}>
                          {getNomePrioridade(item?.Prioridade).toUpperCase()}
                        </Text>
                      )}
                      {!item?.Prioridade && (
                        <Text style={{ color: 'gray' }}>Não definida</Text>
                      )}
                      <LongNoFillPressable
                        textProps="RESOLVER TAREFA"
                        onPress={handleResolveTask}
                        style={{
                          paddingHorizontal: 32,
                          width: '100%',
                          height: 32,
                          marginTop: 16,
                          marginBottom: 16,
                          justifyContent: 'center',
                          borderWidth: 2,
                          borderColor: colors.Primary,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Swipeable>
              <View style={styles.SubtaskContainer}>
                {currentTask?.Subtask && currentTask.Subtask.length > 0 && (
                  <View style={styles.SubtaskListContainer}>
                    {currentTask.Subtask.map((subtask, index) => (
                      <Swipeable
                        key={subtask.id || `subtask-${index}`}
                        ref={subtaskRefs[index]} //referenciar o index certo
                        friction={2}
                        rightThreshold={40}
                        renderRightActions={(progress, dragX) =>
                          renderRightActionsSubtask(progress, dragX, subtask.id || `subtask-${index}`)
                        }>

                        <View style={styles.subtaskItem}>
                          <View style={styles.SubtaskContentContainer}>
                            <Pressable
                              onPress={() => {
                                handleToggleSubtaskStatus(subtask.id)
                                //ambos funcionam
                                if (!subtask.done) {
                                  subtaskRefs[index]?.current?.openRight();
                                }
                              }}>
                              <View>
                                {subtask.done ?
                                  <IconCheckboxChecked height={25} width={25} />
                                  :
                                  <IconCheckboxUnchecked height={25} width={25} />
                                }
                              </View>

                            </Pressable>
                            {editingSubtaskId === subtask.id ? (
                              <TextInput
                                value={editedSubtaskTitle}
                                onChangeText={setEditedSubtaskTitle}
                                onBlur={saveSubtaskEdit}
                                placeholderTextColor={colors.MainText}
                                onSubmitEditing={saveSubtaskEdit}
                                autoFocus
                                style={styles.inlineSubtaskEdit}
                              />
                            ) : (
                              <Text style={styles.subtaskTitle}>{subtask.title}</Text>
                            )}

                            <Pressable onPress={() => handleEditSubtask(subtask)}>
                              <IconEdit height={25} width={25} />
                            </Pressable>
                          </View>
                        </View>
                      </Swipeable>
                    ))}
                  </View>
                )}
              </View>
              {renderSubtaskInput()}
              <View style={styles.fixedButtonContainer}>
                <LongPressable
                  textProps="ADICIONAR SUBTASK"
                  onPress={() => {
                    setIsAddingSubtask(true);
                    setIsInputFocused(true);
                  }}
                  style={styles.addButton}
                  textStyle={{ color: 'white' }}
                />
              </View>
            </ScrollView>
          </GestureHandlerRootView>
        </View>

      )}
    </>
  );
};

export default DetalhesTask;
