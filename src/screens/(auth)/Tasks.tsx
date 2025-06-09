import React, {useContext, useEffect, useMemo,useState} from 'react';
import {FlatList, View, Text, StyleSheet, Pressable, Task} from 'react-native';
import {AppContext} from '../../../App';
import IconCheckboxUnchecked from '../../assets/icons/lightmode/uncheckedcircle.svg';
import IconCheckboxChecked from '../../assets/icons/lightmode/checkedcircle.svg';
import ShortPressable from '../../components/Shortpressable';
import LongPressable from '../../components/LongPressable';
import type {TaskFilters, TaskTypes} from '../../types/taskTypes';
import {useTaskStore} from '../../services/cache/stores/storeZustand';
import NoTasks from '../../assets/icons/darkmode/nocontent.svg';
import { filterTasks } from '../../services/filterTasks';
import {useNavigation} from '@react-navigation/native';

type ItemProps = {
  item: TaskTypes;
};

const TaskItem = ({item}: ItemProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const navigation =  useNavigation();
  const handleSelection = () => {
    setIsSelected(!isSelected);
  };
  const { colors, darkMode } = useContext(AppContext)!;  
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
            <Text style={styles.TitleStyle}>{item.title}</Text>
            <Pressable onPress={handleSelection}>
              {isSelected ? (
                <IconCheckboxChecked width={24} height={24} />
              ) : (
                <IconCheckboxUnchecked width={24} height={24} />
              )}
            </Pressable>
          </View>
          <Text style={styles.DescricaoStyle}>{item.description}</Text>
          <View style={styles.tagsContainer}>
            {item?.tags?.map((tag, index) => (
              <Text key={index} style={styles.tagStyle}>
                {tag}
              </Text>
            ))}
          </View>
          <View style={styles.ContainerShortPressable}>
            <ShortPressable
              textProps="VER DETALHES"
              onPress={() => navigation.navigate('DetalhesTask', {item} )}
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
const { colors, darkMode } = useContext(AppContext)!;  
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
}: {
  onOpenModal: () => void;
  tasks: TaskTypes[];
}) => {
    const renderItem = ({item}: {item: TaskTypes}) => {
    return <TaskItem item={item} />;
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
