import React from 'react';
import { Image, View, StyleSheet, Text, ImageStyle} from 'react-native';
import { useAvatarStore } from '../services/cache/stores/storeZustand';

interface AvatarProp{
    style?: ImageStyle;
}

const avatars = [
    { id: 1, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#5B3CC4' },
    { id: 2, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#E6E0F7' },
    { id: 3, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#32C25B' },
    { id: 4, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#FF0000' },
    { id: 5, uri: require('../assets/icons/lightmode/useravatar.png'), borderColor: '#B58B46' },
];
const AvatarDisplay = ({style}: AvatarProp) => {
    const { selectedAvatar } = useAvatarStore();
    const selectedAvatarData = avatars.find(avatar => avatar.id === selectedAvatar);
    console.log('Avatar: ', selectedAvatarData)
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

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        borderRadius: 100,
        width: 50,
        height: 50,
        borderWidth: 2,
    },
});

export default AvatarDisplay;