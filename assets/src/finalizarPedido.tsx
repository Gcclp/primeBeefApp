import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';

export const FinalizarPedido = ({ route }) => {
  const { total, itens } = route.params;

  const [cliente, setCliente] = useState({
    nome: '',
    telefone: '',
  });
  const [metodoEntrega, setMetodoEntrega] = useState('retirada');
  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    complemento: '',
    cidade: '',
    bairro: '',
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirmarPedido = async () => {
    const pedido = {
      cliente,
      metodoEntrega,
      endereco: metodoEntrega === 'delivery' ? endereco : null,
      total,
      itens: itens.map((item) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        total: item.total,
        adicionais: item.adicionais || [],
        observacoes: item.observacoes || '',
        imagem: item.imagem,
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Finalizar Pedido</Text>

      {/* Botão para abrir o modal */}
      <TouchableOpacity
        style={styles.buttonModal}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Visualizar Itens do Pedido</Text>
      </TouchableOpacity>

      {/* Formulário de Dados Pessoais */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={cliente.nome}
          onChangeText={(text) => setCliente({ ...cliente, nome: text })}
        />
        <Text style={styles.label}>Telefone*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu telefone"
          keyboardType="phone-pad"
          value={cliente.telefone}
          onChangeText={(text) => setCliente({ ...cliente, telefone: text })}
        />
      </View>

      {/* Método de Entrega */}
      <View style={styles.radioGroup}>
        <Text style={[styles.label, { fontSize: 20 }]}>Método de Entrega</Text>
        <TouchableOpacity
          onPress={() => setMetodoEntrega('retirada')}
          style={[
            styles.radioOption,
            metodoEntrega === 'retirada' && styles.radioSelected,
          ]}
        >
          <Text style={styles.radioText}>Retirada no Local</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMetodoEntrega('delivery')}
          style={[
            styles.radioOption,
            metodoEntrega === 'delivery' && styles.radioSelected,
          ]}
        >
          <Text style={styles.radioText}>Entrega</Text>
        </TouchableOpacity>
      </View>

      {/* Formulário de Endereço */}
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

      {/* Modal com os itens do pedido */}
 {/* Modal com os itens do pedido */}
 <Modal visible={modalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalHeader}>Itens do Pedido</Text>
      <ScrollView>
        {itens.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            {/* Adicionando Imagem */}
            {item.imagem && (
              <Image
                source={{ uri: item.imagem }}
                style={styles.itemImage}
              />
            )}
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text style={styles.itemQuantity}>Quantidade: {item.quantidade}</Text>
            
            {/* Adicionando Observações */}
            {item.observacoes && (
              <Text style={styles.observacoes}>
                Observações: {item.observacoes}
              </Text>
            )}

            {/* Adicionais */}
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
            <Text style={styles.totalItem}>
              Total: R$ {item.total.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(false)}>
        <Text style={styles.buttonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      {/* Botão Confirmar Pedido */}
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Entrega </Text>
          <Text style={{ fontWeight: 'bold', color: '#FF0000FF' }}>GRÁTIS</Text>
        </View>
        <Text style={styles.total}>
          Total:{' '}
          <Text style={styles.totalValue}>
            R$ {total.toFixed(2).replace('.', ',')}
          </Text>
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleConfirmarPedido}>
          <Text style={styles.buttonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFFFF',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000FF',
    marginBottom: 5,
  },
  input: {
    height: 48,
    borderColor: '#dcdde1',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: '#000',
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 15,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#dcdde1',
    backgroundColor: '#343535FF',
  },
  radioSelected: {
    borderColor: '#4E5051FF',
    backgroundColor: '#808184FF',
  },
  radioText: {
    fontSize: 16,
    color: '#F0F3F3FF',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: '#2D2E2FFF',
    fontWeight: 'bold',
  },
  
  formGroup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderColor: '#000000FF',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  total: {
    fontSize: 18,
    color: '#000000FF',
    marginBottom: 15,

  },
  totalValue: {
    fontWeight: 'bold',
    color: '#000000FF',
  },
  button: {
    backgroundColor: '#343535FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#343535FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonModal: {
    backgroundColor: '#343535FF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#343535FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonClose: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#FFFFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderColor: '#000000FF',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000FF',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#000000FF',
    marginBottom: 5,
  },
  adicionaisContainer: {
    marginTop: 10,
  },
  adicionaisTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E2F30FF',
    marginBottom: 5,
  },
  adicionalText: {
    fontSize: 14,
    color: '#222323FF',
  },
  totalItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000FF',
    marginTop: 10,
  },

  itemImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center', // Centraliza a imagem
  }
});
