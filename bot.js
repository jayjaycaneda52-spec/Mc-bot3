const mineflayer = require('mineflayer') 
const express = require('express') 

// KEEP RENDER AWAKE - HTTP SERVER
const app = express() 
const PORT = process.env.PORT || 3000 
app.get('/', (req, res) => res.send('Bot Online')) 
app.listen(PORT, () => console.log(`HTTP server running on port ${PORT}`)) 

// DELAY START BY 25 SECONDS
setTimeout(startBot, 25000) 

function startBot() { 
  console.log('Connecting to ARHCRAFT.srein.xyz...') 
  
  const bot = mineflayer.createBot({ 
    host: 'ARHCRAFT.srein.xyz', 
    port: 25795, 
    username: 'JamesXd', 
    password: process.env.PASSWORD, // Get password from Render Environment Variables
    version: '1.21.11', 
    auth: 'offline', // Changed to microsoft. Use 'offline' if server is cracked
    hideErrors: false // Set to true if you don't want error spam
  }) 

  let isReconnecting = false 
  let afkInterval = null 

  bot.on('spawn', () => { 
    console.log('SUCCESS: Bot is now in the server') 
    isReconnecting = false 
    
    // ANTI-AFK SYSTEM - RANDOM MOVEMENT TO AVOID KICK
    if (afkInterval) clearInterval(afkInterval) 
    afkInterval = setInterval(() => { 
      if (!bot.entity) return 
      const actions = ['jump', 'sneak'] 
      const action = actions[Math.floor(Math.random() * actions.length)] 
      bot.setControlState(action, true) 
      setTimeout(() => bot.setControlState(action, false), 600) 
      bot.look(Math.random() * Math.PI * 2, Math.random() * Math.PI - Math.PI/2) 
      console.log('Anti-AFK: Performed random movement') 
    }, 180000) // Every 3 minutes
  }) 

  // AUTO REGISTER + LOGIN
  bot.on('messagestr', (message) => { 
    const msg = message.toLowerCase() 
    
    // If server asks to register
    if (msg.includes('register') || msg.includes('choose a password') || msg.includes('new account')) { 
      setTimeout(() => { 
        bot.chat(`/register ${process.env.PASSWORD} ${process.env.PASSWORD}`) 
        console.log('Sent: /register command') 
      }, 2500) 
    } 
    
    // If server asks to login
    if (msg.includes('login') || msg.includes('enter your password') || msg.includes('account not logged in')) { 
      setTimeout(() => { 
        bot.chat(`/login ${process.env.PASSWORD}`) 
        console.log('Sent: /login command') 
      }, 2500) 
    } 
    
    // AUTO ACCEPT TPA
    if (msg.includes('has requested to teleport to you')) { 
      setTimeout(() => { 
        bot.chat('/tpaccept') 
        console.log('TP request accepted') 
      }, 1500) 
    } 
    
    if (msg.includes('afk')) { 
      console.log('Someone checked AFK in chat') 
    } 
  }) 

  // SAFE RECONNECT - 90 SECONDS DELAY TO AVOID BOT DETECTION
  function reconnect() { 
    if (isReconnecting) return 
    isReconnecting = true 
    if (afkInterval) clearInterval(afkInterval) 
    console.log('Disconnected. Reconnecting after 90 seconds to stay safe...') 
    setTimeout(() => { 
      startBot() 
    }, 90000) 
  } 
  
  bot.on('end', reconnect) 
  bot.on('kicked', (reason) => { 
    console.log('Kicked:', reason) 
    reconnect() 
  }) 
  
  bot.on('error', err => { 
    console.log('Error:', err.message) 
  }) 
}
