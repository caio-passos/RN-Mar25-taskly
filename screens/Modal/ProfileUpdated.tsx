import React from 'react';
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { AppContext } from '../../App';

interface ModalProfileUpdatedProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  ButtonText: string;
  setIsProfileUpdatedModalVisible: Function;
}

const ModalProfileUpdated: React.FC<ModalProfileUpdatedProps> = ({
  visible,
  onClose,
  title,
  description,
  ButtonText,
}) => {
  const colors = React.useContext(AppContext)!.colors;

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
      alignItems: 'left',
      elevation: 5,
      backgroundColor: colors.Background,
      borderRadius: 12,
    },
    titleText: {
      width: '100%',
      fontSize: 18,
      marginBottom: 15,
      textAlign: 'left',
      fontWeight: 'bold',
      color: colors.MainText,
    },
    textModal: {
      color: colors.MainText,
      textAlign: 'left',
      fontSize: 16,
      fontWeight: 400,
      marginBottom: 20,
    },
    buttonClose: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.SecondaryAccent,
      borderRadius: 8,
      width: '100%', 
      height: 37,
      paddingHorizontal: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.textModal}>{description}</Text>
          <Pressable style={styles.buttonClose} onPress={onClose}>
            <Text style={styles.buttonText}>{ButtonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalProfileUpdated;