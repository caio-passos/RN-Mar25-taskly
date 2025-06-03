import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Modal,
    SafeAreaView,
    ScrollView,
    Platform
} from 'react-native';
import MaskedTextInput from 'react-native-mask-input';
import { AppContext } from '../../../App';
import { TaskTypes, PrioridadeType } from '../../types/taskTypes';
import LongPressable from '../../components/LongPressable';
import LongNoFillPressable from '../../components/LongNoFillPressable';
import IconGreenArrow from '../../assets/icons/lightmode/ArrowCircleRight.svg';
import AvatarDisplay from '../../components/AvatarDisplay';
import CloseRed from '../../assets/icons/close-red.svg';

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
    const [dateError, setDateError] = useState<string | null>(null);

    const parseDate = (dateStr: string | null): Date | null => {
        if (!dateStr) return null;
        
        const parts = dateStr.split('/');
        if (parts.length !== 3 || parts.some(part => !part)) return null;
        
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    };

    const handleSave = () => {
        if (editedTask.Prazo) {
            const inputDate = parseDate(editedTask.Prazo);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (!inputDate || inputDate <= today) {
                setDateError('Por favor insira uma data futura válida (DD/MM/AAAA)');
                return;
            }
        }

        onSave(task.id, editedTask);
    };

    const handleAddTag = () => {
        if (newTag.includes(' ')) {
            return;
        }

        if (!isNaN(Number(newTag) + 1)) {
            return;
        }

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
        backgroundFixer: {
            backgroundColor: colors.Background,
            zIndex: -1000,
        },
        container: {
            bottom: 50,
            paddingTop: 80,
            paddingHorizontal: 32,
            backgroundColor: colors.Background,
        },
        topBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            fontSize: 32,
            fontWeight: '700',
            color: colors.MainText,
        },
        ContentContainer: {
            width: '100%',
            marginTop: 40,
            paddingHorizontal: 32,
            paddingBottom: 15,
            paddingTop: 24,
            borderRadius: 8,
            elevation: 2,
            backgroundColor: colors.SecondaryBG,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.46,
            shadowRadius: 11.14,
        },
        inputContainer: {
            marginBottom: 16,
        },
        label: {
            color: colors.SecondaryText,
            marginBottom: 8,
            fontSize: 16,
            fontWeight: 500,
        },
        input: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            marginTop: 15,
        },
        tag: {
            backgroundColor: colors.PrimaryLight,
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
        },
        tagText: {
            color: '#000',
            marginRight: 5
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
            paddingHorizontal: 32,
            marginTop: 20,
            gap: 8
        },
        errorInput: {
            borderColor: colors.Error
        },
        errorText: {
            color: colors.Error,
            marginTop: 5
        },
    });

    return (
        <Modal visible={visible}>
            <KeyboardAvoidingView 
                behavior="padding"
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 50
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.backgroundFixer}>
                            <View style={styles.container}>
                                <View style={styles.topBar}>
                                    <Text style={styles.title}>Taskly</Text>
                                    <AvatarDisplay />
                                </View>
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
                                        <View style={styles.input}>
                                            <TextInput
                                                style={{ flex: 1, color: colors.MainText, padding: 0 }}
                                                value={newTag}
                                                onChangeText={setNewTag}
                                                placeholder="Nova tag"
                                                placeholderTextColor={colors.SecondaryText}
                                                onSubmitEditing={handleAddTag}
                                            />
                                            <Pressable onPress={handleAddTag}>
                                                <IconGreenArrow height={26} width={26} />
                                            </Pressable>
                                        </View>
                                        {editedTask.Tags?.length! > 0 && <View style={styles.tagsContainer}>
                                            {editedTask.Tags?.map((tag, index) => (
                                                <View
                                                    key={index}
                                                    style={styles.tag}
                                                >
                                                    <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
                                                    <Pressable onPress={() => handleRemoveTag(tag)}><CloseRed /></Pressable>
                                                </View>
                                            ))}
                                        </View>
                                        }
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
                                        <MaskedTextInput
                                            style={[styles.input, dateError && styles.errorInput]}
                                            value={editedTask.Prazo || ''}
                                            onChangeText={(text: string, rawText: string) => {
                                                setEditedTask(prev => ({ ...prev, Prazo: text }));
                                                setDateError(null);
                                            }}
                                            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                            placeholder="DD/MM/AAAA"
                                            placeholderTextColor={colors.SecondaryText}
                                            keyboardType="numeric"
                                        />
                                        {dateError && (
                                            <Text style={styles.errorText}>{dateError}</Text>
                                        )}
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

                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default EditarTask;
