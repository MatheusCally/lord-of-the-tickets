import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddTicketScreen from './screens/AddTicketScreen';
import TicketDetailsScreen from './screens/TicketDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Meus Ingressos' }}
        />
        <Stack.Screen
          name="AddTicket"
          component={AddTicketScreen}
          options={{ title: 'Adicionar Ingresso' }}
        />
        <Stack.Screen
          name="TicketDetails"
          component={TicketDetailsScreen}
          options={{ title: 'Detalhes do Ingresso' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}