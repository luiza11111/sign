// Grok AI Service

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const grokService = {
  /**
   * Отправить сообщение Grok AI
   * @param {string} message - Текст сообщения
   * @param {string} token - JWT токен аутентификации
   * @returns {Promise} Ответ от AI
   */
  async sendMessage(message, token) {
    if (!message.trim()) {
      throw new Error('Сообщение не может быть пустым');
    }

    if (!token) {
      throw new Error('Требуется аутентификация');
    }

    try {
      const response = await fetch(`${API_URL}/api/grok`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка при обработке запроса');
      }

      return await response.json();
    } catch (error) {
      console.error('Grok API error:', error);
      throw error;
    }
  },

  /**
   * Получить историю сообщений (из translation_history)
   * @param {string} token - JWT токен аутентификации
   * @returns {Promise} История сообщений
   */
  async getHistory(token) {
    if (!token) {
      throw new Error('Требуется аутентификация');
    }

    try {
      const response = await fetch(`${API_URL}/api/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка получения истории');
      }

      return await response.json();
    } catch (error) {
      console.error('History fetch error:', error);
      throw error;
    }
  },

  /**
   * Очистить историю (удалить запись)
   * @param {number} id - ID записи
   * @param {string} token - JWT токен аутентификации
   * @returns {Promise} Результат удаления
   */
  async deleteHistoryItem(id, token) {
    if (!token) {
      throw new Error('Требуется аутентификация');
    }

    try {
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
};

export default grokService;
