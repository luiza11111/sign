require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL қосылуы
const db = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      }
);

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
            return res.status(401).json({ error: 'Қолданушы табылмады' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
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

// ========== БЕЛГІ ВИДЕОЛАРЫН АЛУ (барлығына ортақ) ==========
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
        
        res.json(found);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== СЕРВЕРДІ ІСКЕ ҚОСУ ==========
app.listen(port, () => {
    console.log(`🚀 Сервер https://sign-0urr.onrender.com портында жұмыс істейді`);
});