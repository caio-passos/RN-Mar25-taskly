import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Inicio from '../screens/(auth)/Inicio';
import { Pressable, Image, View } from 'react-native';
import IconInicio from '../assets/icons/lightmode/inicio';
import IconNotification from '../assets/icons/lightmode/notification';
import IconMenu from '../assets/icons/lightmode/menu';
import { AppContext } from '../App';
import { useContext } from 'react';
import type { RootStackParamList } from '../types/routingTypes';
import Menu from '../screens/(auth)/Menu';

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function HomeTabBar() {
  const colors = useContext(AppContext)
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="MainApp"
        component={Inicio}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconInicio width={size} height={size} backgroundColor={color} />
          ),
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: colors.Background
          },
          tabBarIconStyle: {
            top: 10,
            position: 'relative',
            borderRadius: 50,
            backgroundColor: colors.Primary,
            width: 50,
            height: 50,
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={View}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconNotification width={size} height={size} backgroundColor={color} />
          ),
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: colors.Background,
          },
          tabBarIconStyle: {
            top: 10,
            position: 'relative',
            borderRadius: 50,
            backgroundColor: colors.Background,
            width: 50,
            height: 50,
          },
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconMenu width={size} height={size} backgroundColor={color} />
          ),
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: colors.Background,
          },
          tabBarIconStyle: {
            top: 10,
            position: 'relative',
            borderRadius: 50,
            backgroundColor: colors.Background,
            width: 50,
            height: 50,
          },
        }}
      />
    </Tab.Navigator>
  );
}