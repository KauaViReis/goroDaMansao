import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'goro_super_secret_key_2026';

const app = express();
const port = process.env.PORT || 3001;

// Inicializa o banco de dados (útil para o primeiro run)
import { initDB } from './database.js';
if (process.env.NODE_ENV !== 'production') {
  initDB().catch(console.error);
}


app.use(cors());
app.use(express.json());

// Listar produtos
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar pedido
app.post('/api/orders', async (req, res) => {
  const { customer_name, customer_email, total, items } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO orders (customer_name, customer_email, total, items) VALUES ($1, $2, $3, $4) RETURNING id',
      [customer_name, customer_email, total, JSON.stringify(items)]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registro de Usuário
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const existingUserRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUserRes.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );
    
    const userId = result.rows[0].id;
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ 
      user: { id: userId, name, email },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de Usuário
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
