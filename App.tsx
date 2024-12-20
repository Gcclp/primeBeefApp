import { StatusBar } from 'expo-status-bar';
import { Text, View, ImageBackground, Image } from 'react-native';
import { styles } from './assets/src/style';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CarrinhoProvider } from './assets/src/carrinhoBase'; // Importe o contexto
import { CarrinhoTela } from './assets/src/carrinho';
import { CardapioTela } from './assets/src/cardapio';
import { FinalizarPedido } from './assets/src/finalizarPedido';
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
          <Stack.Navigator
            screenOptions={{
              headerShown: false, // Oculta o cabeçalho padrão de cada tela
            }}
          >
            {/* Tela inicial de Login */}
            <Stack.Screen name="Login" component={LoginScreen} />

            {/* Outras telas do aplicativo */}
            <Stack.Screen name="Cardápio" component={CardapioTela} />
            <Stack.Screen name="Carrinho" component={CarrinhoTela} />
            <Stack.Screen name="Finalizar Pedido" component={FinalizarPedido} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </CarrinhoProvider>
  );
}
