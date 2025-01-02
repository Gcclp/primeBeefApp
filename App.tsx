import { StatusBar } from 'expo-status-bar';
import { Text, View, ImageBackground, Image } from 'react-native';
import { styles } from './assets/src/style';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { CarrinhoProvider } from './assets/src/carrinhoBase'; // Importe o contexto
import { CarrinhoTela } from './assets/src/carrinho';
import { CardapioTela } from './assets/src/cardapio';
import { FinalizarPedido } from './assets/src/finalizarPedido';
import { Ionicons } from '@expo/vector-icons'; // Ícones para Tab Navigator
import LoginScreen from './assets/src/login';


const Stack = createStackNavigator();

export default function App() {
  return (
    <CarrinhoProvider> {/* Envolva a aplicação com o CarrinhoProvider */}
      <View style={styles.container}>
        <StatusBar style="light" barStyle="light-content" />

        {/* Cabeçalho Personalizado */}
        <View style={{ width: '100%', height: '35%', flexDirection: 'column' }}>
          <ImageBackground
            source={require('./assets/PrimeBeefOfuscado.png')}
            style={styles.headerBackground}
          >
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('./assets/PrimeBeef_Logo.jpg')} // Logo da hamburgueria
                style={styles.logo}
              />
              <Text style={styles.titleLogo}>Prime Beef Hamburgueria</Text>
              <Text style={styles.desc}>Rua Deputado João Leopoldo Jacomel, 925</Text>
              <View style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 5 }}>
                <Text style={styles.horarios}>Horários de Funcionamento: Terça à Domingo das 18h às 23h</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Navegação */}
        <NavigationContainer>
        <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: '#FF4500', // Cor quando selecionado
              tabBarInactiveTintColor: '#696969', // Cor quando não selecionado
              tabBarStyle: {
                backgroundColor: '#333', // Cor de fundo da barra
                borderTopColor: '#FF4500', // Linha superior
              },
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Cardápio') {
                  iconName = focused ? 'fast-food' : 'fast-food-outline';
                } else if (route.name === 'Carrinho') {
                  iconName = focused ? 'cart' : 'cart-outline';
                } else if (route.name === 'Finalizar Pedido') {
                  iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >

            {/* Outras telas do aplicativo */}
            <Tab.Screen name="Cardápio" component={CardapioTela} />
            <Tab.Screen name="Carrinho" component={CarrinhoTela} />
            <Tab.Screen name="Finalizar Pedido" component={FinalizarPedido} />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </CarrinhoProvider>
  );
}
