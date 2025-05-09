import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Modal,
    ScrollView
} from 'react-native';
import { AppContext } from '../../App';
import { TaskTypes, PrioridadeType } from '../../types/taskTypes';
import LongPressable from '../../components/LongPressable';
import LongNoFillPressable from '../../components/LongNoFillPressable';

interface EditarTaskProps {
    visible: boolean;
    task: TaskTypes;
    onSave: (editedTask: TaskTypes) => void;
    onCancel: () => void;
}

const EditarTask: React.FC<EditarTaskProps> = ({ visible, task, onSave, onCancel }) => {
    const colors = useContext(AppContext)!.colors;
    const [editedTask, setEditedTask] = useState<TaskTypes>({ ...task });
    const [newTag, setNewTag] = useState('');

    const handleSave = () => {
        onSave(editedTask);
    };

    const handleAddTag = () => {
        if (newTag.trim() && !editedTask.Tags?.includes(newTag.trim())) {
            setEditedTask(prev => ({
                ...prev,
                Tags: [...(prev.Tags || []), newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditedTask(prev => ({
            ...prev,
            Tags: prev.Tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    const handlePriorityChange = (priority: PrioridadeType) => {
        setEditedTask(prev => ({
            ...prev,
            Prioridade: priority
        }));
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            paddingHorizontal: 32,
        },
        modalView: {
            width: '90%',
            backgroundColor: colors.Background,
            borderRadius: 12,
            padding: 24,
            maxHeight: '80%',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.MainText,
            marginBottom: 24,
            textAlign: 'center',
        },
        inputContainer: {
            marginBottom: 24,
        },
        label: {
            color: colors.SecondaryText,
            marginBottom: 8,
            fontSize: 16,
        },
        input: {
            backgroundColor: colors.SecondaryBG,
            borderWidth: 2,
            borderColor: colors.Primary,
            borderRadius: 8,
            padding: 12,
            color: colors.MainText,
        },
        textArea: {
            height: 100,
            textAlignVertical: 'top',
        },
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
        },
        tag: {
            backgroundColor: colors.PrimaryLight,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
        },
        tagText: {
            color: colors.MainText,
            marginRight: 8,
        },
        priorityContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
        },
        priorityButton: {
            flex: 1,
            marginHorizontal: 4,
            padding: 8,
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.Primary,
        },
        priorityButtonText: {
            color: colors.MainText,
        },
        selectedPriorityBaixa: {
            backgroundColor: colors.SecondaryAccent,
        },
        selectedPriorityMedia: {
            backgroundColor: '#FFD700', // Yellow for medium
        },
        selectedPriorityAlta: {
            backgroundColor: colors.Error, // Red for high
        },
        buttonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
        },
    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            statusBarTranslucent={true}
            onRequestClose={onCancel}
        >
            <View style={styles.container}>
                <View style={styles.modalView}>
                    <ScrollView>
                        <Text style={styles.title}>Editar Tarefa</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Título</Text>
                            <TextInput
                                style={styles.input}
                                value={editedTask.Task}
                                onChangeText={text => setEditedTask(prev => ({ ...prev, Task: text }))}
                                placeholder="Título da tarefa"
                                placeholderTextColor={colors.SecondaryText}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Descrição</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={editedTask.Descricao}
                                onChangeText={text => setEditedTask(prev => ({ ...prev, Descricao: text }))}
                                placeholder="Descrição da tarefa"
                                placeholderTextColor={colors.SecondaryText}
                                multiline
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Tags</Text>
                            <View style={styles.tagsContainer}>
                                {editedTask.Tags?.map((tag, index) => (
                                    <Pressable 
                                        key={index} 
                                        style={styles.tag}
                                        onPress={() => handleRemoveTag(tag)}
                                    >
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </Pressable>
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                                    value={newTag}
                                    onChangeText={setNewTag}
                                    placeholder="Nova tag"
                                    placeholderTextColor={colors.SecondaryText}
                                    onSubmitEditing={handleAddTag}
                                />
                                <LongPressable
                                    textProps="+"
                                    onPress={handleAddTag}
                                    style={{ width: 50 }}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Prioridade</Text>
                            <View style={styles.priorityContainer}>
                                {(['baixa', 'média', 'alta'] as PrioridadeType[]).map(priority => (
                                    <Pressable
                                        key={priority}
                                        style={[
                                            styles.priorityButton,
                                            editedTask.Prioridade === priority && 
                                                (priority === 'baixa' ? styles.selectedPriorityBaixa :
                                                 priority === 'média' ? styles.selectedPriorityMedia :
                                                 styles.selectedPriorityAlta)
                                        ]}
                                        onPress={() => handlePriorityChange(priority)}
                                    >
                                        <Text style={styles.priorityButtonText}>
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Prazo</Text>
                            <TextInput
                                style={styles.input}
                                value={editedTask.Prazo}
                                onChangeText={text => setEditedTask(prev => ({ ...prev, Prazo: text }))}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor={colors.SecondaryText}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.buttonsContainer}>
                            <LongNoFillPressable
                                textProps="CANCELAR"
                                onPress={onCancel}
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <LongPressable
                                textProps="SALVAR"
                                onPress={handleSave}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default EditarTask;
