import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import HomeTabBar from './AuthRouter';
import type { RootStackParamList } from '../types/routingTypes';
import Avatar from '../screens/(auth)/Avatar';
import Menu from '../screens/(auth)/Menu';
import Theme from '../screens/(auth)/Theme';
import Terms from '../screens/(auth)/Terms';
import { useUserStore } from '../services/cache/stores/storeZustand';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {

  const isLogged = useUserStore.getState().userData?.loggedIn;
  return (

    <RootStack.Navigator screenOptions={{ headerShown: false }}>
    {isLogged ? (
      <>
        <RootStack.Screen name='Avatar' component={Avatar}/>
        <RootStack.Screen name="Dashboard" component={HomeTabBar} options={{ animation: 'slide_from_right' }} />
        </>
    ) : (
      <>
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Cadastro" component={Cadastro} options={{ animation: 'slide_from_right' }} />
        </>
    )}
    </RootStack.Navigator>
  );
}