import React, { useContext, useState } from "react";
import { data } from "../services/db/mockData";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { TaskTypes } from "../types/taskTypes";
import { AppContext } from "../App";
import IconCheckedSquare from "../assets/icons/lightmode/checksquare";
import IconUncheckedSquare from "../assets/icons/lightmode/uncheckedsquare"
import IconPencil from "../assets/icons/lightmode/pencil";


interface SubtaskProps {
    data: TaskTypes;
    onAddSubtask?: (item: TaskTypes) => void;
    subtaskText: string;
}

const Subtask = ({ data, onAddSubtask, subtaskText }: SubtaskProps) => {
    const colors = useContext(AppContext)!.colors;
    const [subtaskCheck, setSubtaskCheck] = useState<Record<number, boolean>>({});

    const handleAdd = () => {
        const newSubtask = subtaskText;
        const updatedItem = {
            ...data,
            Subtask: [...(data.Subtask || []), newSubtask]
        };
        onAddSubtask?.(updatedItem);
    };
    const styles = StyleSheet.create({
        SubtaskContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            minWidth: '100%',
            height: 56,
            paddingHorizontal: 16,
            marginBottom: 32,
            borderRadius: 8,
            elevation: 1,
            backgroundColor: colors.SecondaryBG,
        },
        SubtaskAlignment: {
            flexDirection: 'row',
            alignItems: 'center',
        },

    })
    const handleSubtaskCheck = (index: number) => {
        setSubtaskCheck(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <View>
            {data.Subtask?.filter(subtask => subtask.trim() !== '') 
                .map((subtask, index) => (
                    <View key={index} style={styles.SubtaskContainer}>
                        <Pressable onPress={() => handleSubtaskCheck(index)}>
                            {subtaskCheck[index] ?(
                                <IconCheckedSquare height={24} width={24} />
                            ): (
                                <IconUncheckedSquare height={24} width={24}/>
                            )}
                        </Pressable>
                        <Text style={styles.subtaskText}>{subtask}</Text>
                        <IconPencil height={24} width={24} />
                    </View>
                ))}
        </View>
    )
}


export default Subtask;