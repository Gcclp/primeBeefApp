import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FinalizarPedido = ({ route }) => {
  const { total } = route.params;
  const [metodoEntrega, setMetodoEntrega] = useState('retirada');
  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    complemento: '',
    cidade: '',
    bairro: '',
  });

  const getUserID = async () => {
    try {
        const userID = await AsyncStorage.getItem('userID');
        if (userID !== null) {
            console.log('ID do Usuário:', userID);
            return userID;
        }
    } catch (error) {
        console.error('Erro ao recuperar o ID do usuário:', error);
    }
    return null;
};

const handleConfirmarPedido = async () => {
  const pedido = {
    metodoEntrega,
    endereco: metodoEntrega === 'delivery' ? endereco : null,
    total: total,
    itens: itens.map((item) => ({
      nome: item.nome,
      quantidade: item.quantidade,
      total: item.total,
      adicionais: item.adicionais || [],
      observacoes: item.observacoes || '',
    })),
  };

  try {
    const response = await fetch('https://seuservidor.com/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });

    if (response.ok) {
      alert('Pedido confirmado e enviado ao banco de dados!');
    } else {
      alert('Erro ao confirmar o pedido. Tente novamente.');
    }
  } catch (error) {
    console.error(error);
    alert('Erro de conexão. Verifique sua internet.');
  }
};



  return (
// Adicione exibição dos itens

  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.header}>Finalizar Pedido</Text>
    <Text style={styles.total}>
      Total do Pedido: <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
    </Text>

    <Text style={styles.subHeader}>Itens do Pedido:</Text>
    {itens.map((item, index) => (
      <View key={index} style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <Text style={styles.itemQuantity}>Quantidade: {item.quantidade}</Text>
        {item.adicionais && (
          <View style={styles.adicionaisContainer}>
            <Text style={styles.adicionaisTitle}>Adicionais:</Text>
            {item.adicionais.map((adicional, adicionalIndex) => (
              <Text key={adicionalIndex} style={styles.adicionalText}>
                {adicional.Nome} - R$ {adicional.Preco.toFixed(2).replace('.', ',')}
              </Text>
            ))}
          </View>
        )}
        <Text style={styles.observacoes}>Observações: {item.observacoes}</Text>
        <Text style={styles.totalItem}>
          Total Item: R$ {item.total.toFixed(2).replace('.', ',')}
        </Text>
      </View>
    ))}


      <Text style={styles.label}>Método de Entrega</Text>
      <Picker
        selectedValue={metodoEntrega}
        onValueChange={(value) => setMetodoEntrega(value)}
        style={styles.picker}
      >
        <Picker.Item label="Retirada no Local" value="retirada" />
        <Picker.Item label="Delivery - Frete Grátis" value="delivery" />
      </Picker>

      {metodoEntrega === 'delivery' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Rua*</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua rua"
            value={endereco.rua}
            onChangeText={(text) => setEndereco({ ...endereco, rua: text })}
          />
          <Text style={styles.label}>Número*</Text>
          <TextInput
            style={styles.input}
            placeholder="Número da residência"
            value={endereco.numero}
            onChangeText={(text) => setEndereco({ ...endereco, numero: text })}
          />
          <Text style={styles.label}>Complemento</Text>
          <TextInput
            style={styles.input}
            placeholder="Complemento (opcional)"
            value={endereco.complemento}
            onChangeText={(text) => setEndereco({ ...endereco, complemento: text })}
          />
          <Text style={styles.label}>Cidade*</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua cidade"
            value={endereco.cidade}
            onChangeText={(text) => setEndereco({ ...endereco, cidade: text })}
          />
          <Text style={styles.label}>Bairro*</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu bairro"
            value={endereco.bairro}
            onChangeText={(text) => setEndereco({ ...endereco, bairro: text })}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleConfirmarPedido}>
        <Text style={styles.buttonText}>Confirmar Pedido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  total: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#27ae60',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 20,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  formGroup: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
