import React, { useMemo } from 'react';
import { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Colorscheme from './src/hooks/Colorscheme';
import RootNavigator from './src/router/RootRouter';
import type { colorsTypes } from './src/types/colorsType';
import { useUserStore } from './src/services/cache/stores/storeZustand';
import { useTasksSync } from './src/hooks/syncer';


export const AppContext = createContext<{ colors: colorsTypes; darkMode?: boolean } | undefined>(undefined);



export default function App() {

  const darkMode = useUserStore(state => state.userData?.theme);
  console.log('Theme at start: ', darkMode)
  const colors = useMemo(() => 
    darkMode ? Colorscheme().darkMode : Colorscheme().lightMode,
    [darkMode]
  );
    console.log('App re-render with theme:', darkMode);


useTasksSync();
  return (
    <AppContext.Provider value={{ colors: colors, darkMode }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
