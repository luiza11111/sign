require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// デモモード用のダミーデータ
const demoUsers = {
  'demo@sign.kz': {
    id: 1,
    name: 'Демо пайдаланушы',
    email: 'demo@sign.kz',
    password_hash: '$2a$10$demo_hash',
    role: 'user'
  }
};

const demoTranslations = [
  { id: 1, user_id: 1, text: 'Сәлем', translation: 'Привет', created_at: new Date() },
  { id: 2, user_id: 1, text: 'Рахмет', translation: 'Спасибо', created_at: new Date() }
];

const demoDictionary = [
  { id: 1, text: 'Сәлем', video_url: '', category: 'Амандану' },
  { id: 2, text: 'Рахмет', video_url: '', category: 'Амандану' },
  { id: 3, text: 'Иә', video_url: '', category: 'Жауап' },
  { id: 4, text: 'Жоқ', video_url: '', category: 'Жауап' }
];

console.log('🚀 Демо режимі қосылды');
console.log(`🔧 Сервер портында жұмыс істейді: ${port}`);
console.log('⚠️  ВНИМАНИЕ: Это демо-версия с фиктивными данными!');

// Demo Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'demo@sign.kz' && password === 'demo') {
    const user = demoUsers[email];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'demo-secret',
      { expiresIn: '24h' }
    );
    
    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  }
  
  // Default demo user auto-login
  const demoUser = Object.values(demoUsers)[0];
  const token = jwt.sign(
    { id: demoUser.id, email: demoUser.email, role: demoUser.role },
    process.env.JWT_SECRET || 'demo-secret',
    { expiresIn: '24h' }
  );
  
  return res.json({
    success: true,
    token,
    user: { id: demoUser.id, name: demoUser.name, email: demoUser.email, role: demoUser.role }
  });
});

// Demo Register endpoint
app.post('/api/register', (req, res) => {
  return res.json({
    success: true,
    message: 'Тіркелу сәтті (демо режимі)!'
  });
});

// Demo Translation History endpoint
app.get('/api/translation-history', (req, res) => {
  return res.json(demoTranslations);
});

app.post('/api/translation-history', (req, res) => {
  const { text, translation } = req.body;
  const newEntry = {
    id: demoTranslations.length + 1,
    user_id: 1,
    text,
    translation,
    created_at: new Date()
  };
  demoTranslations.push(newEntry);
  return res.json(newEntry);
});

// Demo Dictionary endpoints
app.get('/api/dictionary', (req, res) => {
  return res.json(demoDictionary);
});

app.post('/api/dictionary', (req, res) => {
  const { text, video_url, category } = req.body;
  const newEntry = {
    id: demoDictionary.length + 1,
    text,
    video_url,
    category,
    created_at: new Date()
  };
  demoDictionary.push(newEntry);
  return res.json(newEntry);
});

// Demo Users endpoint
app.get('/api/users', (req, res) => {
  return res.json(Object.values(demoUsers));
});

// Demo Profile endpoint
app.get('/api/users/me', (req, res) => {
  const demoUser = Object.values(demoUsers)[0];
  return res.json({ user: demoUser });
});

app.put('/api/users/me', (req, res) => {
  const { name, email } = req.body;
  const demoUser = Object.values(demoUsers)[0];
  demoUser.name = name || demoUser.name;
  demoUser.email = email || demoUser.email;
  return res.json({ user: demoUser });
});

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`✅ Демо сервер готов! Посетите: http://localhost:${port}`);
  console.log('⏭️  Вход: demo@sign.kz (пароль: demo или любой пароль)');
});
