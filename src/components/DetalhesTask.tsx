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
import { View, Text, StyleSheet, BackHandler, TextInput, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import { data } from '../services/db/mockData';
import { TaskTypes, PriorityType } from '../types/taskTypes';
import { useTaskStore, LocalTaskTypes } from '../services/cache/stores/storeZustand';
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
import EditarTask from '../screens/(auth)/Tasks';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/routingTypes';
import AvatarDisplay from './AvatarDisplay';

type DetalhesScreenRouterProp = RouteProp<RootStackParamList, 'DetalhesTask'>;
type DetalhesProps = {
  route: DetalhesScreenRouterProp;
};
const DetalhesTask = ({ route }: DetalhesProps) => {
  const { item } = route.params;
  const navigation = useNavigation();
  console.log('Item at DetalhesTask', item)
  const { colors, darkMode } = useContext(AppContext)!;
  const {
    back: IconBack,
    trash: IconTrash,
    edit: IconEdit,
    editYellow: IconEditYellow,
    checkboxUnchecked: IconCheckboxUnchecked,
    checkboxChecked: IconCheckboxChecked,
    greenArrow: IconGreenArrow

  } = useIcon(['back', 'trash', 'edit', 'editYellow', 'checkboxUnchecked', 'checkboxChecked', 'greenArrow'], darkMode);

  const { deleteTask, updateTask, queueTaskForSync } = useTaskStore.getState(); 

  const [finishTask, setFinishTask] = useState(true);
  const { tasks } = useTaskStore();
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [currentTask, setCurrentTask] = useState<LocalTaskTypes | null>(null); 
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const updateCount = useRef(0);
  const [subtaskRefs, setSubtaskRefs] = useState<RefObject<SwipeableMethods>[]>([]);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState<string>('');
  const [editMode, setEditMode] = useState(false);

  const triggerUpdate = () => setForceUpdate(prev => prev + 1);

  const handleToggleSubtaskStatus = (subtaskId: string) => {
    if (item?.id) {
      updateTask(item.id, (task) => {
        if (task.subtasks) {
          const subtaskIndex = task.subtasks.findIndex(sub => sub.id === subtaskId);
          if (subtaskIndex !== -1) {
            task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;
          }
        }
      });
      queueTaskForSync({
        type: 'update',
        payload: {
          id: item.id,
          data: {
            subtasks: useTaskStore.getState().tasks.find(t => t.id === item.id)?.subtasks?.map(sub =>
              sub.id === subtaskId ? { ...sub, done: !sub.done } : sub
            ) || []
          }
        }
      });
    }
  };

  const handleAddSubtask = () => {
    if (newSubtaskText.trim() && item?.id) {
      const newSubtask = {
        title: newSubtaskText.trim(),
        done: false,
      };
      useTaskStore.getState().addSubtask(item.id, newSubtask);
      const updatedTaskWithNewSubtask = useTaskStore.getState().tasks.find(t => t.id === item.id);
      queueTaskForSync({
        type: 'update',
        payload: {
          id: item.id,
          data: {
            subtasks: updatedTaskWithNewSubtask?.subtasks || []
          }
        }
      });
      setNewSubtaskText('');
      setIsAddingSubtask(false);
      setIsInputFocused(false);
    }
  };

  const handleEditSubtask = (subtask: { id: string; title: string; done: boolean }) => {
    setEditedSubtaskTitle(subtask.title);
    setEditingSubtaskId(subtask.id);
  };

  const saveSubtaskEdit = () => {
    if (editingSubtaskId && editedSubtaskTitle && item?.id) {
      updateTask(item.id, (task) => {
        if (task.subtasks) {
          const subtaskIndex = task.subtasks.findIndex(
            subtask => subtask.id === editingSubtaskId
          );
          if (subtaskIndex !== -1) {
            task.subtasks[subtaskIndex].title = editedSubtaskTitle;
          }
        }
      });
      queueTaskForSync({
        type: 'update',
        payload: {
          id: item.id,
          data: {
            subtasks: useTaskStore.getState().tasks.find(t => t.id === item.id)?.subtasks?.map(sub =>
              sub.id === editingSubtaskId ? { ...sub, title: editedSubtaskTitle } : sub
            ) || []
          }
        }
      });
      setEditingSubtaskId(null);
    }
  };

  const saveEditTask = (id: string, updatedTask: LocalTaskTypes) => { 
    updateTask(id, (task) => { 
      Object.assign(task, updatedTask);
    });
    queueTaskForSync({ type: 'update', payload: { id: id, data: updatedTask } }); 
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


  const renderRightActions = () => {
    const scale = interpolate(sv.value, [0, 100], [0, 1], {
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const handleDeleteTask = () => { 
      if (item?.id) {
        deleteTask(item.id); 
        queueTaskForSync({ type: 'delete', payload: item.id }); 
        swipeRef.current?.close();
        navigation.goBack(); 
      }
    }

    useEffect(() => {
      const updatedTask = tasks.find(t => t.id === item?.id);
      if (updatedTask) {
        setCurrentTask(updatedTask);
      } else {
        setCurrentTask(item as LocalTaskTypes); 
      }
    }, [tasks, item?.id]);

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
      backgroundColor: colors.Background
    },
    tagStyle: {
      backgroundColor: colors.PrimaryLight,
      paddingHorizontal: 4,
      paddingVertical: 4,
      borderRadius: 8,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 41,
      marginHorizontal: 32,
      marginTop: 41,
      backgroundColor: colors.Background
    },
    topBackIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.SecondaryText
    },
    topBarTitle: {
      fontSize: 24,
      fontWeight: 700,
      color: colors.MainText,
    },
    RootContainer: {
      flex: 1,
      marginTop: 40,
      paddingHorizontal: 32,
      backgroundColor: colors.Background
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
      flex: 1,
      paddingTop: 24,
      paddingHorizontal: 32,
      paddingBottom: 15,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: colors.SecondaryBG,
    },
    topEditBar: {
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

        <KeyboardAvoidingView
          behavior='padding'
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <View style={{ flex: 1, backgroundColor: colors.Background }}>
            <View style={styles.topBar}>
              <View style={styles.topBackIcon}>
                <Pressable onPress={navigation.goBack}>
                  <IconBack height={25} width={25} />
                </Pressable>
              </View>
              <View>
                <Text style={styles.topBarTitle}>Taskly</Text>
              </View>
              <AvatarDisplay />

            </View>

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
                      <View style={styles.topEditBar}>
                        <Text style={styles.TitleStyle}>title</Text>
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
                        {item?.priority && (
                          <Text style={styles.PrioridadeTextColor}>
                            {getNomePrioridade(item?.priority)}
                          </Text>
                        )}
                        {!item?.priority && (
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
                          key={subtask.id}
                          ref={subtaskRefs[index]}
                          friction={2}
                          rightThreshold={40}
                          renderRightActions={(progress, dragX) => (
                            <Animated.View style={{ transform: [{ scale: interpolate(sv.value, [0, 100], [0, 1], { extrapolateLeft: Extrapolation.CLAMP, }) }] }}>
                              <RectButton
                                style={{
                                  justifyContent: 'center',
                                  paddingLeft: 26,
                                  paddingRight: 44,
                                  alignItems: 'center',
                                }}
                                onPress={() => {
                                  if (item?.id) {
                                    useTaskStore.getState().deleteSubtask(item.id, subtask.id);
                                    queueTaskForSync({
                                      type: 'update',
                                      payload: {
                                        id: item.id,
                                        data: {
                                          subtasks: useTaskStore.getState().tasks.find(t => t.id === item.id)?.subtasks?.filter(sub => sub.id !== subtask.id) || [] 
                                        }
                                      }
                                    });
                                  }
                                }}>
                                <IconTrash height={40} width={40} />
                              </RectButton>
                            </Animated.View>
                          )}>

                          <View style={styles.subtaskItem}>
                            <View style={styles.SubtaskContentContainer}>
                              <Pressable
                                onPress={() => {
                                  handleToggleSubtaskStatus(subtask.id)
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
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default DetalhesTask;
