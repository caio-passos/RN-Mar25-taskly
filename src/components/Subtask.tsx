import React, {useContext, useState, useMemo} from 'react';
import {data} from '../services/db/mockData';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import type {TaskTypes} from '../types/taskTypes';
import {AppContext} from '../../App';
import {useTaskStore} from '../services/cache/stores/storeZustand';
import {useIcon} from '../hooks/useIcon';

interface SubtaskProps {
  data: TaskTypes;
  onAddSubtask?: (subtask: {title: string; completed: boolean}) => void;
  subtaskText: string;
  onSubtaskTextChange?: (text: string) => void;
}

const Subtask = ({
  data,
  onAddSubtask,
  subtaskText,
  onSubtaskTextChange,
}: SubtaskProps) => {

  const { colors, darkMode } = useContext(AppContext)!;


  const {tasks} = useTaskStore();
  const [subtaskCheck, setSubtaskCheck] = useState<Record<string, boolean>>({}); 
  const currentTask = tasks.find(task => task.id === data.id);

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
    subtaskText: {
      marginLeft: 10,
    },
  });

    const processedSubtasks = useMemo(() => {
      return (currentTask?.subtasks || data.subtasks || [])
        .filter(subtask => subtask && subtask.title)
        .map(subtask => ({
          title: subtask.title,
          done: subtask.done || false
        }));
    }, [currentTask, data]);

  const handleSubtaskCheck = (subtaskTitle: string) => { 
    setSubtaskCheck(prev => ({
      ...prev,
      [subtaskTitle]: !prev[subtaskTitle], 
    }));
  };
  const {
    trash: IconTrash,
    edit: IconEdit,
    editYellow: IconEditYellow,
    checkboxUnchecked: IconCheckboxUnchecked,
    checkboxChecked: IconCheckboxChecked,
    greenArrow: IconGreenArrow

  } = useIcon(['trash', 'edit', 'editYellow', 'checkboxUnchecked', 'checkboxChecked', 'greenArrow'], darkMode);

  return (
    <View>
        {processedSubtasks.map(subtask => (
          <View key={subtask.title} style={styles.SubtaskContainer}> 
            <Pressable
              style={styles.SubtaskAlignment}
              onPress={() => handleSubtaskCheck(subtask.title)}> 
              {!!subtaskCheck[subtask.title] ? ( 
                <IconCheckboxChecked height={24} width={24} />
              ) : (
                <IconCheckboxUnchecked height={24} width={24} />
              )}
              <Text style={styles.subtaskText}>{subtask.title}</Text>
            </Pressable>
            <IconEdit height={24} width={24} />
          </View>
        ))}
      ;
    </View>
  );
};
export default Subtask;
