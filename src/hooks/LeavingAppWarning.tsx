import { Alert, BackHandler } from 'react-native';
import React, {useEffect} from 'react';

export function LeavingAppWarning() {
    useEffect(() => {
        const onBackPress = () => {
            Alert.alert(
                'Sair do aplicativo',
                'Deseja sair do aplicativo?',
                [
                    {
                        text: 'Cancelar',
                        onPress: () => {
                        },
                        style: 'cancel',
                    },
                    { text: 'Sair', onPress: () => BackHandler.exitApp() },
                ],
                { cancelable: false }
            );
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
}
