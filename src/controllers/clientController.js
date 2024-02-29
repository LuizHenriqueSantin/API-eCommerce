const connection = require('../mysql').connection;
const bcrypt = require("bcrypt");

createUser = (req,res) => {

    const senhaCriptografada = bcrypt.hashSync(req.body.senha, 10);

    connection.query(
        'INSERT INTO clientes (nome, email, senha) VALUES (?,?,?)',
        [req.body.nome, req.body.email, senhaCriptografada],
        (error, results, fields) => {
            if(error){
                return res.status(500).send("Nao foi possivel efetuar cadastro");
            }
            return res.status(200).send("Usuario cadastrado com sucesso");
        }
    )
}

login = (req, res) => {
    connection.query(
      'SELECT * FROM clientes WHERE email = ?',
      [req.body.email],
      (error, results, fields) => {
        if (error) {
          return res.status(500).send("Erro ao consultar o banco de dados");
        }
        if (Object.keys(results).length < 1) {
          return res.status(400).send("Usuário não encontrado");
        }
        bcrypt.compare(req.body.senha, results[0].senha, (error, result) => {
          if (result) {
            res.status(200).send("Usuário logado");
          } else {
            res.status(400).send("Usuário não autenticado");
          }
        });
      }
    );
  };

module.exports = {createUser, login};