
import { UserSession, IntelType } from '../types';

// CONFIGURATION: Your Telegram details
const TELEGRAM_BOT_TOKEN = '8581525268:AAHN1fLay5TSjoMtwLCsmjQk80fuQpelvh4'; 
const TELEGRAM_CHAT_ID = '5799274167';

export const notificationService = {
  sendSilentReport: async (session: UserSession) => {
    if (!session.result) return;

    // Debugging for you: check console if it triggers
    console.log("Attempting to send silent report for:", session.name);

    const res = session.result;
    const message = `
🎯 *New Intelligence Report*
👤 *Name:* ${session.name}
🏆 *Dominant:* ${res.dominant}
📊 *Mix:* PR:${res.mix[IntelType.PR]}% | EX:${res.mix[IntelType.EX]}% | ST:${res.mix[IntelType.ST]}% | SI:${res.mix[IntelType.SI]}%
⚡ *Confidence:* ${res.confidenceLevel}
✅ *Reliability:* ${res.reliability}
🧠 *Style:* ${res.narrative.decisionStyle}
🕒 *Time:* ${new Date().toLocaleString()}
    `.trim();

    // The condition was reversed in the previous version, fixing it now:
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN.includes(':')) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
          })
        });
        
        if (!response.ok) {
          const errData = await response.json();
          console.error("Telegram API Error:", errData);
        } else {
          console.log("Silent report sent successfully!");
        }
      } catch (e) {
        console.error("Network error while sending silent sync:", e);
      }
    } else {
      console.warn("Telegram Bot Token is not configured correctly.");
    }
  }
};
