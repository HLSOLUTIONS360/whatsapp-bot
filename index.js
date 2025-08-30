const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Inicializa o cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(), // guarda a sessão
  puppeteer: { headless: true }
});

// 🔹 Mostra o QR Code no terminal
client.on("qr", qr => {
  console.log("📲 Escaneie este QR Code para conectar no WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// 🔹 Quando conectar com sucesso
client.on("ready", () => {
  console.log("✅ WhatsApp Bot conectado com sucesso!");
});

// 🔹 Responde mensagens recebidas
client.on("message", async msg => {
  const message = msg.body.toLowerCase();

  // Saudações
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

// 🔹 Servidor Express só para manter Railway ativo
app.get("/", (req, res) => {
  res.send("🤖 WhatsApp Bot HL Solutions 360 rodando!");
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor online na porta ${PORT}`);
});
