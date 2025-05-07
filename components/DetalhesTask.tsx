import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  createRef,
  RefObject
} from 'react';
import { AppContext } from '../App';
import LongNoFillPressable from './LongNoFillPressable';
import LongPressable from './LongPressable';
import { View, Text, StyleSheet, BackHandler, TextInput, Pressable, ScrollView } from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';

type DetalhesProps = {
  item: TaskTypes | null;
};

const DetalhesTask = ({ item }: DetalhesProps) => {


  const showSubtasks = useTaskStore.getState()
  const handleToggleSubtaskStatus = (subtaskId: string) => {
    useTaskStore.getState().toggleSubtaskStatus(item!.id, subtaskId);
    triggerUpdate();
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
  const [forceUpdate, setForceUpdate] = useState(0);
  const [subtaskRefs, setSubtaskRefs] = useState<React.RefObject<SwipeableMethods>[]>([]);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editedSubtaskTitle, setEditedSubtaskTitle] = useState('');


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
      useTaskStore.getState().updateSubtask(item!.id, editingSubtaskId, {
        title: editedSubtaskTitle.trim()
      });
      setEditingSubtaskId(null);
      triggerUpdate();
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
    const colors = useContext(AppContext)!.colors;
    const [finishTask, setFinishTask] = useState(true);
    const [addSubtask, setAddSubtask] = useState(false);
    const [updatedSubtask, setUpdatedSubtask] = useState('');
    const swipeActive = useSharedValue(false);

    const handleFinishTask = () => {
        setFinishTask(true)
    };
    const handleAddSubtask = () => {
        setAddSubtask(true);
    };

    const swipeRef = useRef<SwipeableMethods>(null);
    const translateX = useSharedValue(0);
    const sv = useSharedValue(50);

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

  // const colors = useContext(AppContext); merge
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
      marginBottom: 18,
      flexDirection: 'column',
    },
    subtaskInput: {
      paddingHorizontal: 26,
      borderBottomColor: colors.Primary,
    },
    inlineSubtaskEdit: {
      flex: 1,
      borderBottomWidth: 1,
      borderBottomColor: colors.Primary,
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
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <GestureHandlerRootView>
      <ScrollView style={styles.RootContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
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

      </ScrollView>
      <View style={{ height: 20 }} />
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

    </GestureHandlerRootView>
    </SafeAreaView>

  );
};

export default DetalhesTask;