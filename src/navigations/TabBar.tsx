import { BottomTabBarHeightContext, createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../screens/CalendarScreen';
import ReviewNavigation from './ReviewNavigation';
import { TabParamList } from './types';
import { Dimensions, Keyboard, useColorScheme, View } from 'react-native';
import WriteNavigation from './WriteNavigation';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import NavHeader from './NavHeader';
import CalendarNavigation from './CalendarNavigation';
import { useEffect, useState } from 'react';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: "beside-icon",
        tabBarHideOnKeyboard: true,
        headerTitleAlign: "center",
        headerShown: false,
        animation: "shift"
      }}
    >
      <Tab.Screen 
        name="ReviewNav" 
        component={ReviewNavigation} 
        options={{
          title: "독서 기록",
          tabBarIcon: ({focused, color, size}) => 
            <MaterialDesignIcons name={focused ? "book-open-variant" : "book-open-variant-outline"} color={color} size={18} />
        }}
      />
      <Tab.Screen
        name="WriteNav"
        component={WriteNavigation}
        options={{
          title: "기록 추가",
          tabBarIcon: ({focused, color, size}) => 
            <MaterialDesignIcons name={focused ? "book-plus" : "book-plus-outline"} color={color} size={18} />
        }}
      />
      <Tab.Screen 
        name="CalendarNav" 
        component={CalendarNavigation} 
        options={{
          title: "달력",
          tabBarIcon: ({focused, color, size}) => 
            <MaterialDesignIcons name={focused ? "calendar-blank" : "calendar-blank-outline"} color={color} size={18} />
        }}
      />
    </Tab.Navigator>
  );
}