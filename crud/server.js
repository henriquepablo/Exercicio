const express = require('express');

const app = express();

const path = require('path');

const mongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser');

const routerTelaLogin = require('./routes/login');

const routerCadastro = require('./routes/cadastro');

app.use(express.static('./views/tela-login/style.css'));
app.use(routerTelaLogin);
app.use(routerCadastro);

app.listen(3002, () => {
    console.log('Servidor rodando na porta 3002');
});

mongoClient.connect('mongodb+srv://pablo:55214096@cluster0.8jk54pf.mongodb.net/?retryWrites=true&w=majority')
.then(client => {
    
    console.log('conectou no banco');
    
    const db = client.db('cadastro');
    
    const collection = db.collection('pessoa');

    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/public', express.static(__dirname + '/public'));

    app.post('/cadastro', (req, res) => {

        if(!req.body['nome'] || !req.body['senha']) {
            res.send('Campo nome ou senha está vazio');
        }
        else collection.insertOne(req.body);
        
        res.send('Cadastro concluído');
    });

    app.post('/login', async(req, res) => {
        
            if(!req.body.nome || !req.body.senha) {
                res.send('Campo nome ou senha está em branco');
            }
            else {
                const {nome, senha} = req.body;
                const login = await db.collection('pessoa').findOne({nome});   
                app.set('view engine', 'ejs');
                if(!login) {
                    res.render(path.join(__dirname, '/views', '/erro', 'erro.ejs'), {mensagem: 'Usuário(a) não encontrado'});
                }

                else if(login.nome === nome && login.senha === senha) {
                    
                    res.render(path.join(__dirname, '/views', '/logado', 'logado.ejs'), {usuario: nome});
                   
                }

                else {
                    res.render(path.join(__dirname, '/views', '/erro', 'erro.ejs'), {mensagem: 'Nome ou senha incorreto'});
                }
            }
        
        });
        
    });
