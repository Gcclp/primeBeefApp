import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Modal,
    View,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation(); // Usando o hook
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.100.137:3000/api/login', {
                username,
                password,
            });
    
    
            const { userId, message } = response.data; // Acesse 'userId' corretamente
    
            if (userId) { // Verifique se 'userId' está presente
                await AsyncStorage.setItem('userID', userId.toString()); // Use 'userId' diretamente
                Alert.alert('Sucesso', message);
                navigation.navigate('Cardápio');
            } else {
                Alert.alert('Erro', 'ID do usuário não retornado.');
            }
        } catch (error) {
            if (error.response) {
                Alert.alert('Erro', error.response.data.error || 'Erro no login.');
            } else {
                Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
            }
        }
    };
    

    const handleRegister = async () => {
        const endereco = `${rua}, Nº ${numero}, ${bairro}, ${cidade}`;

        try {
            const response = await axios.post('http://192.168.100.137:3000/api/register', {
                nome,
                telefone,
                username: registerUsername,
                password: registerPassword,
                endereco,
            });
            Alert.alert('Sucesso', response.data.message);
            setModalVisible(false);
        } catch (error) {
            if (error.response) {
                Alert.alert('Erro', error.response.data || 'Erro no cadastro');
            } else {
                Alert.alert('Erro', 'Não foi possível conectar ao servidor');
            }
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.card}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Usuário"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="##767676FF"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="##767676FF"
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.registerLink}>Cadastrar-se</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Cadastro</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            value={nome}
                            onChangeText={setNome}
                            placeholderTextColor="#767676FF"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Telefone"
                            keyboardType="phone-pad"
                            value={telefone}
                            onChangeText={setTelefone}
                            placeholderTextColor="##767676FF"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Usuário"
                            value={registerUsername}
                            onChangeText={setRegisterUsername}
                            placeholderTextColor="##767676FF"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            secureTextEntry
                            value={registerPassword}
                            onChangeText={setRegisterPassword}
                            placeholderTextColor="##767676FF"
                        />

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    registerLink: {
        marginTop: 15,
        color: '#007BFF',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '85%',
        elevation: 5,
    },
});

export default LoginScreen;
