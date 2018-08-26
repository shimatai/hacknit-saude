import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import ProntuarioScreen from '../screens/ProntuarioScreen';
import MapaScreen from '../screens/MapaScreen';
import CalendarioVacinasScreen from '../screens/CalendarioVacinasScreen';

const HomeStack = createStackNavigator({
  Mapa: MapaScreen,
  Home: HomeScreen,
  Links: LinksScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Rede PMF',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="map"
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
  Prontuario: ProntuarioScreen
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Carteira de Vacinação',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="list-alt"
    />
  ),
};

const CalendarioVacinasStack = createStackNavigator({
  CalendarioVacinas: CalendarioVacinasScreen,
  Links: LinksScreen,
  Prontuario: ProntuarioScreen
});

CalendarioVacinasStack.navigationOptions = {
  tabBarLabel: 'Calendário de Vacinação',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="calendar"
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  CalendarioVacinasStack
});
