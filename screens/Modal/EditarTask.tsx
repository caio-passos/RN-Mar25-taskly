import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Modal,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { AppContext } from '../../App';
import { TaskTypes, PrioridadeType } from '../../types/taskTypes';
import LongPressable from '../../components/LongPressable';
import LongNoFillPressable from '../../components/LongNoFillPressable';
import IconGreenArrow from '../../assets/icons/lightmode/ArrowCircleRight.svg';



interface EditarTaskProps {
    visible: boolean;
    task: TaskTypes;
    onSave: (id: string, editedTask: TaskTypes) => void;
    onCancel: () => void;
}
const EditarTask: React.FC<EditarTaskProps> = ({ visible, task, onSave, onCancel }) => {
    const { colors, darkMode } = useContext(AppContext)!;
    const [editedTask, setEditedTask] = useState<TaskTypes>({ ...task });
    const [newTag, setNewTag] = useState('');

    const handleSave = () => {
        onSave(task.id, editedTask);
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
            width: '100%',
            height: '80%',
            backgroundColor: colors.Background,
            borderRadius: 12,
        },
        ContentContainer: {
            paddingHorizontal: 32,
            paddingBottom: 15,
            paddingTop: 24,
            marginBottom: 32,
            borderRadius: 8,
            elevation: 2,
            backgroundColor: colors.SecondaryBG,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.46,
            shadowRadius: 11.14,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.MainText,
            textAlign: 'center',
        },
        inputContainer: {
            marginBottom: 16,
        },
        label: {
            color: colors.SecondaryText,
            marginBottom: 8,
            fontSize: 16,
        },
        input: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 2,
            borderColor: colors.Primary,
            color: colors.MainText,
            borderRadius: 8,
            padding: 12,
            height: 48,
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
            alignContent: 'center',
        },
        tagText: {
            color: '#000',
        },
        priorityContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
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
            backgroundColor: '#FFD700',
        },
        selectedPriorityAlta: {
            backgroundColor: colors.Error,
        },
        buttonsContainer: {
            flexDirection: 'row',
            bottom: 20,
            marginBottom: 80,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'space-between',
            gap: 8
        },
    });

    return (
            <View style={styles.container}>
                <View style={styles.ContentContainer}>
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
                        <View style={styles.input}>
                            <TextInput
                                style={{ flex: 1, color: colors.MainText, padding: 0 }}
                                value={newTag}
                                onChangeText={setNewTag}
                                placeholder="Nova tag"
                                numberOfLines={1}
                                placeholderTextColor={colors.SecondaryText}
                                onSubmitEditing={handleAddTag}
                            />
                            <Pressable onPress={handleAddTag}>
                                <IconGreenArrow
                                    height={26}
                                    width={26}
                                />
                            </Pressable>
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
                </View>
                    <View style={styles.buttonsContainer}>
                        <LongNoFillPressable
                            textProps="CANCELAR"
                            onPress={onCancel}
                            style={{ flex: 1, height: 50, borderColor: colors.Primary }}
                        />
                        <LongPressable
                            textProps="SALVAR"
                            onPress={handleSave}
                            style={{ flex: 1, height: 50 }}
                            textStyle={{ color: colors.MainText }}
                        />
                </View>
            </View>
    );
};

export default EditarTask;
