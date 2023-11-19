import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Image, ScrollView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './Settings';
import GradeCalculator from './GradeCalculatorScreen';
import {Ionicons} from '@expo/vector-icons';
import {EventRegister} from 'react-native-event-listeners';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './HomeScreen';
import SetValues from './SetValues';
import SetGrades from './SetGrades'
import GraphScreen from "./GraphScreen";
import SetCalculatedGrades from "./SetCalculatedGrades";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const header = require('./assets/header.png')

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
            headerRight: () => (
                <Ionicons name="add"
                          size={28}
                          color="black"
                          style={{ marginRight: 10 }}
                          onPress={() => {EventRegister.emit('goToSetValues')}
                }/>
            ),
            headerStyle: {
                backgroundColor: '#efb810', // #5a9dcd
            },
          // headerBackground: () => (
            // <Image
            //   style={styles.header}
            //   source={header}
            // />
          // ),
        }}
      />
        <Stack.Screen name="Grades" component={SetGrades} />
      <Stack.Screen name="Set Values" component={SetValues} />
        <Stack.Screen name="Monitoring" component={GraphScreen} />
    </Stack.Navigator>
  );
}

function GradeCalculatorStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="Grade Calculator"
            component={GradeCalculator}
            options={{
            headerStyle: {
                backgroundColor: '#efb810', // #5a9dcd
            },
        }}
            />
            <Stack.Screen
                name="Calculated Grades"
                component={SetCalculatedGrades}
                options={{tabBarShowLabel: false}}
            />
        </Stack.Navigator>
    );
}
const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
            headerStyle: {
                backgroundColor: '#efb810',
            },
          // headerBackground: () => (
          //   <Image
          //     style={styles.header}
          //     source={header}
          //   />
          // ),
          tabBarActiveTintColor: '#efb810',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
          tabBarIcon: ({focused, color, size}) => {
            let IconComponent = Ionicons;
            let iconName;

            if (Platform.OS === 'ios') {
              if (route.name === 'HomeStack') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'GradeCalculatorStack') {
                iconName = focused ? 'calculator' : 'calculator-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'cog-sharp' : 'cog-outline';
              }
            } else {
              if (route.name === 'HomeStack') {
                iconName = focused ? 'home-sharp' : 'home-outline';
              } else if (route.name === 'GradeCalculatorStack') {
                iconName = focused ? 'calculator' : 'calculator-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings-sharp' : 'settings-outline';
              }
            }

            return <IconComponent name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="GradeCalculatorStack"
          component={GradeCalculatorStack}
          options={{
              tabBarLabel: 'Calculator',
              headerShown: false,
        }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{tabBarLabel: 'Settings'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
