import React, { useContext, useState } from 'react';
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
import { AppContext } from '../../../App';

interface AvatarProps {
  navigation?: NativeStackScreenProps<RootStackParamList, 'Avatar'>;
  onEditProfile?: () => void;
}

function Avatar({ navigation, onEditProfile }: AvatarProps) {
  const { colors, darkMode } = useContext(AppContext)!;
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const avatars = [
    { id: 1, uri: require('../../assets/icons/lightmode/avatar1.png'), borderColor: '#5B3CC4' },
    { id: 2, uri: require('../../assets/icons/lightmode/avatar2.png'), borderColor: '#E6E0F7' },
    { id: 3, uri: require('../../assets/icons/lightmode/avatar3.png'), borderColor: '#32C25B' },
    { id: 4, uri: require('../../assets/icons/lightmode/avatar4.png'), borderColor: '#FF0000' },
    { id: 5, uri: require('../../assets/icons/lightmode/avatar5.png'), borderColor: '#B58B46' },
  ];

  const handlePress = (id: number) => {
    setSelectedAvatar(selectedAvatar === id ? null : id);
  };

  const handleSelectionConfirmed = () => {
    const avatarToSet = avatars.find(a => a.id === selectedAvatar);
    if (avatarToSet) {
      useAuthStore.getState().setAvatar(avatarToSet);

      if (onEditProfile) {
        useUserStore.getState().partialUpdate({
          avatar: avatarToSet,
        });
        onEditProfile();
      } else {
        useUserStore.getState().partialUpdate({
          avatar: avatarToSet,
          loggedIn: true,
        });
        if (navigation) navigation.navigate('MainTabs');
      }
    } else {
      console.log("No avatar selected");
    }
  };

  const styles = StyleSheet.create({
    title: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.Background
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
      color: colors.MainText
    },
    titleSubtext: {
      fontWeight: '400',
      color: colors.MainText
    },
    button: {
      marginTop: 70,
      backgroundColor: '#5B3CC4',
      width: 329,
      height: 47,
      borderRadius: 8,
    },
    buttonText: {
      color: colors.SecondaryBG,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      paddingVertical: 10,
    },
  });

  return (
    <>
      <View style={{ paddingTop: 120, backgroundColor: colors.Background }} />
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
                onPress={handleSelectionConfirmed}
                disabled={selectedAvatar === null}
              >
                <Text style={styles.buttonText}>CONFIRMAR SELEÇÃO</Text>
              </TouchableOpacity>
        </View>
      </View >
    </>
  );
}


export default Avatar;