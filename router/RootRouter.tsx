import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import HomeTabBar from './AuthRouter';
import type { RootStackParamList } from '../types/routingTypes';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Group>
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Cadastro" component={Cadastro} options={{ animation: 'slide_from_right' }} />
      </RootStack.Group>
      <RootStack.Group>
        <RootStack.Screen name="Inicio" component={HomeTabBar} options={{ animation: 'slide_from_right' }} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}