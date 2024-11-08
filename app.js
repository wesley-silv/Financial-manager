const express = require('express')
const path = require('path')
const session = require('express-session')
const app = express()
const port = 3000

// Middleware para gerenciar sessões
app.use(
  session({
    secret: 'chave-secreta', // Use uma chave secreta forte
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Configure como 'true' em produção com HTTPS
  })
)

// Middleware para tratar dados de formulários
app.use(express.urlencoded({ extended: true }))

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'src')))

// Função de middleware para verificar autenticação
function requireAuth(req, res, next) {
  if (req.session.authenticated) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Rota de Login - renderiza o formulário de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

// Rota para processar o Login
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // Autenticação básica: substitua isso por verificação com banco de dados
  if (
    username === 'wesleysilvaconceicao@outlook.com' &&
    password === 'financial'
  ) {
    req.session.authenticated = true
    res.redirect('/')
  } else {
    res.send('Credenciais inválidas! Tente novamente.')
  }
})

// Rota para Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Erro ao sair da sessão.')
    }
    res.redirect('/login')
  })
})

// Rota para página inicial (proteção com autenticação)
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.listen(port, () => {
  console.log(`Servidor executando em http://localhost:${port}/login`)
})
