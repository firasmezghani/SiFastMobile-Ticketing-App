import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import TicketScreen from '../screens/TicketScreen';
import { Ticket } from '../types';
import TicketDetailScreen from '../screens/TicketDetailScreen';
import ScanTicketScreen from '../screens/ScanTicketScreen'; 
import CreateEventScreen from '../screens/CreateEventScreen';
import EventListScreen from '../screens/EventListScreen';
import ManageUsersScreen from '../screens/ManageUsersScreen'; // ✅ New import
import EditUserScreen from '../screens/EditUserScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Add this with your other imports
import AllTicketsScreen from '../screens/AllTicketsScreen'; // adjust path


export type RootStackParamList = {
  AuthLoading: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Ticket: undefined;
  TicketDetail: { ticket: Ticket };
  CreateTicket: undefined;
  ScanTicket: undefined;
  CreateEvent: undefined;
  EventList: undefined;
  ManageUsers: undefined;
  EditUser: {
    userId: string;
    existingName: string;
    existingEmail: string;
  };
  Payment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
<Stack.Navigator initialRouteName="AuthLoading">
  <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
  <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
  <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ title: 'Ticket Details' }} />
  <Stack.Screen name="ScanTicket" component={ScanTicketScreen} options={{ title: 'Scan Ticket' }} />
  <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Create Event' }} />
  <Stack.Screen name="EventList" component={EventListScreen} options={{ title: 'Browse Events' }} />
  <Stack.Screen name="EditUser" component={EditUserScreen} />

  <Stack.Screen name="Ticket" component={TicketScreen} />
  <Stack.Screen name="ManageUsers" component={ManageUsersScreen} options={{ title: 'Manage Users' }} />
  <Stack.Screen name="Payment" component={PaymentScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  <Stack.Screen name="AllTickets" component={AllTicketsScreen} options={{ title: 'All Tickets' }} />

</Stack.Navigator>

    </NavigationContainer>
  );
};

export default AppNavigator;
