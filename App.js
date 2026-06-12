import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import InventoryScreen from './src/screens/InventoryScreen';
import AddMedicationScreen from './src/screens/AddMedicationScreen';
import DisposalScreen from './src/screens/DisposalScreen';
import { COLORS } from './src/theme/colors';

const Tab = createBottomTabNavigator();

// Ícone simples por aba usando emoji (evita dependências extras de ícones).
function icone(emoji) {
  return ({ color }) => <Text style={{ fontSize: 18, color }}>{emoji}</Text>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.white,
            headerTitleStyle: { fontWeight: 'bold' },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.textMuted,
          }}
        >
          <Tab.Screen
            name="Inventário"
            component={InventoryScreen}
            options={{ tabBarIcon: icone('💊') }}
          />
          <Tab.Screen
            name="Adicionar"
            component={AddMedicationScreen}
            options={{ tabBarIcon: icone('➕') }}
          />
          <Tab.Screen
            name="Descarte"
            component={DisposalScreen}
            options={{ tabBarIcon: icone('♻️') }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
