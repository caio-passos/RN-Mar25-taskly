import React, { useState, useEffect, useMemo } from 'react';
import { createContext } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Colorscheme from './hooks/Colorscheme';
import RootNavigator from './router/RootRouter';
import type { colorsTypes } from './types/colorsType';
import { useAuthStore } from './services/cache/stores/storeZustand';
import { useUserStore } from './services/cache/stores/storeZustand';

export const AppContext = createContext<colorsTypes | undefined>(undefined);



export default function App() {
  const darkMode = useUserStore(state => state.userData?.theme);
  console.log('Theme at start: ', darkMode)
  const colors = useMemo(() => 
    darkMode ? Colorscheme().darkMode : Colorscheme().lightMode,
    [darkMode]
  );
    console.log('App re-render with theme:', darkMode);


  return (
    <AppContext.Provider value={{ colors }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
