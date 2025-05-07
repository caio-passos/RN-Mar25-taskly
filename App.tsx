import * as React from 'react';
import { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Colorscheme from './hooks/Colorscheme';
import RootNavigator from './router/RootRouter';
<<<<<<< HEAD
import { useUserStore } from './services/cache/stores/storeZustand';
import { SessionProvider } from './hooks/session';
=======
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> feature/changeTheme

type ValueContext = {
    colors: {
        Primary: string,
        Background: string,
        SecondaryBG: string,
        PrimaryLight: string,
        SecondaryAccent: string,
        MainText: string,
        SecondaryText: string,
        Error: string,
    };
    setControlTheme: React.Dispatch<React.SetStateAction<undefined | boolean>>;
}

export const AppContext = createContext<ValueContext | undefined>(undefined);


export default function App() {
    const [controlTheme, setControlTheme] = React.useState<undefined | boolean>(undefined);
    const [controlThemeString, setControlThemeString] = React.useState('false');
    AsyncStorage.getItem('theme').then((storedValue) => setControlThemeString(JSON.parse(storedValue!)));
    const colors = controlThemeString === 'true' ? Colorscheme().darkMode : Colorscheme().lightMode;
  return (
<<<<<<< HEAD
    <AppContext.Provider value={colors}>
      <SessionProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SessionProvider>
=======
    <AppContext.Provider value={{ colors, setControlTheme }}>
      <NavigationContainer>
        <RootNavigator/>
      </NavigationContainer>
>>>>>>> feature/changeTheme
    </AppContext.Provider>
  );
}
