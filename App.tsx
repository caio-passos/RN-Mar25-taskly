import * as React from 'react';
import { createContext } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import { HeaderTitle } from '@react-navigation/elements';
import Colorscheme from './hooks/Colorscheme';
import type { RootStackParamList } from './types/routingTypes';
import ModalBiometria from './screens/Modal/Biometria';
import Inicio from './screens/(auth)/Inicio';

const RootStack = createNativeStackNavigator<RootStackParamList>();
export const AppContext = createContext<ReturnType<typeof Colorscheme>>(Colorscheme());

function Root() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Group>
        <RootStack.Screen name="Home" component={Login} />
        <RootStack.Screen name="Cadastro" component={Cadastro} options={{ animation: 'slide_from_right' }} />
      </RootStack.Group>
      <RootStack.Group>
        <RootStack.Screen name="Inicio" component={Inicio} options={{ animation: 'slide_from_right' }} />
      </RootStack.Group>
    
    </RootStack.Navigator>
  );
}

export default function App() {
  const colors = Colorscheme();
  return (
    <AppContext.Provider
      value={colors}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </AppContext.Provider>
  );
}