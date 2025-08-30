const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const qrcode = require("qrcode");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

let lastQr; // guarda o último QR gerado

// 🔹 Inicializa o cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu"
    ]
  }
});

// 🔹 Gera QR Code e salva
client.on("qr", async qr => {
  try {
    lastQr = await qrcode.toDataURL(qr); // transforma QR em imagem base64
    console.log("📲 QR Code atualizado! Acesse /qr no navegador para escanear.");
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err);
  }
});

// 🔹 Quando conectar com sucesso
client.on("ready", () => {
  console.log("✅ WhatsApp Bot conectado com sucesso!");
});

// 🔹 Responde mensagens recebidas
client.on("message", async msg => {
  const message = msg.body.toLowerCase();

  if (message.includes("bom dia")) {
    await msg.reply("☀️ Bom dia! Como posso te ajudar hoje?");
    return;
  }
  if (message.includes("boa tarde")) {
    await msg.reply("🌤️ Boa tarde! Espero que seu dia esteja ótimo!");
    return;
  }
  if (message.includes("boa noite")) {
    await msg.reply("🌙 Boa noite! Precisa de alguma ajuda?");
    return;
  }

  // Lista de opções
  const resposta = `
📌 *Bem-vindo ao Chatbot da HL Solutions 360!*

Escolha uma opção:
1️⃣ Criar site para minha empresa  
2️⃣ Sistemas completos (cadastro, notas fiscais etc.)  
3️⃣ Cursos de Informática e Programação  
4️⃣ Segurança Cibernética para empresas  
5️⃣ Falar com um atendente humano  

Digite o número da opção desejada.
  `;

  await msg.reply(resposta);
});

// 🔹 Inicia o cliente
client.initialize();

// 🔹 Rota principal
app.get("/", (req, res) => {
  res.send("🤖 WhatsApp Bot HL Solutions 360 rodando na nuvem!");
});

// 🔹 Rota para exibir o QR Code
app.get("/qr", (req, res) => {
  if (!lastQr) {
    return res.send("❌ Nenhum QR Code gerado ainda, aguarde alguns segundos...");
  }
  const html = `
    <html>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;">
        <h2>📲 Escaneie o QR Code abaixo:</h2>
        <img src="${lastQr}" />
      </body>
    </html>
  `;
  res.send(html);
});

// 🔹 Servidor Express
app.listen(PORT, () => {
  console.log(`🌐 Servidor online na porta ${PORT}`);
});
