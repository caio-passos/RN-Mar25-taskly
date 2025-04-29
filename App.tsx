import * as React from 'react';
import { createContext } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { HeaderTitle } from '@react-navigation/elements';
import Colorscheme from './hooks/Colorscheme';

const Stack = createNativeStackNavigator();
const AppContext = createContext<typeof Colorscheme>(Colorscheme);

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Login} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AppContext.Provider
      value={Colorscheme}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AppContext.Provider>
  );
}