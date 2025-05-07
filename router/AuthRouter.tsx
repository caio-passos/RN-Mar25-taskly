import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Inicio from '../screens/(auth)/Inicio';
import { Pressable, Image, View } from 'react-native';
import IconInicio from '../assets/icons/lightmode/ClipboardText';
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
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
          height: 80,
          backgroundColor: colors.Background,
        },
      }}
    >
      <Tab.Screen
        name="MainApp"
        component={Inicio}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.Primary : 'transparent',
                borderRadius: 25,
                top: 20,
                padding: 10,
              }}
            >
              <IconInicio width={24} height={24}
                stroke={focused ? colors.SecondaryBG : colors.Primary}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={View}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Pressable
            disabled={true}
              style={{
                backgroundColor: focused ? colors.Primary : 'transparent',
                borderRadius: 25,
                padding: 10,
                top: 20,

              }}
            >
              <IconNotification width={24} height={24} stroke={focused ? colors.SecondaryBG : colors.Primary} />

            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.Primary : 'transparent',
                borderRadius: 25,
                padding: 10,
                top: 20,

              }}
            >
              <IconMenu width={24} height={24} stroke={focused ? colors.SecondaryBG : colors.Primary} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>

  );
}