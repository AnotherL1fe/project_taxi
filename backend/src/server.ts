import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Простая админ-авторизация
const ADMIN_CREDENTIALS = {
  login: 'admin',
  password: 'admin123'
};

// ========== TAXIS ROUTES ==========
app.get('/api/taxis', async (req: Request, res: Response) => {
  try {
    const taxis = await prisma.taxis.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(taxis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/taxis/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const taxi = await prisma.taxis.findUnique({
      where: { id }
    });
    if (!taxi) return res.status(404).json({ error: 'Такси не найдено' });
    res.json(taxi);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/taxis', async (req: Request, res: Response) => {
  try {
    // Поддерживаем как старый формат (phone), так и новый (phones)
    let phonesData = req.body.phones;
    if (!phonesData && req.body.phone) {
      phonesData = [req.body.phone];
    }
    if (!phonesData || !Array.isArray(phonesData)) {
      phonesData = [];
    }
    
    const taxi = await prisma.taxis.create({
      data: {
        name: req.body.name,
        phones: phonesData,
        time: req.body.time,
        price: req.body.price,
        class: req.body.class,
        description: req.body.description
      }
    });
    res.json(taxi);
  } catch (error: any) {
    console.error('Ошибка создания такси:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/taxis/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Поддерживаем как старый формат (phone), так и новый (phones)
    let phonesData = req.body.phones;
    if (!phonesData && req.body.phone) {
      phonesData = [req.body.phone];
    }
    if (!phonesData || !Array.isArray(phonesData)) {
      phonesData = [];
    }
    
    const taxi = await prisma.taxis.update({
      where: { id },
      data: {
        name: req.body.name,
        phones: phonesData,
        time: req.body.time,
        price: req.body.price,
        class: req.body.class,
        description: req.body.description
      }
    });
    res.json(taxi);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/taxis/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.taxis.delete({
      where: { id }
    });
    res.json({ message: 'Такси удалено' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ARTICLES ROUTES ==========
app.get('/api/articles', async (req: Request, res: Response) => {
  try {
    const articles = await prisma.articles.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(articles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const article = await prisma.articles.findUnique({
      where: { id }
    });
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles', async (req: Request, res: Response) => {
  try {
    const article = await prisma.articles.create({
      data: req.body
    });
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const article = await prisma.articles.update({
      where: { id },
      data: req.body
    });
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.articles.delete({
      where: { id }
    });
    res.json({ message: 'Статья удалена' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CONTACTS ROUTES ==========
app.get('/api/contacts', async (req: Request, res: Response) => {
  try {
    let contacts = await prisma.contacts.findFirst();
    
    if (!contacts) {
      contacts = await prisma.contacts.create({
        data: {
          email: 'info@taxi-city.ru',
          phone: '+7 (800) 123-45-67',
          address: 'г. Волхов, ул. Ленина, 1',
          workHours: 'Круглосуточно'
        }
      });
    }
    
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/contacts', async (req: Request, res: Response) => {
  try {
    let contacts = await prisma.contacts.findFirst();
    
    if (contacts) {
      contacts = await prisma.contacts.update({
        where: { id: contacts.id },
        data: req.body
      });
    } else {
      contacts = await prisma.contacts.create({
        data: req.body
      });
    }
    
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== SITE CONFIG ROUTES ==========
app.get('/api/site-config', async (req: Request, res: Response) => {
  try {
    let config = await prisma.siteConfig.findUnique({
      where: { id: 1 }
    });
    
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          aboutText: '«Такси города Волхов» — это удобный каталог таксопарков вашего города.',
          bannerDesk: 'https://placehold.co/800x100/2c2c2c/F59A2F?text=ТАКСИ+ПРОЕКТ',
          bannerMobile: 'https://placehold.co/300x100/2c2c2c/F59A2F?text=Такси'
        }
      });
    }
    
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/site-config', async (req: Request, res: Response) => {
  try {
    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: req.body,
      create: { id: 1, ...req.body }
    });
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ADMIN AUTH ==========
app.get('/api/admin/check', async (req: Request, res: Response) => {
  try {
    const admin = await prisma.admin.findFirst();
    res.json({ exists: !!admin });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/login', async (req: Request, res: Response) => {
  const { password } = req.body;
  
  try {
    if (!password) {
      return res.status(400).json({ error: 'Пароль обязателен' });
    }

    let admin = await prisma.admin.findFirst();

    if (!admin) {
      admin = await prisma.admin.create({
        data: { password }
      });
      return res.json({ 
        success: true, 
        message: 'Администратор создан. Вход выполнен.',
        token: 'fake-jwt-token'
      });
    }

    if (password === admin.password) {
      res.json({ 
        success: true, 
        message: 'Вход выполнен успешно',
        token: 'fake-jwt-token'
      });
    } else {
      res.status(401).json({ error: 'Неверный пароль' });
    }
  } catch (error: any) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка сервера при авторизации' });
  }
});

app.put('/api/admin/password', async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  
  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Старый и новый пароль обязательны' });
    }
    
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      return res.status(404).json({ error: 'Администратор не найден' });
    }
    
    if (oldPassword !== admin.password) {
      return res.status(401).json({ error: 'Старый пароль неверен' });
    }
    
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: { password: newPassword }
    });
    
    res.json({ success: true, message: 'Пароль обновлен' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 API доступен по адресу http://localhost:${PORT}/api`);
});