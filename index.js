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

// Evento QR Code
client.on('qr', qr => {
    lastQr = qr;
    qrcode.generate(qr, { small: true });
});

// Evento pronto
client.on('ready', () => {
    console.log('🤖 Bot HL Solutions 360 está ONLINE!');
});

// Evento mensagem recebida
client.on('message', async msg => {
    const texto = msg.body.toLowerCase();

    // Envio de boas-vindas + logo + mascote
    if (texto === 'oi' || texto === 'olá' || texto === 'bom dia' || texto === 'boa tarde' || texto === 'boa noite') {
        const logo = MessageMedia.fromFilePath(path.join(__dirname, 'logo.png'));
        const mascote = MessageMedia.fromFilePath(path.join(__dirname, 'mascote.png'));

        await msg.reply(logo);
        await msg.reply(mascote);

        await msg.reply(
            "👋 Olá! Seja bem-vindo à *HL Solutions 360*.\n" +
            "Eu sou o *Assistente Virtual* da HL Solutions 360 e estou aqui para te ajudar.\n\n" +
            "Escolha uma opção abaixo:\n" +
            "1️⃣ - Desenvolvimento de Sites e Sistemas\n" +
            "2️⃣ - Cursos e Treinamentos\n" +
            "3️⃣ - Consultoria em Segurança Cibernética\n" +
            "4️⃣ - Contratar o serviço de Chatbot\n\n" +
            "Digite o número da opção desejada."
        );
    }

    // Respostas do menu
    if (texto === '1') {
        await msg.reply("🌐 Você escolheu *Desenvolvimento de Sites e Sistemas*.\nOferecemos sites profissionais, sistemas completos e soluções sob medida. 🚀");
    }

    if (texto === '2') {
        await msg.reply("📚 Você escolheu *Cursos e Treinamentos*.\nTemos cursos de Informática, Programação FullStack e muito mais.");
    }

    if (texto === '3') {
        await msg.reply("🔒 Você escolheu *Consultoria em Segurança Cibernética*.\nProteja sua empresa com nossas soluções avançadas de cibersegurança.");
    }

    if (texto === '4') {
        await msg.reply("🤖 Você escolheu *Contratar o serviço de Chatbot*.\nImplantamos chatbots profissionais no WhatsApp para automatizar o atendimento da sua empresa.");
    }
});

// Rota principal
app.get("/", (req, res) => {
    res.send("🤖 WhatsApp Bot HL Solutions 360 rodando na nuvem!");
});

// Rota para exibir o QR Code no navegador
app.get("/qr", (req, res) => {
    if (!lastQr) {
        return res.send("❌ Nenhum QR Code gerado ainda, aguarde alguns segundos...");
    }
    const html = `
    <html>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;">
            <h2>📲 Escaneie o QR Code abaixo:</h2>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${lastQr}" />
        </body>
    </html>
    `;
    res.send(html);
});

// Inicia servidor Express
app.listen(PORT, () => {
    console.log(`🌍 Servidor online na porta ${PORT}`);
});

// Inicializa cliente
client.initialize();
