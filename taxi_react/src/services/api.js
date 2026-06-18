const API_BASE = 'http://localhost:3001/api';

// ========== ТАКСИ ==========
export async function getTaxis() {
  const response = await fetch(`${API_BASE}/taxis`);
  if (!response.ok) throw new Error('Ошибка загрузки такси');
  return response.json();
}

export async function getTaxiById(id) {
  const response = await fetch(`${API_BASE}/taxis/${id}`);
  if (!response.ok) throw new Error('Такси не найдено');
  return response.json();
}

export async function createTaxi(data) {
    const response = await fetch(`${API_BASE}/taxis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Ошибка создания такси');
    return response.json();
}

export async function updateTaxi(id, data) {
  const response = await fetch(`${API_BASE}/taxis/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Ошибка обновления такси');
  return response.json();
}

export async function deleteTaxi(id) {
  const response = await fetch(`${API_BASE}/taxis/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Ошибка удаления такси');
  return response.json();
}

// ========== СТАТЬИ ==========
export async function getArticles() {
  const response = await fetch(`${API_BASE}/articles`);
  if (!response.ok) throw new Error('Ошибка загрузки статей');
  return response.json();
}

export async function getArticleById(id) {
  const response = await fetch(`${API_BASE}/articles/${id}`);
  if (!response.ok) throw new Error('Статья не найдена');
  return response.json();
}

export async function createArticle(data) {
  const response = await fetch(`${API_BASE}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Ошибка создания статьи');
  return response.json();
}

export async function updateArticle(id, data) {
  const response = await fetch(`${API_BASE}/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Ошибка обновления статьи');
  return response.json();
}

export async function deleteArticle(id) {
  const response = await fetch(`${API_BASE}/articles/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Ошибка удаления статьи');
  return response.json();
}


// ========== КОНТАКТЫ ==========
export async function getContacts() {
  try {
    const response = await fetch(`${API_BASE}/contacts`);
    if (!response.ok) throw new Error('Ошибка загрузки контактов');
    return await response.json();
  } catch (error) {
    console.error('API Error (getContacts):', error);
    throw error;
  }
}

export async function updateContacts(data) {
  try {
    const response = await fetch(`${API_BASE}/contacts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Ошибка обновления контактов');
    return await response.json();
  } catch (error) {
    console.error('API Error (updateContacts):', error);
    throw error;
  }
}

// ========== КОНФИГУРАЦИЯ САЙТА ==========
export async function getSiteConfig() {
  const response = await fetch(`${API_BASE}/site-config`);
  if (!response.ok) throw new Error('Ошибка загрузки конфигурации');
  return response.json();
}

export async function updateSiteConfig(data) {
  const response = await fetch(`${API_BASE}/site-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Ошибка обновления конфигурации');
  return response.json();
}

// ========== АВТОРИЗАЦИЯ ==========
export async function adminLogin(password) {
  try {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Неверный пароль');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error (adminLogin):', error);
    throw error;
  }
}

export async function adminCheck() {
  try {
    const response = await fetch(`${API_BASE}/admin/check`);
    if (!response.ok) throw new Error('Ошибка проверки администратора');
    return await response.json();
  } catch (error) {
    console.error('API Error (adminCheck):', error);
    throw error;
  }
}

export async function updateAdminPassword(oldPassword, newPassword) {
  try {
    const response = await fetch(`${API_BASE}/admin/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка обновления пароля');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error (updateAdminPassword):', error);
    throw error;
  }
}