import * as React from 'react';
import { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Colorscheme from './hooks/Colorscheme';
import RootNavigator from './router/RootRouter';

export const AppContext = createContext<ReturnType<typeof Colorscheme>>(Colorscheme());

export default function App() {
  const colors = Colorscheme();
  return (
    <AppContext.Provider value={colors}>
      <NavigationContainer>
        <RootNavigator/>
      </NavigationContainer>
    </AppContext.Provider>
  );
}