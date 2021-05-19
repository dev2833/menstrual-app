import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import ThemeScreen from './screens/ThemeScreen';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import config from './settings/config'
import SymtomsMoodsScreen from './screens/SymtomsMoodsScreen';
import SymptomScreen from './screens/SymptomScreen';
import MoodScreen from './screens/MoodScreen';
import MetricScreen from './screens/MetricScreen';
import PasswordScreen from './screens/PasswordScreen';
import SettingScreen from './screens/SettingScreen';
import SplashScreen from './screens/SplashScreen';
import BarComponent from './screens/BarComponent';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FertileComponent from './screens/FertileComponent';
import OvulationComponent from './screens/OvulationComponent';
import ChartWeightScreen from './screens/ChartWeightScreen';
import ChartTempScreen from './screens/ChartTempScreen';
import PeriodLengthScreen from './screens/PeriodLengthScreen';
import CycleLengthScreen from './screens/CycleLengthScreen';
import OvulationScreen from './screens/OvulationScreen';
import PregnancyScreen from './screens/PregnancyScreen';
import AddUserScreen from './screens/AddUserScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import BackupScreen from './screens/BackupScreen';
import ReminderScreen from './screens/ReminderScreen';

const Tab = createMaterialTopTabNavigator();


const Stack = createStackNavigator();

export default function AppContainer({navigation}){
  const theme = useSelector(state => state.theme);

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="splash">
          <Stack.Screen 
                name="splash" component={SplashScreen} 
                options={({navigation})=>({
                    headerShown: false,
                })}/>
              <Stack.Screen 
                name="log" component={MyTabs} 
                options={({navigation})=>({
                  headerShown: true,
                  headerTitle: "Logs",
                  headerTitleStyle: { color: '#fff' },
                  headerBackground: () => (
                    <LinearGradient
                      colors={config.THEME[theme].submenu_button_color}
                      style={{ flex: 1 }}
                    />
                  ),
                  headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                name="chart" component={MyChart} 
                options={({navigation})=>({
                  headerShown: true,
                  headerTitle: "My Chart",
                  headerTitleStyle: { color: '#fff' },
                  headerBackground: () => (
                    <LinearGradient
                      colors={config.THEME[theme].submenu_button_color}
                      style={{ flex: 1 }}
                    />
                  ),
                  headerTitleAlign: 'center',
                })}/>
            <Stack.Screen 
                name="dashboard" component={DashboardScreen} 
                options={({navigation})=>({
                    headerShown: false,
                })}/>
            <Stack.Screen 
                name="calendar" component={CalendarScreen} 
                options={({navigation})=>({
                  headerShown: true,
                  headerTitle: "Calendar",
                  headerTitleStyle: { color: '#fff' },
                  headerBackground: () => (
                    <LinearGradient
                      colors={config.THEME[theme].submenu_button_color}
                      style={{ flex: 1 }}
                    />
                  ),
                  headerTitleAlign: 'center',
                })}/>
            <Stack.Screen 
                name="theme" component={ThemeScreen} 
                options={({navigation})=>({
                    headerShown: true,
                    headerTitle: "Themes",
                    headerTitleStyle: { color: '#fff' },
                    headerBackground: () => (
                      <LinearGradient
                        colors={config.THEME[theme].submenu_button_color}
                        style={{ flex: 1 }}
                      />
                    ),
                    headerTitleAlign: 'center',
                })}/>
            <Stack.Screen 
                name="symptomood" component={SymtomsMoodsScreen} 
                options={({navigation})=>({
                    headerShown: true,
                    headerTitle: "Symptoms & Moods",
                    headerTitleStyle: { color: '#fff' },
                    headerBackground: () => (
                      <LinearGradient
                        colors={config.THEME[theme].submenu_button_color}
                        style={{ flex: 1 }}
                      />
                    ),
                    headerTitleAlign: 'center',
                })}/>
              <Stack.Screen 
                name="symptom" component={SymptomScreen} 
                options={({navigation})=>({
                    headerShown: true,
                    headerTitle: "Symptoms",
                    headerTitleStyle: { color: '#fff' },
                    headerBackground: () => (
                      <LinearGradient
                        colors={config.THEME[theme].submenu_button_color}
                        style={{ flex: 1 }}
                      />
                    ),
                    headerTitleAlign: 'center',
                })}/>
              <Stack.Screen 
                name="mood" component={MoodScreen} 
                options={({navigation})=>({
                    headerShown: true,
                    headerTitle: "Moods",
                    headerTitleStyle: { color: '#fff' },
                    headerBackground: () => (
                      <LinearGradient
                        colors={config.THEME[theme].submenu_button_color}
                        style={{ flex: 1 }}
                      />
                    ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                name="metric" component={MetricScreen} 
                options={({navigation})=>({
                    headerShown: true,
                    headerTitle: "Metric & Imperial units",
                    headerTitleStyle: { color: '#fff' },
                    headerBackground: () => (
                      <LinearGradient
                        colors={config.THEME[theme].submenu_button_color}
                        style={{ flex: 1 }}
                      />
                    ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="password" component={PasswordScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Password",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="setting" component={SettingScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Settings",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="period" component={PeriodLengthScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Period Length",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="cycle" component={CycleLengthScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Cycle Length",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="ovulation" component={OvulationScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Cycle Length",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="pregnancy" component={PregnancyScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Pregnancy",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="adduser" component={AddUserScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Account",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="addnote" component={AddNoteScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Add Note",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="backup" component={BackupScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Backup & Restore",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
                <Stack.Screen 
                  name="reminder" component={ReminderScreen} 
                  options={({navigation})=>({
                      headerShown: true,
                      headerTitle: "Reminder",
                      headerTitleStyle: { color: '#fff' },
                      headerBackground: () => (
                        <LinearGradient
                          colors={config.THEME[theme].submenu_button_color}
                          style={{ flex: 1 }}
                        />
                      ),
                    headerTitleAlign: 'center',
                })}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Period" component={BarComponent} />
      <Tab.Screen name="Fertile" component={FertileComponent} />
      <Tab.Screen name="Ovulation" component={OvulationComponent} />
    </Tab.Navigator>
  );
}

function MyChart() {
  return (
    <Tab.Navigator swipeEnabled={false}>
      <Tab.Screen name="Weight" component={ChartWeightScreen} />
      <Tab.Screen name="Temperature" component={ChartTempScreen} />
    </Tab.Navigator>
  );
}