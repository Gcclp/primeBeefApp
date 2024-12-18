import express, { Request, Response } from 'express';
import mysql from 'mysql2';
import cors from 'cors';

// Configuração do servidor
const app = express();
const port = 3000;

// Configuração do CORS (para permitir requisições do frontend)
app.use(cors());

// Função para criar a conexão com o banco de dados
const createConnection = () => {
  return mysql.createConnection({
    host: '193.203.175.122',
    user: 'u939035576_PrimeBeefAdm',
    password: 'Primebeef777',
    database: 'u939035576_PrimeBeef',
  });
};

// Rota para obter os itens do cardápio
app.get('/api/cardapio', (req: Request, res: Response) => {
  const db = createConnection(); // Cria uma nova conexão a cada requisição

  db.query('SELECT * FROM Cardapio', (err, results) => {
    if (err) {
      console.error('Erro ao obter itens:', err);
      return res.status(500).send('Erro ao obter itens');
    }

    res.json(results); // Envia os dados do cardápio
    db.end(); // Encerra a conexão após a consulta
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
