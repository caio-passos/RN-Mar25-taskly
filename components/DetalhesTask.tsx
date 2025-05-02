import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../App";
import LongNoFillPressable from "./LongNoFillPressable";
import LongPressable from "./LongPressable";
import { View, Text, StyleSheet } from "react-native";
import { data } from "../services/db/mockData";
import { TaskTypes } from "../types/taskTypes";
import Subtask from "../components/Subtask";
import { RectButton } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
    SharedValue,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import IconTrash from "../assets/icons/lightmode/trash"


type DetalhesProps = {
    item: TaskTypes | null;
};

const DetalhesTask = ({ item }: DetalhesProps) => {
    const colors = useContext(AppContext);
    const [finishTask, setFinishTask] = useState(true);
    const [addSubtask, setAddSubtask] = useState(true);
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
        dragX: SharedValue<number>
    ) => {
        const scale = interpolate(
            sv.value,
            [0, 100],
            [0, 1],
            { extrapolateLeft: Extrapolation.CLAMP }
        );
        return (
            <Animated.View style={{ transform: [{ scale }] }}>
                <RectButton
                    style={{
                        justifyContent: "center",
                        paddingLeft: 26,
                        paddingRight: 44,
                        alignItems: 'center'
                    }}
                    onPress={() => swipeRef.current?.close()}
                >
                    <IconTrash height={40} width={40}/>
                                    </RectButton>
            </Animated.View>
        );
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
            shadowColor: "#000",
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
        TaskStyle: {
            fontSize: 18,
            fontWeight: 600,
            paddingBottom: 16,
        },
        TitleStyle: {
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
        },
        SubtaskContainer: {
            paddingTop: 32,
        },
        SubtaskListContainer: {

        },

    });
    return (
        <GestureHandlerRootView>
            <View style={styles.RootContainer}>
                <Swipeable
                    ref={swipeRef}
                    friction={2}
                    rightThreshold={40}
                    renderRightActions={renderRightActions}
                    onSwipeableOpen={(direction) => {
                        console.log("Swiped", direction);
                    }}
                >


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
                                    {item?.Tags.map((tag, index) => (
                                        <Text key={index} style={styles.tagStyle}>
                                            {tag}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                            <View>
                                <Text>Prioridade</Text>
                                <Text style={styles.PrioridadeTextColor}>ALTA</Text>
                                <View >
                                    <LongNoFillPressable
                                        textProps="RESOLVER TAREFA"
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
                        <View style={styles.SubtaskContainer}>
                            {item?.Subtask && item.Subtask.length > 0 && (
                                <View style={styles.SubtaskListContainer}>
                                    <Subtask
                                        data={item}
                                        onAddSubtask={(updatedSubtask)}{
                                        ...() => ''
                                        }
                                    />
                                </View>
                            )}
                          
                        </View>
                    </View>

                </Swipeable>
                    <LongPressable
                                textProps="ADICIONAR SUBTASK"
                                onPress={handleAddSubtask}
                                style={{
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    width: '100%'
                                }}
                            />
            </View>
        </GestureHandlerRootView>
    )
};

export default DetalhesTask;