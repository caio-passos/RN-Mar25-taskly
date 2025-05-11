import React, { useContext, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import MaskedTextInput from 'react-native-mask-input';
import DropIcon from '../../assets/icons/lightmode/dropmenu.svg';
import { AppContext } from '../../App';
import IconCheckboxUnchecked from '../../assets/icons/lightmode/uncheckedcircle.svg';
import IconCheckboxChecked from '../../assets/icons/lightmode/checkedcircle.svg';
import { TaskFilters } from '../../types/taskTypes';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: TaskFilters) => void;
    onClear: () => void;
}

interface DropdownItem {
    label: string;
    value: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, onClear }) => {
    const { colors, darkMode } = useContext(AppContext)!;
    const styles = StyleSheet.create({
        modalBackground: {
            flex: 1,
            backgroundColor: colors.BackgroundModal,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            width: '85%',
            backgroundColor: colors.Background,
            borderRadius: 10,
            padding: 20,
            elevation: 5,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        title: {
            color: colors.MainText,
            fontSize: 24,
            fontWeight: '700'
        },
        closeButton: {
            fontSize: 26,
            color: 'red'
        },
        filterItem: {
            marginBottom: 15,
        },
        filterHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
        },
        label: {
            fontSize: 18,
            fontWeight: '500',
            color: colors.MainText
        },
        dropdownIcon: {
            width: 20,
            height: 20,
        },
        dropdownList: {
            marginTop: 5,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: colors.Background,
            color: colors.MainText,
            maxHeight: 150,
        },
        dropdownListItem: {
            padding: 10,
            backgroundColor: colors.PrimaryLight + '30'
        },
        selectedItem: {
            
            backgroundColor: colors.PrimaryLight,
        },
        selectedItemText: {
            color: colors.MainText,
            fontWeight: 'bold',
        },
        button: {
            backgroundColor: colors.Primary,
            padding: 12,
            borderRadius: 6,
            alignItems: 'center',
            marginTop: 10,
        },
        clearButton: {
            backgroundColor: colors.Primary,
            padding: 12,
            borderRadius: 6,
            alignItems: 'center',
            marginTop: 10,
        },
        buttonText: {
            color: colors.MainText,
            fontWeight: '500',
            fontSize: 18,
        },
        dateInput: {
            color: colors.MainText,
            borderColor: colors.Primary,
            backgroundColor: colors.Background,
            borderWidth: 2,
            borderRadius: 8,
            padding: 10
        },
        buttonContainer: {
            marginTop: 20,
            gap: 10
        },
        errorInput: {
            borderColor: colors.Error
        },
        errorText: {
            color: colors.Error,
            marginTop: 5
        }
    });


    const [order, setOrder] = useState<'baixaParaAlta' | 'altaParaBaixa' | null>(null);
    const [orderItems] = useState<DropdownItem[]>([
        { label: 'Prioridade (de baixa para alta)', value: 'baixaParaAlta' },
        { label: 'Prioridade (de alta para baixa)', value: 'altaParaBaixa' },
    ]);

    const [tags, setTags] = useState<string[]>([]);
    const [tagItems, setTagItems] = useState<DropdownItem[]>([
        { label: 'TRABALHO', value: 'trabalho' },
        { label: 'CASA', value: 'casa' },
        { label: 'ACADEMIA', value: 'academia' },
    ]);

    const [dateOpen, setDateOpen] = useState<boolean>(false);
    const [dateInput, setDateInput] = useState<string | null>('');
    const [dateError, setDateError] = useState<string | null>(null);

    const [openStates, setOpenStates] = useState({
        order: false,
        tags: false,
        date: false
    });
    const toggleDropdown = (target: keyof typeof openStates) => {
        setOpenStates(prev => ({
            ...prev,
            [target]: !prev[target]
        }));
    };
    const parseDate = (dateStr: string | null): Date | null => {
        if (!dateStr) return null;
        
        const parts = dateStr.split('/');
        if (parts.length !== 3 || parts.some(part => !part)) return null;
        
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    };

    const handleApply = () => {
        if (dateInput) {
            const inputDate = parseDate(dateInput);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (!inputDate || inputDate <= today) {
                setDateError('Por favor insira uma data futura válida (DD/MM/AAAA)');
                return;
            }
        }

        onApply({
            order: order || undefined,
            tags: tags.length ? tags : undefined,
            date: dateInput || undefined
        });
        onClose();
    };

    const handleClear = () => {
        setOrder(null);
        setTags([]);
        setDateInput(null);
        setDateOpen(false);
        onClear();
    };

    const renderDropdownItem = (item: DropdownItem, filterType: 'order' | 'tags') => {
        const isSelected =
            filterType === 'order'
                ? order === item.value
                : tags.includes(item.value);

        return (
            <TouchableOpacity
                style={[styles.dropdownListItem, isSelected && styles.selectedItem]}
                onPress={() => {
                    switch (filterType) {
                        case 'order':
                            setOrder(item.value as 'baixaParaAlta' | 'altaParaBaixa');
                            break;
                        case 'tags':
                            if (tags.includes(item.value)) {
                                setTags(tags.filter(t => t !== item.value));
                            } else {
                                setTags([...tags, item.value]);
                            }
                            break;
                    }
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isSelected ? (
                        <IconCheckboxChecked width={20} height={20} style={{ marginRight: 10 }} />
                    ) : (
                        <IconCheckboxUnchecked width={20} height={20} style={{ marginRight: 10 }} />
                    )
                    }

                    <Text style={isSelected && styles.selectedItemText}>{item.label}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filtro</Text>
                        <TouchableOpacity onPress={onClose} accessibilityLabel="Fechar filtro">
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterItem}>
                        <TouchableOpacity style={styles.filterHeader} onPress={() => toggleDropdown('order')}>
                            <Text style={styles.label}>Ordenar por</Text>
                            <DropIcon width={20} height={20} style={styles.dropdownIcon} />
                        </TouchableOpacity>
                        {openStates.order && (
                            <FlatList
                                data={orderItems}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => renderDropdownItem(item, 'order')}
                                style={styles.dropdownList}
                                
                            />
                        )}
                    </View>

                    <View style={styles.filterItem}>
                        <TouchableOpacity style={styles.filterHeader} onPress={() => toggleDropdown('tags')}>
                            <Text style={styles.label}>Tags</Text>
                            <DropIcon width={20} height={20} style={styles.dropdownIcon} />
                        </TouchableOpacity>
                        {openStates.tags && (
                            <FlatList
                                data={tagItems}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => renderDropdownItem(item, 'tags')}
                                style={styles.dropdownList}
                            />
                        )}
                    </View>

                    <View style={styles.filterItem}>
                        <TouchableOpacity style={styles.filterHeader} onPress={() => toggleDropdown('date')}>
                            <Text style={styles.label}>Data</Text>
                            <DropIcon width={20} height={20} style={styles.dropdownIcon} />
                        </TouchableOpacity>
                        {openStates.date && (
                            <View>
                                <MaskedTextInput
                                    style={[styles.dateInput, dateError && styles.errorInput]}
                                    value={dateInput || ''}
                                    onChangeText={(text: string, rawText: string) => {
                                        setDateInput(text);
                                        setDateError(null);
                                    }}
                                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                                    placeholder="DD/MM/AAAA"
                                    placeholderTextColor={colors.MainText}
                                    keyboardType="numeric"
                                />
                                {dateError && (
                                    <Text style={styles.errorText}>{dateError}</Text>
                                )}
                            </View>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleApply}>
                            <Text style={styles.buttonText}>APLICAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleClear}>
                            <Text style={styles.buttonText}>LIMPAR FILTROS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};



export default FilterModal;
