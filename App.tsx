import React, { useState } from 'react';
import { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Colorscheme from './hooks/Colorscheme';
import RootNavigator from './router/RootRouter';
import type { colorsTypes } from './types/colorsType';
import { useAuthStore } from './services/cache/stores/storeZustand';

export const AppContext = createContext<colorsTypes | undefined>(undefined);

const themeProvider = useAuthStore.getState().userData?.theme


export default function App() {
  const colors = themeProvider ? Colorscheme().darkMode : Colorscheme().lightMode;

  return (
    <AppContext.Provider value={{ colors }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
