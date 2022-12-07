const express = require('express');

const app = express();

const path = require('path');

const nodemailer = require('nodemailer');

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

const configEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pablo269704@gmail.com',
        pass: 'xbqqzcyhztqsgcta'
    }
}); 


mongoClient.connect('mongodb+srv://pablo:55214096@cluster0.8jk54pf.mongodb.net/?retryWrites=true&w=majority')
.then(client => {
    
    console.log('conectou no banco');
    
    const db = client.db('cadastro');
    
    const collection = db.collection('pessoa');

    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/public', express.static(__dirname + '/public'));

    app.post('/cadastro', async(req, res) => {

        const {email} = req.body;
        const login = await db.collection('pessoa').findOne({email});

        if(!req.body['email'] || !req.body['senha']) {
            res.send('Campo email ou senha está vazio');
        }

        else if (login) {
            res.render(path.join(__dirname, '/views', '/erro', 'erro.ejs'), {mensagem: 'Usuário(a) já cadastrado(a) na plataforma'});
        }
        
        else {
            const emailOptions = {
                from: 'pablo269704@gmail.com',
                to: req.body.email,
                subject: 'Cadastro',
                text: 'Cadastro concluído com sucesso, você já pode logar na plataforma'
            }
    
            configEmail.sendMail(emailOptions)
            .then(info => {
                console.log('Cadastro concluído com sucesso');
                collection.insertOne(req.body);
            })
            .catch(err => console.log(err));
        }
        
        app.set('view engine', 'ejs');
        
        res.render(path.join(__dirname, '/views', '/cadastroFeito', 'concluido.ejs'));
    });

    app.post('/login', async(req, res) => {
            app.set('view engine', 'ejs');
            if(!req.body.email || !req.body.senha) {
                res.render(path.join(__dirname, '/views', '/erro', 'erro.ejs'), {mensagem: 'Campo email ou senha em branco'});
            }
            else {
                const {email, senha} = req.body;
                const login = await db.collection('pessoa').findOne({email});   
                
                
                if(!login) {
                    res.render(path.join(__dirname, '/views', '/erro', 'erro.ejs'), {mensagem: 'Usuário(a) não encontrado'});
                }

                else if(login.email === email && login.senha === senha) {
                    
                    res.render(path.join(__dirname, '/views', '/logado', 'logado.ejs'), {usuario: email});
                   
                }

                else {
                    res.render(path.join(__dirname, '/views', '/erro', 'erro.ejs'), {mensagem: 'Nome ou senha incorreto'});
                }
            }
        
        });
        
    });
