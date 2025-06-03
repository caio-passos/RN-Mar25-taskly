import React, { useState, useContext } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';
import { AppContext } from '../../../App';
import { useTaskStore } from '../../services/cache/stores/storeZustand';
import { TaskTypes } from '../../types/taskTypes';
import { formatDate } from '../../utils/formatDate';

interface ModalCriarTarefas {
  visible: boolean;
  onClose: () => void;
}

const ModalCriarTarefas = ({ visible, onClose }: ModalCriarTarefas) => {
  const { colors, darkMode } = useContext(AppContext)!;
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');

  const CreateTask = useTaskStore().addTask;

  const handleCreateTask = () => {
    const newTaskId = `task_${Date.now()}`;

    const newTask: TaskTypes = {
      id: newTaskId,
      Task: String(titulo),
      Descricao: String(descricao),
      Prazo: prazo || '',
      Checked: false,
      Tags: [],
      Subtask: [],
    };

    if (isEmoji()) {
        return;
    }

    function isEmoji(): boolean {
        const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;

        if (emojiRegex.test(titulo)) {
            return true;
        }

        if (emojiRegex.test(descricao)) {
            return true;
        }

        return false;
    }

    if (checkLength()) {
        return;
    }

    function checkLength(): boolean {
        if (titulo.length > 100) {
            return true;
        }

        if (descricao.length > 500) {
            return true;
        }

        return false;
    }

    if (isDateValid()) {
        return;
    }

    function isDateValid(): boolean {
        const dateNowString = new Date(Date.now());
        const newPrazo = prazo.replace('/', '').replace('/', '');
        const dateDayInput = newPrazo.slice(0, 2);
        const dateMonthInput = newPrazo.slice(2, 4);
        const dateYearInput = newPrazo.slice(4, 8);
        const dataStr = `${dateYearInput}-${dateMonthInput}-${dateDayInput}T${dateNowString.toLocaleTimeString()}Z`; // exemplo de string ISO
        const data = new Date(dataStr);
        const milissegundos = data.getTime();

        if (milissegundos < dateNowString.getTime()) {
            return true;
        }

        return false;
    }

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
      paddingHorizontal: 18,
    },
    modalView: {
      width: '90%',
      paddingTop: 25,
      paddingHorizontal: 20,
      alignItems: 'center',
      elevation: 5,
      backgroundColor: colors.Background,
      borderRadius: 12,
      height: 455,
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
    },
    boxInput: {
      flexDirection: 'row',
      borderColor: colors.Primary,
      borderWidth: 2,
      borderRadius: 8,
      width: '100%',
      minHeight: 47,
      justifyContent: 'center',
      marginBottom: 28,
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
      fontWeight: 'bold',
      color: colors.MainText
    },
    inputTitle: {
        color: colors.MainText,
        paddingLeft: 18,
        paddingRight: 18,
        borderWidth: 0,
        width: '100%',
    },
    inputDescription: {
        color: colors.MainText,
        textDecorationLine: 'none',
        width: '100%',
        paddingLeft: 18,
        paddingRight: 18,
    },
    inputTerm: {
        color: colors.MainText,
        textDecorationLine: 'none',
        width: '100%',
        paddingLeft: 18,
        paddingRight: 18,
    },
    labelTitle: {
        color: colors.MainText,
        marginBottom: 5,
        fontSize: 12,
    },
    createButton: {
        color: colors.SecondaryBG,
    },
    lastInput: {
        marginBottom: 0,
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
            <Text style={styles.labelTitle}>Título</Text>
            <View style={styles.boxInput}>
              <TextInput
                placeholder="Ex: bater o ponto"
                placeholderTextColor={colors.MainText}
                onChangeText={value => setTitulo(String(value))}
                underlineColorAndroid="transparent"
                style={styles.inputTitle}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.labelTitle}>Descricao</Text>
              <View style={styles.boxInput}>
                <TextInput
                  placeholder="bater o ponto pelo site do kairos e depois tenho que sair para tomar café"
                  placeholderTextColor={colors.MainText}
                  multiline={true}
                  style={styles.inputDescription}
                  onChangeText={value => setDescricao(String(value))}
                />
              </View>
            </View>
            <View style={styles.inputForm}>
              <Text style={styles.labelTitle}>Prazo </Text>
              <View style={[styles.boxInput, styles.lastInput]}>
                <TextInput
                  placeholder="28/04/2025"
                  placeholderTextColor={colors.MainText}
                  keyboardType="numeric"
                  style={styles.inputTerm}
                  value={prazo}
                  onChangeText={value => {
                      value.length <= 10 ? setPrazo(formatDate(String(value))) : setPrazo(prazo);
                  }}
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
              <Pressable style={styles.buttonFilled} onPress={handleCreateTask}>
                <Text style={[styles.buttonText, styles.createButton]}>
                  CRIAR
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalCriarTarefas;
