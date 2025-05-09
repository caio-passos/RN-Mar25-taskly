import React, {useContext, useEffect, useMemo,useState} from 'react';
import {FlatList, View, Text, StyleSheet, Pressable, Task} from 'react-native';
import {AppContext} from '../App';
import IconCheckboxUnchecked from '../assets/icons/lightmode/uncheckedcircle.svg';
import IconCheckboxChecked from '../assets/icons/lightmode/checkedcircle.svg';
import ShortPressable from './Shortpressable';
import LongPressable from './LongPressable';
import type {TaskFilters, TaskTypes} from '../types/taskTypes';
import {useTaskStore} from '../services/cache/stores/storeZustand';
import NoTasks from '../assets/icons/darkmode/nocontent.svg';
import { filterTasks } from '../services/filterTasks';

type ItemProps = {
  item: TaskTypes;
  onOpenDetalhes?: (item: TaskTypes) => void;
};

const TaskItem = ({item, onOpenDetalhes}: ItemProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const handleSelection = () => {
    setIsSelected(!isSelected);
  };
  const colors = useContext(AppContext)!.colors;  
  const styles = StyleSheet.create({
    RootContainer: {
      backgroundColor: colors.Background,
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
      paddingHorizontal: 32,
      paddingBottom: 15,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: colors.SecondaryBG,
    },
    ContainerTitle: {
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    TitleStyle: {
      fontSize: 18,
      fontWeight: 600,
      color: colors.MainText,
    },
    DescricaoStyle: {
      fontSize: 14,
      fontWeight: 500,
      color: colors.MainText,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tagStyle: {
      backgroundColor: colors.PrimaryLight,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
    },
    ContainerShortPressable: {
      paddingTop: 10,
      paddingBottom: 2,
    },
    svgNoTasks: {
      alignItems: 'center',
    },
  });
  return (
    <View style={styles.RootContainer}>
      <View style={styles.ShadowContainer}>
        <View style={styles.ContentContainer}>
          <View style={styles.ContainerTitle}>
            <Text style={styles.TitleStyle}>{item.Task}</Text>
            <Pressable onPress={handleSelection}>
              {isSelected ? (
                <IconCheckboxChecked width={24} height={24} />
              ) : (
                <IconCheckboxUnchecked width={24} height={24} />
              )}
            </Pressable>
          </View>
          <Text style={styles.DescricaoStyle}>{item.Descricao}</Text>
          <View style={styles.tagsContainer}>
            {item?.Tags?.map((tag, index) => (
              <Text key={index} style={styles.tagStyle}>
                {tag}
              </Text>
            ))}
          </View>
          <View style={styles.ContainerShortPressable}>
            <ShortPressable
              textProps="VER DETALHES"
              onPress={() => onOpenDetalhes?.(item)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const EmptyComponent = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <NoTasks height={173} width={259} />
    </View>
  );
};

const CriarTarefa = ({onOpenModal}: {onOpenModal: () => void}) => {
const colors = useContext(AppContext)!.colors;  
  return (
    <View style={{paddingTop: 40}}>
      <LongPressable
        textProps="Criar Tarefa"
        onPress={onOpenModal}
        style={{justifyContent: 'center', height:47 }}
        textStyle={{color: colors.SecondaryBG, fontSize:20}}
      />
    </View>
  );
};

const Tasks = ({
  tasks,
  onOpenModal,
  onOpenDetalhes,
}: {
  onOpenModal: () => void;
  onOpenDetalhes: (item: TaskTypes) => void;
  tasks: TaskTypes[];
}) => {
    const renderItem = ({item}: {item: TaskTypes}) => {
    return <TaskItem item={item} onOpenDetalhes={onOpenDetalhes} />;
  };
  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={() => <View style={{height: 16}} />}
      ListFooterComponent={() => <CriarTarefa onOpenModal={onOpenModal} />}
      ListEmptyComponent={EmptyComponent}
    />
  );
};

export default Tasks;
