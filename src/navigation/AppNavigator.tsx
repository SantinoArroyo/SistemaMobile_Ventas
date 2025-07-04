import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import ProductsScreen from '../screens/ProductsScreen';
import CustomersScreen from '../screens/CustomersScreen';
import SalesScreen from '../screens/SalesScreen';
import StockScreen from '../screens/StockScreen';
import ReportsScreen from '../screens/ReportsScreen';
import StockMovementsHistoryScreen from '../screens/StockMovementsHistoryScreen';
import NuevaVentaScreen from '../screens/NuevaVentaScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const StockStack = createNativeStackNavigator();
const SalesStack = createNativeStackNavigator();

function StockStackNavigator() {
  return (
    <StockStack.Navigator>
      <StockStack.Screen name="StockMain" component={StockScreen} options={{ title: 'Stock' }} />
      <StockStack.Screen name="StockMovementsHistory" component={StockMovementsHistoryScreen} options={{ title: 'Historial de Movimientos' }} />
    </StockStack.Navigator>
  );
}

function SalesStackNavigator() {
  return (
    <SalesStack.Navigator>
      <SalesStack.Screen name="SalesMain" component={SalesScreen} options={{ title: 'Registro de Ventas' }} />
      <SalesStack.Screen name="NuevaVenta" component={NuevaVentaScreen} options={{ title: 'Nueva Venta' }} />
    </SalesStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof MaterialIcons.glyphMap;

              if (route.name === 'Productos') {
                iconName = 'inventory';
              } else if (route.name === 'Clientes') {
                iconName = 'people-outline';
              } else if (route.name === 'Ventas') {
                iconName = 'point-of-sale';
              } else if (route.name === 'Stock') {
                iconName = 'warehouse';
              } else if (route.name === 'Reportes') {
                iconName = 'analytics';
              } else {
                iconName = 'help-outline';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#00bcd4',
            tabBarInactiveTintColor: '#6c757d',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#f8f9fa',
              paddingBottom: Platform.OS === 'ios' ? 20 : 8,
              paddingTop: 8,
              height: Platform.OS === 'ios' ? 80 : 60,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            headerStyle: {
              backgroundColor: '#00bcd4',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerShadowVisible: false,
          })}
        >
          <Tab.Screen 
            name="Productos" 
            component={ProductsScreen}
            options={{ title: 'Gestión de Productos' }}
          />
          <Tab.Screen 
            name="Clientes" 
            component={CustomersScreen}
            options={{ title: 'Gestión de Clientes' }}
          />
          <Tab.Screen 
            name="Ventas" 
            component={SalesStackNavigator}
            options={{ title: 'Registro de Ventas', headerShown: false }}
          />
          <Tab.Screen 
            name="Stock" 
            component={StockStackNavigator}
            options={{ title: 'Control de Stock', headerShown: false }}
          />
          <Tab.Screen 
            name="Reportes" 
            component={ReportsScreen}
            options={{ title: 'Reportes Mensuales' }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
} 