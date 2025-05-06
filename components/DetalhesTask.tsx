import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { AppContext } from '../App';
import LongNoFillPressable from './LongNoFillPressable';
import LongPressable from './LongPressable';
import { View, Text, StyleSheet, BackHandler, TextInput, Pressable } from 'react-native';
import { data } from '../services/db/mockData';
import { TaskTypes } from '../types/taskTypes';
import { PrioridadeType } from '../types/taskTypes';
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
import IconTrash from '../assets/icons/lightmode/trash';
import IconEdit from '../assets/icons/lightmode/pencil';
import IconCheckboxUnchecked from '../assets/icons/lightmode/uncheckedcircle';
import IconCheckboxChecked from '../assets/icons/lightmode/checkedcircle';

type DetalhesProps = {
  item: TaskTypes | null;
};

const DetalhesTask = ({ item }: DetalhesProps) => {


  const showSubtasks = useTaskStore.getState()
  const handleToggleSubtaskStatus = (subtaskId: string) => {
    useTaskStore.getState().toggleSubtaskStatus(item!.id, subtaskId);
  };

  const [finishTask, setFinishTask] = useState(true);
  const [updatedSubtask, setUpdatedSubtask] = useState('');
  const swipeActive = useSharedValue(false);
  const addSubtaskToStore = useTaskStore(state => state.addSubtask);
  const { tasks } = useTaskStore();
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [subtaskChecked, setSubtaskChecked] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskTypes | null>(null);
  const deleteTask = useTaskStore().deleteTask;
  const deleteSubtask = useTaskStore().deleteSubtask;
  const [isInputFocused, setIsInputFocused] = useState(false);

  const generateUniqueId = () => {
    return `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };


  const handleSubtaskCheck = () => {
    setSubtaskChecked(!subtaskChecked);
  };

  const handleAddSubtask = () => {
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
  const handleDeleteSubtask = (subtaskId: string) => {
    if (item?.id) {
      useTaskStore.getState().deleteSubtask(item.id, subtaskId);
    }
  };


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

  useEffect(() => {
    if (item) {
      setCurrentTask(item);
    }
  }, [item]);


  const swipeSubtaskRef = useRef<SwipeableMethods>(null);
  const swipeRef = useRef<SwipeableMethods>(null);
  const translateX = useSharedValue(0);
  const sv = useSharedValue(50);

  const renderRightActionsSubtask = (
    progress: SharedValue<number>,
    dragX: SharedValue<number>,
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

  const renderRightActions = (
    progress: SharedValue<number>,
    dragX: SharedValue<number>,
  ) => {
    const scale = interpolate(sv.value, [0, 100], [0, 1], {
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const handleDeleteTask = () => {
      if (item?.id) {
        deleteTask(item.id);
        swipeRef.current?.close();

      }
    }

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

  const colors = useContext(AppContext);
  const getCorPrioridade = (priority?: PrioridadeType) => {
    switch (priority) {
      case 'baixa':
        return colors.SecondaryAccent;
      case 'média':
        return 'Yellow';
      case 'alta':
        return 'Red';
      default:
        return null;
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
      paddingTop: 40,
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
      justifyContent: 'center',
    },
    TaskStyle: {
      fontSize: 18,
      fontWeight: 600,
      paddingBottom: 16,
    },
    TitleStyle: {},
    DescriçãoStyle: {
      paddingBottom: 16,
    },
    TagsStyle: {
      paddingBottom: 16,
    },
    PrioridadeTextColor: {
      backgroundColor: getCorPrioridade(item?.Prioridade),
      width: 45,
      height: 27,
      textAlign: 'center',
      textAlignVertical: 'center',
      borderRadius: 8,
    },
    SubtaskContainer: {
    },
    SubtaskListContainer: {
      paddingTop: 16,
      borderRadius: 8,
      marginTop: 16,
    },
    subtaskInputContainer: {
      backgroundColor: colors.SecondaryBG,
      borderRadius: 8,
      marginBottom: 10,
      flexDirection: 'column',
    },
    subtaskInput: {
      borderBottomWidth: 1,
      borderBottomColor: colors.Primary,
      marginBottom: 16,
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
  });


  const renderSubtaskInput = () => {
    if (!isAddingSubtask) return null;

    return (
      <View style={styles.subtaskInputContainer}>
        <TextInput
          placeholder="Digite sua subtask"
          value={newSubtaskText}
          onChangeText={setNewSubtaskText}
          style={styles.subtaskInput}
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
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.RootContainer}>
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
              <Text style={styles.TitleStyle}>Título</Text>
              <Text style={styles.TaskStyle}>{item?.Task}</Text>

              <View style={styles.DescriçãoStyle}>
                <Text>Descrição</Text>
                <Text>{item?.Descricao}</Text>
              </View>

              <View style={styles.TagsStyle}>
                <Text>Tags</Text>
                <View style={styles.tagsContainer}>
                  {item?.Tags?.map((tag, index) => (
                    <Text key={index} style={styles.tagStyle}>
                      {tag}
                    </Text>
                  ))}
                </View>
              </View>

              <View>
                <Text>Prioridade</Text>
                {item?.Prioridade && (
                  <Text style={styles.PrioridadeTextColor}>
                    {getCorPrioridade(item?.Prioridade)}
                  </Text>
                )}
                {!item?.Prioridade && (
                  <Text style={{ color: 'gray' }}>Não definida</Text>
                )}
                <View>
                  <LongNoFillPressable
                    textProps="RESOLVER TAREFA"
                    onPress={handleResolveTask}
                    style={{
                      paddingHorizontal: 32,
                      width: '100%',
                      marginBottom: 16,
                      justifyContent: 'center',
                    }}
                  />
                </View>
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
                  ref={swipeSubtaskRef}
                  friction={2}
                  rightThreshold={40}
                  renderRightActions={(progress, dragX) =>
                    renderRightActionsSubtask(progress, dragX, subtask.id || `subtask-${index}`)
                  }>

                  <View style={styles.subtaskItem}>
                    <View style={styles.SubtaskContentContainer}>
                      <Pressable onPress={() => {
                        handleToggleSubtaskStatus(subtask.id)
                        }}>
                        <View>
                          {subtask.done ?
                            <IconCheckboxChecked height={25} width={25} />
                            :
                            <IconCheckboxUnchecked height={25} width={25} />
                          }
                        </View>

                      </Pressable>
                      <Text style={styles.subtaskTitle}>{subtask.title}</Text>
                      <View>
                        <IconEdit height={25} width={25} />
                      </View>
                    </View>
                  </View>
                </Swipeable>
              ))}
            </View>
          )}
        </View>
        {renderSubtaskInput()}
        <LongPressable
          textProps="ADICIONAR SUBTASK"
          onPress={() => {
            setIsAddingSubtask(true);
            setIsInputFocused(true);
          }}
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            width: '100%',
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default DetalhesTask;