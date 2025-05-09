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
  setIsProfileUpdatedModalVisible
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
      alignItems: 'center',
      elevation: 5,
      backgroundColor: colors.Background,
      borderRadius: 12,
    },
    titleText: {
      width: '100%',
      fontSize: 17,
      marginBottom: 15,
      textAlign: 'center',
      fontWeight: 'bold',
      color: colors.MainText,
    },
    textModal: {
      color: colors.MainText,
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonFilled: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.Primary,
      borderRadius: 8,
      height: 37,
      paddingHorizontal: 20,
    },
    buttonText: {
      color: 'white',
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
          <Pressable style={styles.buttonFilled} onPress={onClose}>
            <Text style={styles.buttonText}>{ButtonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalProfileUpdated;