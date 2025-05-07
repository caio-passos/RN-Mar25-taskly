import React, { useState, useEffect} from 'react';
import { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Colorscheme from './hooks/Colorscheme';
import RootNavigator from './router/RootRouter';
import type { colorsTypes } from './types/colorsType';
import { useAuthStore } from './services/cache/stores/storeZustand';

export const AppContext = createContext<colorsTypes | undefined>(undefined);



export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(useAuthStore.getState().userData?.theme?.darkMode);


  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const darkMode = state.userData?.theme?.darkMode;
      setIsDarkMode(darkMode);
    });

    return () => unsubscribe();
  }, []);

  const themeProvider = useAuthStore.getState().userData?.theme;
  const colors = themeProvider?.darkMode ? Colorscheme().darkMode : Colorscheme().lightMode;

  return (
    <AppContext.Provider value={{ colors }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
