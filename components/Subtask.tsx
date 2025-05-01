import React from "react";
import { data } from "../services/db/mockData";
import { View, Text } from "react-native";
import type { TaskTypes } from "../types/taskTypes";
import { AppContext } from "../App";
import IconCheckedSquare from "../assets/icons/lightmode/checksquare";
import IconPencil from "../assets/icons/lightmode/pencil";

interface SubtaskProps {
    data: TaskTypes;
}

function Subtask({ data }: SubtaskProps) {
    return (
        <View>
            {data.Subtask?.map ((subtask: string, index: number) => (
                <View key={index}>
                    <IconCheckedSquare height={24} width={24} />
                    <Text>{subtask}</Text>
                    <IconPencil height={24} width={24} />
                </View>
            ))}
            
        </View>
    )
}


export default Subtask;