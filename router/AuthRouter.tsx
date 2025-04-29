import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Inicio from '../screens/(auth)/Inicio';

const Tab = createBottomTabNavigator();

export default function HomeTabBar() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={Inicio} />
    </Tab.Navigator>
  );
}