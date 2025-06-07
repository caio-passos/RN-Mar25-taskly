import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  createRef,
  RefObject,
} from 'react';
import { AppContext } from '../App';
import LongNoFillPressable from './LongNoFillPressable';
import LongPressable from './LongPressable';
import { View, Text, StyleSheet, BackHandler, TextInput, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import { data } from '../services/db/mockData';
import { TaskTypes } from '../types/taskTypes';
import { PriorityType } from '../types/taskTypes';
import { useTaskStore } from '../services/cache/stores/storeZustand';
import { RectButton } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useIcon } from '../hooks/useIcon';
import EditarTask from '../screens/Modal/EditarTask';
import {useNavigation, RouteProp} from '@react-navigation/native';
import { RootStackParamList } from '../types/routingTypes';

type DetalhesScreenRouterProp = RouteProp<RootStackParamList, 'DetalhesTask'>;
type DetalhesProps = {
  route: DetalhesScreenRouterProp;
};
const DetalhesTask = ({ route }: DetalhesProps) => {
  const {item} = route.params;
  const navigation = useNavigation();
  console.log('Item at DetalhesTask', item)
  const { colors, darkMode } = useContext(AppContext)!;
  const {
    trash: IconTrash,
    edit: IconEdit,
    editYellow: IconEditYellow,
    checkboxUnchecked: IconCheckboxUnchecked,
    checkboxChecked: IconCheckboxChecked,
    greenArrow: IconGreenArrow

  } = useIcon(['trash', 'edit', 'editYellow', 'checkboxUnchecked', 'checkboxChecked', 'greenArrow'], darkMode);

  const showSubtasks = useTaskStore.getState()
  const handleToggleSubtaskStatus = (subtaskId: string) => {
    useTaskStore.getState().toggleSubtaskStatus(item!.id!, subtaskId);
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
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState<string>('');
  const [editMode, setEditMode] = useState(false);



  const triggerUpdate = () => setForceUpdate(prev => prev + 1);

  const generateUniqueId = () => {
    return `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddSubtask = () => {
    if (newSubtaskText.trim() && item) {
      const newSubtask = {
        id: generateUniqueId(),
        title: newSubtaskText.trim(),
        done: false,
      };

      useTaskStore.getState().addSubtask(item.id!, newSubtask);

      setNewSubtaskText('');
      setIsAddingSubtask(false);
      setIsInputFocused(false);
    }
  };

  const handleEditSubtask = (subtask: { title: string; done: boolean }) => {
    setEditingSubtaskId(subtask.title);
    setEditedSubtaskTitle(subtask.title);
  };

  const saveSubtaskEdit = () => {
    if (editingSubtaskId && editedSubtaskTitle) {
      (useTaskStore.getState() as any).updateSubtask(item!.id, editingSubtaskId, {
        title: editedSubtaskTitle
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
      const validSubtaskRefs = currentTask?.subtasks?.map(() =>
        createRef<SwipeableMethods>() as React.RefObject<SwipeableMethods>
      ) || [];
      setSubtaskRefs(validSubtaskRefs);
    }, [currentTask?.subtasks]);

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
  const getNomePrioridade = (priority?: PriorityType) => {
    switch (priority) {
      case 1:
        return 'Baixa';
      case 2:
        return 'Média';
      case 3:
        return 'Alta';
      default: return 'Não definida';
    }
  };

  const getCorPrioridade = (priority?: PriorityType) => {
    switch (priority) {
      case 1:
        return colors.SecondaryAccent;
      case 2:
        return colors.Warning;
      case 3:
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
      paddingHorizontal: 32,
      paddingBottom: 15,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: colors.SecondaryBG,
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
      paddingHorizontal: 30,
      paddingTop: 24,
      paddingBottom: 15,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: colors.SecondaryBG,
    },
    subtaskTitle: {
      color: colors.MainText
    },
    TaskStyle: {
      color: colors.MainText,
      fontSize: 18,
      fontWeight: 600,
      paddingBottom: 16,
    },
    TitleStyle: {
      fontSize: 20,
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
      backgroundColor: getCorPrioridade(item?.priority),
      width: 45,
      height: 27,
      textAlign: 'center',
      textAlignVertical: 'center',
      borderRadius: 8,
      opacity: 0.8,
      color: colors.MainText
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
      paddingHorizontal: 32,
    },
    addButton: {
      justifyContent: 'center',
      width: '100%',
      height: 50,
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
                }}>

                <View style={styles.ShadowContainer}>
                  <View style={styles.ContentContainer}>
                    <View style={styles.topBar}>
                      <Pressable onPress={navigation.goBack}>
                        <IconEditYellow height={25} width={25} />
                      </Pressable>
                      <Text style={styles.TitleStyle}>{item?.title}</Text>
                      <Pressable onPress={() => setEditMode(true)}>
                        <IconEditYellow height={25} width={25} />
                      </Pressable>
                    </View>
                    <Text style={styles.TaskStyle}>{item?.title}</Text>

                    <View style={styles.DescriçãoStyle}>
                      <Text style={styles.ColorText}>Descrição</Text>
                      <Text style={styles.ColorText}>{item?.description}</Text>
                    </View>

                    <View style={styles.TagsStyle}>
                      <Text style={styles.ColorText}>Tags</Text>
                      <View style={styles.tagsContainer}>
                        {item?.tags?.map((tag, index) => (
                          <Text key={index} style={styles.tagStyle}>
                            {tag}
                          </Text>
                        ))}
                      </View>
                    </View>

                    <View>
                      <Text style={styles.ColorText}>Prioridade</Text>
                      {item?.priority&& (
                        <Text style={styles.PrioridadeTextColor}>
                          {getNomePrioridade(item?.priority)}
                        </Text>
                      )}
                      {!item?.priority&& (
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
                {currentTask?.subtasks && currentTask.subtasks.length > 0 && (
                  <View style={styles.SubtaskListContainer}>
                    {currentTask.subtasks.map((subtask, index) => (
                      <Swipeable
                        key={subtask.title || `subtask-${index}`}
                        ref={subtaskRefs[index]} 
                        friction={2}
                        rightThreshold={40}
                        renderRightActions={(progress, dragX) =>
                          renderRightActionsSubtask(progress, dragX, subtask.title || `subtask-${index}`)
                        }>

                        <View style={styles.subtaskItem}>
                          <View style={styles.SubtaskContentContainer}>
                            <Pressable
                              onPress={() => {
                                handleToggleSubtaskStatus(subtask.title)
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
                            {editingSubtaskId === subtask.title ? (
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
