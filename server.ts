import express, { Request, Response } from 'express';
import mysql1 from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// Configuração do servidor
// Declara o tipo explícito de app como Express.Application
const app: express.Application = express();

const port = 3000;

// Configuração do CORS (para permitir requisições do frontend)
app.use(cors());


// Função para criar a conexão com o banco de dados
const createConnection = () => {
  return mysql1.createConnection({
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

// Rota para obter os adicionais
app.get('/api/adicionais', (req: Request, res: Response) => {
  const db = createConnection(); // Cria uma nova conexão a cada requisição

  db.query('SELECT * FROM Adicionais', (err, results) => {
    if (err) {
      console.error('Erro ao obter adicionais:', err);
      return res.status(500).send('Erro ao obter adicionais');
    }

    res.json(results); // Envia os dados dos adicionais
    db.end(); // Encerra a conexão após a consulta
  });
});

// Rota para obter as categorias de adicionais
app.get('/api/adicionais-categorias', (req: Request, res: Response) => {
  const db = createConnection(); // Cria uma nova conexão a cada requisição

  db.query('SELECT * FROM AdicionaisCategorias', (err, results) => {
    if (err) {
      console.error('Erro ao obter categorias de adicionais:', err);
      return res.status(500).send('Erro ao obter categorias de adicionais');
    }

    res.json(results); // Envia os dados das categorias de adicionais
    db.end(); // Encerra a conexão após a consulta
  });
});

// Rota para obter as categorias de adicionais
app.get('/api/categorias', (req: Request, res: Response) => {
  const db = createConnection(); // Cria uma nova conexão a cada requisição

  db.query('SELECT * FROM Categorias', (err, results) => {
    if (err) {
      console.error('Erro ao obter categorias de adicionais:', err);
      return res.status(500).send('Erro ao obter categorias de adicionais');
    }

    res.json(results); // Envia os dados das categorias de adicionais
    db.end(); // Encerra a conexão após a consulta
  });
});

// Rota para obter adicionais organizados por categoria
app.get('/api/adicionais-por-categoria', (req: Request, res: Response) => {
  const db = createConnection(); // Cria uma nova conexão a cada requisição

  const query = `
    SELECT 
      c.Id AS CategoriaId,
      c.Nome AS CategoriaNome,
      a.Id AS AdicionalId,
      a.Nome AS AdicionalNome,
      a.Preco AS AdicionalPreco
    FROM 
      AdicionaisCategorias ac
    INNER JOIN 
      Categorias c ON ac.CategoriaId = c.Id
    INNER JOIN 
      Adicionais a ON ac.AdicionalId = a.Id
    ORDER BY 
      c.Id, a.Nome;
  `;

  db.query(query, (err, results: any[]) => {
    if (err) {
      console.error('Erro ao obter adicionais por categoria:', err);
      return res.status(500).send('Erro ao obter adicionais por categoria');
    }

    // Organizar os resultados por categoria
    const response = results.reduce((acc: any, item: any) => {
      const { CategoriaId, CategoriaNome, AdicionalId, AdicionalNome, AdicionalPreco } = item;

      if (!acc[CategoriaId]) {
        acc[CategoriaId] = {
          id: CategoriaId,
          nome: CategoriaNome,
          adicionais: [],
        };
      }

      acc[CategoriaId].adicionais.push({
        id: AdicionalId,
        nome: AdicionalNome,
        preco: AdicionalPreco,
      });

      return acc;
    }, {});

    res.json(Object.values(response)); // Retorna as categorias com seus adicionais
    db.end(); // Encerra a conexão após a consulta
  });
});

app.use(express.json());

// Rota para cadastrar usuário
app.post('/api/register', async (req: Request, res: Response) => {
  const { nome, telefone, username, password } = req.body;

  if (!nome || !telefone || !username || !password) {
    return res.status(400).send('Preencha todos os campos obrigatórios.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Gera o hash da senha
    const db = createConnection();

    db.query(
      'INSERT INTO Usuarios (ID ,username, password, nome, telefone) VALUES (?, ?, ?, ?, ?)',
      ['', username, hashedPassword, nome, telefone],
      (err) => {
        db.end(); // Encerra a conexão

        if (err) {
          console.error('Erro ao cadastrar usuário:', err);
          return res.status(500).send('Erro ao cadastrar usuário.');
        }

        res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
      }
    );
  } catch (error) {
    console.error('Erro ao processar cadastro:', error);
    res.status(500).send('Erro no servidor.');
  }
});

// Rota para login de usuário
app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'Preencha todos os campos obrigatórios.' });
  }

  const db = createConnection();

  db.query(
    'SELECT * FROM Usuarios WHERE username = ?',
    [username],
    async (err, results: any[]) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        db.end(); // Encerra a conexão
        return res.status(500).send({ error: 'Erro ao processar login.' });
      }

      if (results.length === 0) {
        db.end(); // Encerra a conexão
        return res.status(404).send({ error: 'Usuário não encontrado.' });
      }

      const user = results[0];

      // Verifica a senha
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          db.end(); // Encerra a conexão
          return res.status(401).send({ error: 'Credenciais inválidas.' });
        }

        // Login bem-sucedido, retornando o ID do usuário
        db.end(); // Encerra a conexão
        res.status(200).send({
          message: 'Login bem-sucedido!',
          userId: user.id, // Retorna o ID do usuário
        });
      } catch (compareError) {
        console.error('Erro ao comparar senha:', compareError);
        db.end(); // Encerra a conexão
        return res.status(500).send({ error: 'Erro interno ao verificar credenciais.' });
      }
    }
  );
});





// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
