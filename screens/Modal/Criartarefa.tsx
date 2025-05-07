import React, {useState, useEffect, useContext} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../../App';
import {useTaskStore} from '../../services/cache/stores/storeZustand';
import {TaskTypes} from '../../types/taskTypes';
import Tasks from '../../components/Tasks';

interface ModalCriarTarefas {
  visible: boolean;
  onClose: () => void;
}


const ModalCriarTarefas = ({ visible, onClose }: ModalCriarTarefas) => {
    const colors = React.useContext(AppContext)!.colors;
    const [titulo, setTitulo] = useState('');
    const [descrição, setDescricao] = useState('');
    const [prazo, setPrazo] = useState('');

  const CreateTask = useTaskStore().addTask;

  const handleCreateTask = () => {
    const newTaskId = `task_${Date.now()}`;

    const newTask: TaskTypes = {
      id: newTaskId,
      Task: titulo,
      Descricao: descricao,
      Prazo: prazo || '',
      Checked: false,
      Tags: [],
      Subtask: [],
    };
    CreateTask(newTask);

    setTitulo('');
    setDescricao('');
    setPrazo('');
    onClose();
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 32,
    },
    modalView: {
      width: '90%',
      paddingVertical: 30,
      paddingHorizontal: 20,
      alignItems: 'center',
      elevation: 5,
      backgroundColor: colors.Background,
      borderRadius: 12,
    },
    boxButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    buttonFilled: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      backgroundColor: colors.Primary,
      borderRadius: 8,
      height: 37,
      justifyContent: 'space-around',
      marginTop: 25,
    },
    inputForm: {
      width: '100%',
      marginBottom: 5,
      gap: 2,
    },
    boxInput: {
      flexDirection: 'row',
      borderColor: colors.Primary,
      borderWidth: 2,
      borderRadius: 8,
      width: '100%',
      minHeight: 47,
      justifyContent: 'center',
      marginBottom: 33,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    textStyle: {
      width: '100%',
      textAlign: 'justify',
      justifyContent: 'center',
      color: colors.MainText
    },
    buttonText: {
      fontWeight: 600,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: colors.Primary,
    },
    titleText: {
      width: '100%',
      fontSize: 17,
      marginBottom: 15,
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.titleText} numberOfLines={1}>
            Criar tarefa{' '}
          </Text>

          <View style={styles.inputForm}>
            <Text>Título</Text>
            <View style={styles.boxInput}>
              <TextInput
                placeholder="Ex: bater o ponto"
                keyboardType="ascii-capable"
                onChangeText={value => setTitulo(String(value))}
              />
            </View>
            <View style={styles.inputForm}>
              <Text>Descricao</Text>
              <View style={styles.boxInput}>
                <TextInput
                  placeholder="bater o ponto pelo site do kairos e depois tenho que sair para tomar café"
                  keyboardType="ascii-capable"
                  multiline={true}
                  onChangeText={value => setDescricao(String(value))}
                />
              </View>
            </View>
            <View style={styles.inputForm}>
              <Text>Prazo </Text>
              <View style={styles.boxInput}>
                <TextInput
                  placeholder="28/04/2025"
                  keyboardType="numeric"
                  onChangeText={value => setPrazo(String(value))}
                />
              </View>
            </View>
            <View style={styles.boxButtons}>
              <Pressable
                style={[
                  styles.buttonFilled,
                  {
                    backgroundColor: colors.Background,
                    borderColor: colors.Primary,
                    borderWidth: 2,
                  },
                ]}
                onPress={onClose}>
                <Pressable onPress={onClose}>
                  <Text style={styles.buttonText}>CANCELAR</Text>
                </Pressable>
              </Pressable>
              <Pressable style={styles.buttonFilled} onPress={onClose}>
                <Pressable onPress={handleCreateTask}>
                  <Text style={[styles.buttonText, {color: '#FFFFFF'}]}>
                    CRIAR
                  </Text>
                </Pressable>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalCriarTarefas;
