import React from 'react';
import { View, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Inicio from '../screens/(auth)/Inicio';
import type { RootStackParamList } from '../types/routingTypes';
import Avatar from '../screens/(auth)/Avatar';
import Menu from '../screens/(auth)/Menu';
import Theme from '../screens/(auth)/Theme';
import Terms from '../screens/(auth)/Terms';
import Tasks from '../screens/(auth)/Tasks';
import { useUserStore } from '../services/cache/stores/storeZustand';
import IconInicio from '../assets/icons/lightmode/ClipboardText.svg';
import IconNotification from '../assets/icons/lightmode/notification.svg';
import IconMenu from '../assets/icons/lightmode/menu.svg';
import { AppContext } from '../App';
import { useContext } from 'react';
import DetalhesTask from '../components/DetalhesTask';


const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { colors, darkMode } = useContext(AppContext)!;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
          height: 80,
          backgroundColor: colors.SecondaryBG,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: focused ? colors.Primary : 'transparent',
              borderRadius: 25,
              top: 20,
              padding: 10,
            }}>
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
          tabBarIcon: ({ focused }) => (
            <Pressable
              disabled={true}
              style={{
                backgroundColor: focused ? colors.Primary : 'transparent',
                borderRadius: 25,
                padding: 10,
                top: 20,
              }}
            >
              <IconNotification width={24} height={24} 
                stroke={focused ? colors.SecondaryBG : colors.Primary} 
              />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? colors.Primary : 'transparent',
                borderRadius: 25,
                padding: 10,
                top: 20,
              }}
            >
              <IconMenu width={24} height={24} 
                stroke={focused ? colors.SecondaryBG : colors.Primary} 
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { userData } = useUserStore();
  const isLogged = !!userData?.token; // Using token as auth indicator

  return (
    <RootStack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={isLogged ? 'MainTabs' : 'Login'}
    >
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="Cadastro" component={Cadastro} />
      <RootStack.Screen name="Avatar" component={Avatar} />
      <RootStack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ animation: 'slide_from_right' }} 
      />
      <RootStack.Screen name="DetalhesTask" component={DetalhesTask} />
      <RootStack.Screen name="Menu" component={Menu} />
      <RootStack.Screen name="Theme" component={Theme} />
      <RootStack.Screen name="Terms" component={Terms} />
    </RootStack.Navigator>
  );
}
