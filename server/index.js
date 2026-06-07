const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const fs = require('fs');
const axios = require('axios');

const envPath = path.resolve(__dirname, '.env');
const envExamplePath = path.resolve(__dirname, '.env.example');
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
    if (fs.existsSync(envExamplePath)) {
        const exampleResult = dotenv.config({ path: envExamplePath });
        if (!exampleResult.error) {
            console.log(`✅ Loaded .env.example from ${envExamplePath}`);
        } else {
            console.warn(`⚠️ Failed to load .env.example from ${envExamplePath}: ${exampleResult.error.message}`);
        }
    } else {
        console.warn(`⚠️ Failed to load .env from ${envPath}: ${envResult.error.message}`);
    }
} else {
    console.log(`✅ Loaded .env from ${envPath}`);
}

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL қосылуы
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

console.log('ℹ️  PostgreSQL конфигурациясы:', {
  mode: process.env.DATABASE_URL ? 'DATABASE_URL' : 'local',
  host: dbConfig.host || undefined,
  port: dbConfig.port || undefined,
  database: dbConfig.database || undefined,
  user: dbConfig.user || undefined,
});

const db = new Pool(dbConfig);

// Қосылуды тексеру
db.connect((err, client, release) => {
    if (err) {
        console.error('❌ PostgreSQL қосылу қатесі:', err.message);
    } else {
        console.log('✅ PostgreSQL қосылды!');
        release();
    }
});

const adminAccount = {
    name: 'Админ',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin'
};

// JWT тексеру middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Токен жоқ' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Токен жарамсыз' });
        }
        req.user = user;
        next();
    });
};

// ДБ кестелерін құру және админді дайындау
const initializeDatabase = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS translation_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                text TEXT NOT NULL,
                translation TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS dictionary (
                id SERIAL PRIMARY KEY,
                text TEXT NOT NULL,
                video_url TEXT,
                category TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        const adminCheck = await db.query('SELECT id FROM users WHERE email = $1', [adminAccount.email]);
        if (adminCheck.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(adminAccount.password, 10);
            await db.query(
                'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
                [adminAccount.name, adminAccount.email, hashedPassword, adminAccount.role]
            );
            console.log('✅ Admin user created:', adminAccount.email);
        }

        const dictionaryCount = await db.query('SELECT COUNT(*) FROM dictionary');
        if (parseInt(dictionaryCount.rows[0].count, 10) === 0) {
            const defaultEntries = [
                { text: 'университет', video_url: 'https://media.spreadthesign.com/video/mp4/12/32309.mp4', category: 'орын' },
                { text: 'мен университет оқимын', video_url: 'https://media.spreadthesign.com/video/mp4/12/108750.mp4', category: 'сөйлем' },
                { text: 'жоқ', video_url: 'https://media.spreadthesign.com/video/mp4/12/4136.mp4', category: 'жауап' },
                { text: 'иә', video_url: 'https://media.spreadthesign.com/video/mp4/12/4126.mp4', category: 'жауап' },
                { text: 'рахмет', video_url: 'https://media.spreadthesign.com/video/mp4/12/176094.mp4', category: 'сөздер' },
                { text: 'көмек', video_url: 'https://media.spreadthesign.com/video/mp4/12/2098.mp4', category: 'сөздер' },
                { text: 'маған үйге бару керек', video_url: 'https://media.spreadthesign.com/video/mp4/12/107731.mp4', category: 'сөйлем' },
                { text: 'үй', video_url: 'https://media.spreadthesign.com/video/mp4/12/349173.mp4', category: 'зат' },
                { text: 'жақсы', video_url: 'https://media.spreadthesign.com/video/mp4/12/176103.mp4', category: 'сын' },
                { text: 'керемет', video_url: 'https://media.spreadthesign.com/video/mp4/12/108652.mp4', category: 'сын' },
                { text: 'отырмын', video_url: 'https://media.spreadthesign.com/video/mp4/12/17011.mp4', category: 'етістік' },
                { text: 'сәлем', video_url: 'https://media.spreadthesign.com/video/mp4/12/17658.mp4', category: 'сәлемдесу' },
                { text: 'қалайсың', video_url: 'https://media.spreadthesign.com/video/mp4/12/6155.mp4', category: 'сұрақ' },
                { text: 'нестеп жатырсың', video_url: 'https://media.spreadthesign.com/video/mp4/12/321216.mp4', category: 'сұрақ' },
                { text: 'сау бол', video_url: 'https://media.spreadthesign.com/video/mp4/12/100036.mp4', category: 'қоштасу' }
            ];

            for (const entry of defaultEntries) {
                await db.query(
                    'INSERT INTO dictionary (text, video_url, category) VALUES ($1, $2, $3)',
                    [entry.text, entry.video_url, entry.category]
                );
            }
            console.log('✅ Default dictionary entries initialized.');
        }
    } catch (err) {
        console.error('❌ Database initialization error:', err.message);
    }
};

initializeDatabase();

// ========== ТІРКЕЛУ (name, email, password) ==========
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Аты-жөні, email және пароль қажет' });
    }

    try {
        // Парольды хэштеу
        const hashedPassword = await bcrypt.hash(password, 10);

        // Пайдаланушыны сақтау
        const result = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, 'user']
        );

        // Токен жасау
        const token = jwt.sign(
            { id: result.rows[0].id, name: result.rows[0].name, email: result.rows[0].email, role: result.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Тіркелу сәтті!',
            token,
            user: result.rows[0]
        });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ error: 'Бұл email бос емес' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// ========== КІРУ (email, password) ==========
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email және пароль қажет' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            console.warn(`Login failed: user not found for email=${email}`);
            return res.status(401).json({ error: 'Қолданушы табылмады' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            console.warn(`Login failed: invalid password for user id=${user.id} email=${email}`);
            return res.status(401).json({ error: 'Қате пароль' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Кіру сәтті!',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ТАРИХТЫ АЛУ ==========
app.get('/api/history', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM translation_history WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ТАРИХҚА ЖАЗУ (text, translation) ==========
app.post('/api/history', authenticateToken, async (req, res) => {
    const { text, translation } = req.body;

    if (!text || !translation) {
        return res.status(400).json({ error: 'Мәтін және аударма қажет' });
    }

    try {
        const result = await db.query(
            'INSERT INTO translation_history (user_id, text, translation) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, text, translation]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ТАРИХТАН ӨШІРУ ==========
app.delete('/api/history/:id', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM translation_history WHERE id = $1 AND user_id = $2 RETURNING *',
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Жазба табылмады' });
        }

        res.json({ message: 'Өшірілді' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== СӨЗДІКТІ АЛУ (барлығына ортақ) ==========
app.get('/api/dictionary', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM dictionary ORDER BY id DESC'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== СӨЗДІККЕ ЖАЗУ ==========
app.post('/api/dictionary', authenticateToken, async (req, res) => {
    const { text, video_url, category } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Сөз міндетті' });
    }

    try {
        const result = await db.query(
            'INSERT INTO dictionary (text, video_url, category) VALUES ($1, $2, $3) RETURNING *',
            [text, video_url || null, category || null]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== СӨЗДІКТЕН ӨШІРУ ==========
app.delete('/api/dictionary/:id', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM dictionary WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Сөз табылмады' });
        }

        res.json({ message: 'Өшірілді' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ПАЙДАЛАНУШЫЛАР ТІЗІМІН АЛУ (тек админ үшін) ==========
app.get('/api/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Тек админге рұқсат етілген' })
    }

    try {
        const result = await db.query(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ========== ПАЙДАЛАНУШЫНЫ ӨШІРУ (тек админ үшін) ==========
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Тек админге рұқсат етілген' })
    }

    try {
        const result = await db.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [req.params.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пайдаланушы табылмады' })
        }

        res.json({ message: 'Өшірілді' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

// ========== ПАЙДАЛАНУШЫНЫҢ ПРОФИЛІН ЖАҢАРТУ ==========
app.put('/api/users/me', authenticateToken, async (req, res) => {
    const { name, email } = req.body
    if (!name || !email) {
        return res.status(400).json({ error: 'Аты-жөні мен email міндетті' })
    }

    try {
        const result = await db.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role, created_at',
            [name, email, req.user.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пайдаланушы табылмады' })
        }

        res.json({ user: result.rows[0] })
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Бұл email бұрыннан бар' })
        }
        res.status(500).json({ error: err.message })
    }
});

// ========== БЕЛГІ ВИДЕОЛАРЫН АЛУ (барлығына ортақ - аутентификация қажет емес) ==========
app.get('/api/sign-videos', (req, res) => {
    try {
        const videoFile = path.join(__dirname, 'video_links.json');
        
        // Файл бар ма тексеру
        if (!fs.existsSync(videoFile)) {
            return res.status(404).json({ error: 'Видео файлы табылмады' });
        }
        
        const videoData = JSON.parse(fs.readFileSync(videoFile, 'utf-8'));
        res.json(videoData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== БЕЛГІ ВИДЕОСЫН СӨЗБЕН АЛУ ==========
app.get('/api/sign-videos/:word', (req, res) => {
    try {
        const word = req.params.word.toLowerCase();
        const videoFile = path.join(__dirname, 'video_links.json');
        
        if (!fs.existsSync(videoFile)) {
            return res.status(404).json({ error: 'Видео файлы табылмады' });
        }
        
        const videoData = JSON.parse(fs.readFileSync(videoFile, 'utf-8'));
        
        // Қазақша немесе орысша сөзбен іздеу
        const found = videoData.find(v => 
            v.kazakh.toLowerCase() === word || 
            v.russian.toLowerCase() === word
        );
        
        if (!found) {
            return res.status(404).json({ error: 'Сөз табылмады' });
        }
        
        // Нормализовать видео URL
        const result = {
            ...found,
            video_url: found.video_url || (found.links && found.links[0]) || null,
            text: found.kazakh || found.text
        };
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== GROK AI API ==========
app.post('/api/grok', authenticateToken, async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Хабарлама міндетті' });
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Grok API ключі табылмады' });
    }

    try {
        const response = await axios.post(
            'https://api.x.ai/v1/responses',
            {
                model: 'grok-4.20-reasoning',
                input: message
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        // Сөзбен аударуға немесе ауыстыруға жұмыс істеу
        const botResponse = response.data.result || response.data.output || 'Жауап алынбады';

        // Тарихқа сақтау
        await db.query(
            'INSERT INTO translation_history (user_id, text, translation) VALUES ($1, $2, $3)',
            [req.user.id, message, botResponse]
        );

        res.json({
            message: message,
            response: botResponse,
            timestamp: new Date()
        });
    } catch (err) {
        console.error('❌ Grok API қатесі:', err.message);
        res.status(500).json({
            error: 'Grok сервері қосылмады',
            details: err.message
        });
    }
});

// ========== СЕРВЕРДІ ІСКЕ ҚОСУ ==========
const server = app.listen(port, () => {
    console.log(`🚀 Сервер портында жұмыс істейді: ${port}`);
    if (!process.env.DATABASE_URL) {
        console.log('ℹ️  Ескерту: .env файлы жоқ немесе DATABASE_URL орнатылмаған. local Postgres үшін DB_USER, DB_HOST, DB_PORT, DB_NAME параметрлерін қосыңыз.');
    }
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Порт ${port} бос емес. Қолданылып жатқан серверді тоқтатып немесе басқа портты қойыңыз.`);
        process.exit(1);
    }
    throw err;
});