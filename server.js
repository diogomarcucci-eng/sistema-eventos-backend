
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

// Conexao com o Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Rota principal
app.get('/', (req, res) => {
    res.send('Sistema de Eventos Academicos funcionando!');
});

// Listar eventos cadastrados
app.get('/eventos', async (req, res) => {
    const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        return res.status(500).json({
            erro: error.message
        });
    }

    res.json(data);
});

// Cadastrar novos eventos
app.post('/eventos', async (req, res) => {
    const { titulo, descricao, data_evento, local } = req.body;

    if (!titulo || !data_evento || !local) {
        return res.status(400).json({
            erro: 'Preencha titulo, data do evento e local.'
        });
    }

    const { data, error } = await supabase
        .from('eventos')
        .insert([{
            titulo,
            descricao,
            data_evento,
            local
        }])
        .select();

    if (error) {
        return res.status(500).json({
            erro: error.message
        });
    }

    res.status(201).json(data[0]);
});

// Inicializacao do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`);
});
