import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProntuarioScreen from '../screens/ProntuarioScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Links: LinksScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Paciente',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="user-md"
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
  Prontuario: ProntuarioScreen
});

LinksStack.navigationOptions = {
  tabBarLabel: 'CPF',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="barcode"
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  //SettingsStack,
});
