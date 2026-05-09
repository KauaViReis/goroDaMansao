import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuração da conexão com o banco de dados
// Em produção (Vercel), usará DATABASE_URL
// Localmente, você pode definir as variáveis individualmente ou usar DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para Supabase/Neon/Vercel Postgres
  }
});

// Função para inicializar o banco de dados (equivalente ao db.exec do SQLite)
export const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Criar tabelas se não existirem (Sintaxe Postgres)
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        profile TEXT,
        image_url TEXT,
        tag TEXT
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT,
        customer_email TEXT,
        total DECIMAL(10, 2),
        items TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Popular dados se estiver vazio
    const res = await client.query('SELECT count(*) FROM products');
    if (parseInt(res.rows[0].count) === 0) {
      console.log('Populando banco de dados inicial...');
      const insertQuery = 'INSERT INTO products (name, description, price, profile, image_url, tag) VALUES ($1, $2, $3, $4, $5, $6)';
      
      await client.query(insertQuery, [
        'Hyper Focus', 
        'Foco absoluto sem distrações. A energia que abastece o seu setup. Desenvolvido com precisão técnica para máxima performance.',
        24.90,
        'Concentração Extrema',
        '/assets/hyper_focus.png',
        'Novo Drop'
      ]);

      await client.query(insertQuery, [
        'Pixel Power', 
        'A vantagem competitiva para o grind diário. Design cyberpunk, reflexos aprimorados e zero crash. O verdadeiro nectar dos deuses cibernéticos.',
        22.90,
        'Gamer / Reflexos',
        '/assets/pixel_power.png',
        'Mais Vendido'
      ]);

      await client.query(insertQuery, [
        'Berserker Blood', 
        'Puro torque. Para aqueles treinos que exigem força bruta. Composto agressivo com vasodilatadores e estimulantes táticos.',
        29.90,
        'Pré-Treino / Força',
        '/assets/berserker_blood.png',
        'Elite'
      ]);

      await client.query(insertQuery, [
        'Vórtex Cítrico', 
        'Explosão cítrica sem taquicardia. Foco puro e sustentável para longas sessões. Taste puro, precisão industrial na formulação.',
        19.90,
        'Explosão Cítrica',
        '/assets/vortex_citrico.png',
        'Classic'
      ]);

      await client.query(insertQuery, [
        'Zero Crash', 
        'O doce da vitória, sem o crash da cafeína. Formulação avançada zero açúcar. Visão de cria para o grind diário.',
        21.90,
        'Doce / Zero Açúcar',
        '/assets/zero_crash.png',
        'Classic'
      ]);
    }
    
    await client.query('COMMIT');
    console.log('Banco de dados PostgreSQL inicializado com sucesso.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Erro ao inicializar banco de dados:', e);
    throw e;
  } finally {
    client.release();
  }
};

export default {
  query: (text, params) => pool.query(text, params),
  pool
};
