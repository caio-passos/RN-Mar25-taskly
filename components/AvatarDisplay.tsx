import React, { useContext } from 'react';
import { Image, View, StyleSheet, Text, ImageStyle } from 'react-native';
import { useAuthStore, useUserStore } from '../services/cache/stores/storeZustand';
import { AppContext } from '../App';

interface AvatarProp {
    style?: ImageStyle;
}

const avatars = [
    { id: 1, uri: require('../assets/icons/lightmode/avatar1.png'), borderColor: '#5B3CC4' },
    { id: 2, uri: require('../assets/icons/lightmode/avatar2.png'), borderColor: '#E6E0F7' },
    { id: 3, uri: require('../assets/icons/lightmode/avatar3.png'), borderColor: '#32C25B' },
    { id: 4, uri: require('../assets/icons/lightmode/avatar4.png'), borderColor: '#FF0000' },
    { id: 5, uri: require('../assets/icons/lightmode/avatar5.png'), borderColor: '#B58B46' },
];
const AvatarDisplay = ({ style }: AvatarProp) => {

    const { colors, darkMode } = useContext(AppContext)!;
    const {userData} = useUserStore();

    const selectedAvatarData = userData?.avatar
        ? avatars.find(avatar => avatar.id === userData.avatar?.id)
        : avatars[0];

    console.log('Avatar: ', selectedAvatarData)
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.Background
        },
        img: {
            borderRadius: 100,
            width: 50,
            height: 50,
            borderWidth: 2,
            backgroundColor: colors.Background
        },
    });
    return (
        <View style={styles.container}>
            {selectedAvatarData ? (
                <Image
                    style={[
                        styles.img,
                        style,
                        { borderColor: selectedAvatarData.borderColor },
                    ]}
                    source={selectedAvatarData.uri}
                />
            ) : (
                <Text>No avatar selected</Text>
            )}
        </View>
    );
};



export default AvatarDisplay;