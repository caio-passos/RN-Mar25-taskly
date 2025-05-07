import React, {useState} from 'react';
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
import { useAuthStore } from '../../services/cache/stores/storeZustand';
import { useUserStore } from '../../services/cache/stores/storeZustand';
import { AvatarData } from '../../types/userTypes';

interface AvatarProps {
  navigation: NativeStackScreenProps<RootStackParamList, 'Avatar'>;
}

function Avatar({ navigation }: AvatarProps) {
  const [ selectedAvatar, setSelectedAvatar ] = useState<number | null>(null);
  const authStore = useAuthStore().userData;
  const userStore = useUserStore().userData;

  const avatars = [
    { id: 1, uri: require('../../assets/icons/lightmode/useravatar.png'), borderColor: '#5B3CC4' },
    { id: 2, uri: require('../../assets/icons/lightmode/useravatar.png'), borderColor: '#E6E0F7' },
    { id: 3, uri: require('../../assets/icons/lightmode/useravatar.png'), borderColor: '#32C25B' },
    { id: 4, uri: require('../../assets/icons/lightmode/useravatar.png'), borderColor: '#FF0000' },
    { id: 5, uri: require('../../assets/icons/lightmode/useravatar.png'), borderColor: '#B58B46' },
  ];

  const handlePress = (id: number) => {
    setSelectedAvatar(selectedAvatar === id ? null : id);
  };
  const handleConfirmAvatar = () => {
    const avatar = avatars.find(a => a.id === selectedAvatar);

    if (avatar) {
      useUserStore.getState().partialUpdate({loggedIn: true})
      useAuthStore.getState().setAvatar(avatar)
      navigation.navigate('Inicio');
    }
  };
  return (
    <View style={styles.title}>
      <Text style={styles.titleText}>SELECIONE SEU AVATAR</Text>
      <Text style={styles.titleSubtext}>(Escolha somente um).</Text>

      <View>
        <View style={styles.row}>
          <Pressable onPress={() => handlePress(1)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 1 ? 1 : 0.5, borderColor: avatars[0].borderColor },
              ]}
              source={avatars[0].uri}
            />
          </Pressable>
          <Pressable onPress={() => handlePress(2)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 2 ? 1 : 0.5, borderColor: avatars[1].borderColor },
              ]}
              source={avatars[1].uri}
            />
          </Pressable>
          <Pressable onPress={() => handlePress(3)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 3 ? 1 : 0.5, borderColor: avatars[2].borderColor },
              ]}
              source={avatars[2].uri}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable onPress={() => handlePress(4)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 4 ? 1 : 0.5, borderColor: avatars[3].borderColor },
              ]}
              source={avatars[3].uri}
            />
          </Pressable>
          <Pressable onPress={() => handlePress(5)}>
            <Image
              style={[
                styles.img,
                { opacity: selectedAvatar === null || selectedAvatar === 5 ? 1 : 0.5, borderColor: avatars[4].borderColor },
              ]}
              source={avatars[4].uri}
            />
          </Pressable>
        </View>
      </View>

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirmAvatar}
        >
          <Text style={styles.buttonText}>CONFIRMAR SELEÇÃO</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 120,
    flex: 1,
    alignItems: 'center',
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
  },
  titleSubtext: {
    fontWeight: '400',
  },
  button: {
    marginTop: 70,
    backgroundColor: '#5B3CC4',
    width: 329,
    height: 47,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 10,
  },
});

export default Avatar;