import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Pressable,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/routingTypes';
import { AppContext } from '../../App';

interface AvatarProps {
    navigation: NativeStackScreenProps<RootStackParamList, 'Dashboard'>;
}

function Avatar({navigation}: AvatarProps) {
    const [selectedAvatar, setSelectedAvatar] = React.useState<number | null>(null);
    const handlePress = (id: number) => {
        if (selectedAvatar === id) {
          setSelectedAvatar(null);
        } else {
          setSelectedAvatar(id);
        }
    };

    const colors = useContext(AppContext)!.colors;

    const styles = StyleSheet.create({
        title: {
            paddingTop: 120,
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.Background,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10,
        },
        img: {
            borderRadius: 100,
            width: 95,
            height: 95,
            borderWidth: 2,
            marginHorizontal: 6,
        },
        titleText: {
            fontWeight: 'bold',
            fontSize: 24,
            color: colors.MainText,
        },
        titleSubtext: {
            fontWeight: '400',
            color: colors.MainText,
        },
        button: {
            marginTop: 70,
            backgroundColor: '#5B3CC4',
            width: 329,
            height: 47,
            borderRadius: 8,
        },
        buttonText: {
            color: colors.Background,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            paddingVertical: 10,
        },
    });

    return (
        <View style={styles.title}>
      <Text style={styles.titleText}>SELECIONE SEU AVATAR</Text>
      <Text style={styles.titleSubtext}>(Escolha somente um.).</Text>

      <View>
        <View style={styles.row}>
          <Pressable onPress={() => handlePress(1)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 1 ? 1 : 0.5, borderColor: '#5B3CC4' },
              ]}
              source={require('../../assets//icons/lightmode/useravatar.png')}
            />
          </Pressable>
          <Pressable onPress={() => handlePress(2)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 2 ? 1 : 0.5, borderColor: '#E6E0F7' },
              ]}
              source={require('../../assets//icons/lightmode/useravatar.png')}
            />
          </Pressable>
          <Pressable onPress={() => handlePress(3)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 3 ? 1 : 0.5, borderColor: '#32C25B' },
              ]}
              source={require('../../assets//icons/lightmode/useravatar.png')}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable onPress={() => handlePress(4)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 4 ? 1 : 0.5, borderColor: '#FF0000' },
              ]}
              source={require('../../assets//icons/lightmode/useravatar.png')}
            />
          </Pressable>
          <Pressable onPress={() => handlePress(5)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 5 ? 1 : 0.5, borderColor: '#B58B46' },
              ]}
              source={require('../../assets//icons/lightmode/useravatar.png')}
            />
          </Pressable>
        </View>
      </View>

      <View>
        <TouchableOpacity style={styles.button} 
        onPress={() => {
          navigation.navigate('Dashboard')  
        }}>
          <Text style={styles.buttonText}>
            CONFIRMAR SELEÇÃO
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    );
}

export default Avatar;