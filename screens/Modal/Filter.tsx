import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import DropIcon from '../../assets/icons/lightmode/dropmenu.svg'; 
interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: { order: string | null; tags: string[]; date: string | null }) => void;
    onClear: () => void;
}

interface DropdownItem {
    label: string;
    value: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, onClear }) => {
    const [orderOpen, setOrderOpen] = useState<boolean>(false);
    const [order, setOrder] = useState<string | null>(null);
    const [orderItems] = useState<DropdownItem[]>([
        { label: 'Prioridade (de baixa para alta)', value: 'lowToHigh' },
        { label: 'Prioridade (de alta para baixa)', value: 'highToLow' },
    ]);

    const [tagsOpen, setTagsOpen] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagItems, setTagItems] = useState<DropdownItem[]>([
        { label: 'TRABALHO', value: 'trabalho' },
        { label: 'CASA', value: 'casa' },
        { label: 'ACADEMIA', value: 'academia' },
    ]);

    const [dateOpen, setDateOpen] = useState<boolean>(false);
    const [dateInput, setDateInput] = useState<string | null>(null); 

    const handleOpen = (target: 'order' | 'tags' | 'date') => {
        setOrderOpen(target === 'order');
        setTagsOpen(target === 'tags');
        setDateOpen(target === 'date');
    };

    const handleApply = () => {
        onApply({ order, tags, date: dateInput }); 
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
                            setOrder(item.value);
                            setOrderOpen(false);
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
                <Text style={isSelected && styles.selectedItemText}>{item.label}</Text>
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
                        <TouchableOpacity style={styles.filterHeader} onPress={() => handleOpen('order')}>
                            <Text style={styles.label}>Ordenar por</Text>
                            <DropIcon width={20} height={20} style={styles.dropdownIcon} />
                        </TouchableOpacity>
                        {orderOpen && (
                            <FlatList
                                data={orderItems}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => renderDropdownItem(item, 'order')}
                                style={styles.dropdownList}
                            />
                        )}
                    </View>

                    <View style={styles.filterItem}>
                        <TouchableOpacity style={styles.filterHeader} onPress={() => handleOpen('tags')}>
                            <Text style={styles.label}>Tags</Text>
                            <DropIcon width={20} height={20} style={styles.dropdownIcon} />
                        </TouchableOpacity>
                        {tagsOpen && (
                            <FlatList
                                data={tagItems}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => renderDropdownItem(item, 'tags')}
                                style={styles.dropdownList}
                            />
                        )}
                    </View>

                    <View style={styles.filterItem}>
                        <TouchableOpacity style={styles.filterHeader} onPress={() => handleOpen('date')}>
                            <Text style={styles.label}>Data</Text>
                            <DropIcon width={20} height={20} style={styles.dropdownIcon} />
                        </TouchableOpacity>
                        {dateOpen && (
                            <TextInput
                                style={styles.dateInput}
                                value={dateInput || ''}
                                onChangeText={setDateInput}
                                placeholder="Digite a data"
                            />
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


const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
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
    title: { fontSize: 24, fontWeight: '700' },
    closeButton: { fontSize: 26, color: 'red' },
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
        backgroundColor: '#fff',
        maxHeight: 150,
        overflow: 'auto',
    },
    dropdownListItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    selectedItem: {
        backgroundColor: '#e0f7fa',
    },
    selectedItemText: {
        fontWeight: 'bold',
    },

    button: {
     backgroundColor: '#5B2EFF',
     padding: 12,
     borderRadius: 6,
     alignItems: 'center',
     marginTop: 10,
  },
  clearButton: {
    backgroundColor: '#5B2EFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
});

export default FilterModal;