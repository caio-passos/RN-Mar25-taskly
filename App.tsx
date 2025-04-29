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



const Stack = createNativeStackNavigator<RootStackParamList>();
export const AppContext = createContext<ReturnType<typeof Colorscheme>>(Colorscheme());

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{animation: 'slide_from_right'}}/>
    </Stack.Navigator>
  );
}

export default function App() {
  const colors = Colorscheme();
  return (
    <AppContext.Provider
      value={colors}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AppContext.Provider>
  );
}