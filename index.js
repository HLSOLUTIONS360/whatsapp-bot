const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const qrcode = require("qrcode");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// 🔹 Mostra o QR Code como link (mais fácil no Railway)
client.on("qr", async qr => {
  try {
    const qrImageUrl = await qrcode.toDataURL(qr);
    console.log("📲 Escaneie este QR Code para conectar no WhatsApp:");
    console.log("Abra este link no navegador para ver o QR Code:");
    console.log(qrImageUrl);
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

  // Lista padrão de opções
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

// 🔹 Servidor Express (mantém Railway ativo)
app.get("/", (req, res) => {
  res.send("🤖 WhatsApp Bot HL Solutions 360 rodando na nuvem!");
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor online na porta ${PORT}`);
});
