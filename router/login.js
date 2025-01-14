import fetch from 'node-fetch'

const USERS_API_URL = 'https://back-end-6der.onrender.com/users'

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' })
  }

  try {
    // Busca todos os usuários da API
    const response = await fetch(USERS_API_URL)
    const users = await response.json()

    // Encontra o usuário correspondente
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      return res.status(200).json({ message: 'Login bem-sucedido', userId: user.id, name: user.name })
    } else {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    res.status(500).json({ message: 'Erro interno no servidor' })
  }
})
