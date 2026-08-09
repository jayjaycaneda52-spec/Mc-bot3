const mineflayer = require('mineflayer') 
const express = require('express') 

// RENDER STILL AWAKE
const app = express() 
const PORT = process.env.PORT || 3000 
app.get('/', (req, res) => res.send('Bot Online')) 
app.listen(PORT, () => console.log('HTTP server running')) 

// 2. DELAY START
setTimeout(startBot, 25000) 

function startBot() { 
  console.log('Connecting to ARHCRAFT.srein.xyz...') 
  const bot = mineflayer.createBot({ 
    host: 'ARHCRAFT.srein.xyz', 
    port: 25795, 
    username: 'JamesXd', 
    version: '1.21.11', 
    auth: 'offline', 
    hideErrors: true 
  }) 

  let isReconnecting = false 
  let afkInterval = null 
  const PASSWORD = '123456' // your password here

  bot.on('spawn', () => { 
    console.log('SUCCESS: Nasa loob na ng server') 
    isReconnecting = false 

    // ANTI-AFK NA HINDI SPAM SA CHAT 
    if (afkInterval) clearInterval(afkInterval) 
    afkInterval = setInterval(() => { 
      if (!bot.entity) return 
      const actions = ['jump', 'sneak'] 
      const action = actions[Math.floor(Math.random() * actions.length)] 
      bot.setControlState(action, true) 
      setTimeout(() => bot.setControlState(action, false), 600) 
      bot.look(Math.random() * Math.PI * 2, Math.random() * Math.PI - Math.PI/2) 
      console.log('Anti-AFK: gumalaw') 
    }, 180000) 
  }) 

  // AUTO REGISTER + LOGIN
  bot.on('messagestr', (message) => { 
    const msg = message.toLowerCase()

    // If server asks to register
    if (msg.includes('register') || msg.includes('choose a password') || msg.includes('new account')) {
      setTimeout(() => {
        bot.chat(`/register ${12345678} ${12345678}`)
        console.log('Sent: /register ' + 12345678)
      }, 2500)
    }

    // If server asks to login
    if (msg.includes('login') || msg.includes('enter your password') || msg.includes('account not logged in')) {
      setTimeout(() => {
        bot.chat(`/login ${12345678}`)
        console.log('Sent: /login ' + 12345678)
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
      console.log('May nag-check ng AFK sa chat') 
    } 
  }) 

  // SAFE RECONNECT - 90 SECONDS DELAY PARA DI MA-DETECT AS BOT 
  function reconnect() { 
    if (isReconnecting) return 
    isReconnecting = true 
    if (afkInterval) clearInterval(afkInterval) 
    console.log('Na-disconnect. Reconnect after 90 seconds para safe...') 
    setTimeout(() => { 
      startBot() 
    }, 90000) 
  } 

  bot.on('end', reconnect) 
  bot.on('kicked', (reason) => { 
    console.log('Na-kick:', reason) 
    reconnect() 
  }) 
  bot.on('error', err => { 
    console.log('Error lang:', err.message) 
  }) 
        }
