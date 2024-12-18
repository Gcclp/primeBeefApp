import { StatusBar } from 'expo-status-bar';
import { Text, View, ImageBackground, Image } from 'react-native';
import { styles } from './assets/src/style'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importando ícones
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import AppLoading from 'expo-app-loading';
import { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { CarrinhoTela } from './assets/src/carrinho';
import { CardapioTela } from './assets/src/cardapio';




const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <View style={styles.container}>

    <StatusBar style="light" barStyle="light-content"/>

      {/* Cabeçalho Personalizado */}
      <View style={{
        width: '100%',
        height: '35%',
        flexDirection: 'column'}}>
        <ImageBackground
          source={require('./assets/PrimeBeefOfuscado.png')}
          style={styles.headerBackground}
        >
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('./assets/PrimeBeef_Logo.jpg')} // Logo da hamburgueria
              style={styles.logo}
            />
            <Text style={styles.titleLogo}>Prime Beef Hamburgueria</Text>
            <Text style={styles.desc}>
              Rua Deputado João Leopoldo Jacomel, 925
            </Text>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 5}}>
              <Text style={styles.horarios}>Horários de Funcionamento: Terça à Domingo das 18h às 23h</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Navegação */}
      <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: { backgroundColor: '#333' },
          tabBarActiveTintColor: '#FFFF00FF',
          tabBarInactiveTintColor: '#fff',
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Carrinho') {
              iconName = 'cart';
            } else if (route.name === 'Cardápio') {
              iconName = 'food';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          headerShown: false, // Remove o cabeçalho de todas as telas
        })}
      >
        <Tab.Screen name="Cardápio" component={CardapioTela} />
        <Tab.Screen name="Carrinho" component={CarrinhoTela} />
      </Tab.Navigator>
    </NavigationContainer>
    </View>
  );
}
