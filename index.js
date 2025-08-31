const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Variável para armazenar o último QR Code
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

// Mensagem inicial com imagens
client.on('message', async msg => {
    const texto = msg.body.toLowerCase();

    // Primeira interação
    if (texto === 'oi' || texto === 'olá' || texto === 'bom dia' || texto === 'boa tarde' || texto === 'boa noite') {
        try {
            // Enviar logo
            const logo = MessageMedia.fromFilePath(path.join(__dirname, 'logo.png'));
            await client.sendMessage(msg.from, logo);

            // Enviar mascote
            const mascote = MessageMedia.fromFilePath(path.join(__dirname, 'mascote.png'));
            await client.sendMessage(msg.from, mascote);

            // Mensagem de boas-vindas
            await client.sendMessage(
                msg.from,
                `👋 Bem-vindo à empresa *HL Solutions 360*!  
Sou o *assistente virtual* e estou aqui para ajudar você.  
Escolha uma opção abaixo digitando o número correspondente:  

1️⃣ Criar site para minha empresa  
2️⃣ Sistemas completos (cadastro, notas fiscais etc.)  
3️⃣ Cursos de Informática e Programação  
4️⃣ Segurança Cibernética para empresas  
5️⃣ Falar com um atendente humano  
6️⃣ Contratar o serviço de Chatbot 🤖`
            );
        } catch (err) {
            console.error('Erro ao enviar imagens:', err);
        }
    }

    // Respostas de acordo com a opção
    if (texto === '1') {
        await client.sendMessage(msg.from, "🌐 Você escolheu *Criar site para sua empresa*! Nossa equipe entrará em contato para entender sua necessidade e apresentar a melhor proposta.");
    }

    if (texto === '2') {
        await client.sendMessage(msg.from, "💼 Você escolheu *Sistemas completos*! Oferecemos soluções sob medida para cadastro, emissão de notas fiscais e muito mais.");
    }

    if (texto === '3') {
        await client.sendMessage(msg.from, "📚 Você escolheu *Cursos de Informática e Programação*! Temos treinamentos práticos para iniciantes e avançados.");
    }

    if (texto === '4') {
        await client.sendMessage(msg.from, "🛡️ Você escolheu *Segurança Cibernética*! Nossos especialistas podem proteger sua empresa contra ataques virtuais.");
    }

    if (texto === '5') {
        await client.sendMessage(msg.from, "☎️ Você escolheu falar com um *atendente humano*. Aguarde um momento, em breve alguém da nossa equipe entrará em contato.");
    }

    if (texto === '6') {
        await client.sendMessage(msg.from, "🤖 Você escolheu *Contratar nosso serviço de Chatbot*! Nossa equipe comercial entrará em contato para apresentar o pacote ideal para você.");
    }
});

// Inicializa o cliente
client.initialize();

// 🚀 Rotas do servidor Express
app.get("/", (req, res) => {
    res.send("🤖 WhatsApp Bot HL Solutions 360 rodando na nuvem!");
});

app.get("/qr", (req, res) => {
    if (!lastQr) {
        return res.send("❌ Nenhum QR Code gerado ainda, aguarde alguns segundos...");
    }

    const html = `
    <html>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;">
        <h2>📲 Escaneie o QR Code abaixo para conectar no WhatsApp:</h2>
        <img src="${lastQr}" />
      </body>
    </html>
    `;
    res.send(html);
});

// Inicia servidor Express no Railway
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌍 Servidor online na porta ${PORT}`);
});
