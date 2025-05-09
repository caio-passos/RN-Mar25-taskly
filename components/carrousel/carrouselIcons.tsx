import React, { useEffect, useState, useMemo} from "react";
// import IconEditar from '../../assets/icons/lightmode/carrousel/editarInfo.png'
// import IconBiometria from '../../assets/icons/lightmode/carrousel/mudarBiometria.png'
// import IconSair from '../../assets/icons/lightmode/carrousel/sairConta.png'
// import IconExcluir from '../../assets/icons/lightmode/carrousel/excluirConta.png'
// import IconEditarDark from '../../assets/icons/darkmode/carrousel/editarInfo.png'
// import IconBiometriaDark from '../../assets/icons/darkmode/carrousel/mudarBiometria.png'
// import IconSairDark from '../../assets/icons/darkmode/carrousel/sairConta.png'
// import IconExcluirDark from '../../assets/icons/darkmode/carrousel/excluirConta.png'
import {Image} from 'react-native';
import IconEditar from '../../assets/icons/lightmode/carrousel/editarInfo.png'
import IconBiometria from '../../assets/icons/lightmode/carrousel/mudarBiometria.png'
import IconSair from '../../assets/icons/lightmode/carrousel/sairConta.png'
import IconExcluir from '../../assets/icons/lightmode/carrousel/excluirConta.png'
import IconEditarDark from '../../assets/icons/darkmode/carrousel/editarInfo.png'
import IconBiometriaDark from '../../assets/icons/darkmode/carrousel/mudarBiometria.png'
import IconSairDark from '../../assets/icons/darkmode/carrousel/sairConta.png'
import IconExcluirDark from '../../assets/icons/darkmode/carrousel/excluirConta.png'
import { useAuthStore, useUserStore } from "../../services/cache/stores/storeZustand";


const ThemedIconsProvider = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        useUserStore.getState().userData?.theme
    );

    useEffect(() => {
        console.log(' theme mode:', isDarkMode);
        const unsubscribe = useUserStore.subscribe((state) => {
            const newDarkMode = state.userData?.theme
            console.log('changed to:', newDarkMode);
            setIsDarkMode(newDarkMode);
        });

        return () => unsubscribe();
    }, []);

    return useMemo(() => {
        console.log('icons for mode:', isDarkMode);
        return {
            IconEditar: isDarkMode ? IconEditarDark : IconEditar,
            IconBiometria: isDarkMode ? IconBiometriaDark : IconBiometria,
            IconSair: isDarkMode ? IconSairDark : IconSair,
            IconExcluir: isDarkMode ? IconExcluirDark : IconExcluir,
        };
    }, [isDarkMode]);
};



export function useThemedIcons(){
    const component = ThemedIconsProvider();
    return {
        IconEditar: (props) => <Image source={component.IconEditar} {...props} />,
        IconBiometria: (props) => <Image source={component.IconBiometria} {...props} />,
        IconSair: (props) => <Image source={component.IconSair} {...props} />,
        IconExcluir: (props) => <Image source={component.IconExcluir} {...props} />,
    };
}