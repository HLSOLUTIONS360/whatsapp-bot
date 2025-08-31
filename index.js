const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Variável para armazenar o último QR
let lastQr;

// Inicia o cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

// Gera o QR Code no terminal e guarda
client.on('qr', qr => {
    lastQr = qr;
    qrcode.generate(qr, { small: true });
});

// Confirmação de login
client.on('ready', () => {
    console.log('🤖 Bot HL Solutions 360 está ONLINE!');
});

// Carregar imagens
const logo = MessageMedia.fromFilePath(path.join(__dirname, 'logo.png'));
const mascote = MessageMedia.fromFilePath(path.join(__dirname, 'mascote.png'));

// Evento de mensagem
client.on('message', async msg => {
    if (msg.body && msg.body.length > 0) {
        // Envia logo e mascote na primeira interação
        await msg.reply(logo);
        await msg.reply("🤖 Bem-vindo à empresa *HL Solutions 360*! \nSou a assistente virtual da HL Solutions 360 e estou aqui para ajudar você.");
        await msg.reply(mascote);

        // Exibe menu
        const menu = `
Escolha uma opção:

1️⃣ Criar site para minha empresa
2️⃣ Sistemas completos (cadastro, notas fiscais, etc.)
3️⃣ Cursos de Informática e Programação
4️⃣ Segurança Cibernética para empresas
5️⃣ Falar com um atendente humano
6️⃣ Contratar nosso serviço de Chatbot 🤖

Digite o número da opção desejada.
        `;
        await msg.reply(menu);
    }

    // Tratamento de opções
    switch (msg.body) {
        case "1":
            await msg.reply("🌐 Você escolheu *Criar site para minha empresa*. Nossa equipe irá ajudar você a ter presença digital com um site profissional.");
            break;
        case "2":
            await msg.reply("📊 Você escolheu *Sistemas completos*. Trabalhamos com soluções sob medida para cadastro, emissão de notas fiscais e muito mais.");
            break;
        case "3":
            await msg.reply("💻 Você escolheu *Cursos de Informática e Programação*. Temos formações para iniciantes e avançados.");
            break;
        case "4":
            await msg.reply("🔐 Você escolheu *Segurança Cibernética*. Oferecemos soluções de proteção para empresas contra ameaças digitais.");
            break;
        case "5":
            await msg.reply("📞 Você escolheu *Falar com um atendente humano*. Em breve alguém da nossa equipe entrará em contato.");
            break;
        case "6":
            await msg.reply("🤖 Você escolheu *Contratar nosso serviço de Chatbot*. Nossa equipe vai te mostrar como automatizar seu atendimento de forma profissional.");
            break;
        default:
            break;
    }
});

// Rotas Express
app.get("/", (req, res) => {
    res.send("🤖 WhatsApp Bot HL Solutions 360 rodando na nuvem!");
});

// Rota para exibir QR Code
app.get("/qr", (req, res) => {
    if (!lastQr) {
        return res.send("❌ Nenhum QR Code gerado ainda, aguarde alguns segundos...");
    }
    const html = `
    <html>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column">
            <h2>📲 Escaneie o QR Code abaixo:</h2>
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=${lastQr}&size=300x300" />
        </body>
    </html>
    `;
    res.send(html);
});

// Servidor Express
app.listen(PORT, () => {
    console.log(`🌍 Servidor online na porta ${PORT}`);
});

// Inicia o cliente WhatsApp
client.initialize();
