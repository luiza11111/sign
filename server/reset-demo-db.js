require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

// PostgreSQL конфигурациясы
const localDbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || 'sign',
};

if (process.env.DB_PASSWORD !== undefined) {
  const password = process.env.DB_PASSWORD;
  localDbConfig.password = password === '' ? undefined : String(password);
}

const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : localDbConfig;

const db = new Pool(dbConfig);

async function resetDatabase() {
  try {
    console.log('🔄 Деңгей ата опы қалпына келтірілуде...');
    
    // Барлық кестелерді өшіру
    await db.query(`
      DROP TABLE IF EXISTS translation_history CASCADE;
      DROP TABLE IF EXISTS dictionary CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    
    console.log('✅ Ескі кестелер өшірілді');
    
    // init.sql файлын оқу
    const initSQL = fs.readFileSync('./init.sql', 'utf-8');
    
    // SQL-дің әрбір сөйлемін орындау
    const statements = initSQL.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
      }
    }
    
    console.log('✅ Кестелер жаңадан құрылды');
    
    // Демо пайдаланушы құру
    const demoUser = {
      name: 'Демо пайдаланушы',
      email: 'demo@sign.kz',
      password_hash: '$2a$10$demo_hash_placeholder'
    };
    
    await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [demoUser.name, demoUser.email, demoUser.password_hash, 'user']
    );
    
    console.log('✅ Демо пайдаланушы құрылды');
    
    // Демо сөздеу құру
    const demoWords = [
      { text: 'Сәлем', video_url: '', category: 'Амандану' },
      { text: 'Рахмет', video_url: '', category: 'Амандану' },
      { text: 'Иә', video_url: '', category: 'Жауап' },
      { text: 'Жоқ', video_url: '', category: 'Жауап' }
    ];
    
    for (const word of demoWords) {
      await db.query(
        'INSERT INTO dictionary (text, video_url, category) VALUES ($1, $2, $3)',
        [word.text, word.video_url, word.category]
      );
    }
    
    console.log('✅ Демо сөздеу құрылды');
    console.log('✅ Деңгей ата опы сәтті қалпына келтірілді!');
    
    await db.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Қате:', error.message);
    await db.end();
    process.exit(1);
  }
}

resetDatabase();
