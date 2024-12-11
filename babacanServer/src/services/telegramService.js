const axios = require('axios');

const telegramService = {};

// Send a message via Telegram bot
telegramService.sendMessage = async (chatId, message) => {
  try {
    const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: message,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Telegram Error: ${error.message}`);
  }
};

// Notify admins of new events
telegramService.notifyAdmins = async (message) => {
  const adminChatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS.split(',');
  for (const chatId of adminChatIds) {
    await telegramService.sendMessage(chatId, message);
  }
};

module.exports = telegramService;
