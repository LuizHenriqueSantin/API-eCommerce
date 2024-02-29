const connection = require('../mysql').connection;

createProduct = (req,res) => {
    connection.query(
        'INSERT INTO produtos (nome, descricao, preco) VALUES (?,?,?)',
        [req.body.nome, req.body.descricao, req.body.preco],
        (error, results, fields) => {
            connection.end();
            if(error){
                return res.status(500).send("Nao foi possivel efetuar cadastro");
            }
            return res.status(200).send("Produto cadastrado com sucesso");
        }
    )
}

createPedido = async (req, res) => {
    try {
      const dia = new Date();
      let insertPedidoId;
  
      await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO pedidos (data_pedido) VALUE (?)',
          [dia],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              insertPedidoId = results.insertId;
              resolve();
            }
          }
        );
      });
  
      const stringProdutos = req.query.produtos;
      const produtos = stringProdutos.split(",");
  
      for (const value of produtos) {
        await new Promise((resolve, reject) => {
          connection.query(
            'INSERT INTO estoque (produto_id, pedido_id) VALUES (?,?)',
            [Number(value), insertPedidoId],
            (error, results, fields) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      }
  
      return res.status(200).send("Pedido adicionado ao estoque");
    } catch (error) {
      return res.status(500).send("Erro ao criar pedido");
    }
  };

  updatePedido = async (req, res) => {
    try {
      const id = req.params.id;
      const dia = new Date();
  
      await new Promise((resolve, reject) => {
        connection.query(
          'UPDATE pedidos SET data_entrega=? WHERE id=?',
          [dia, id],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });
  
      await new Promise((resolve, reject) => {
        connection.query(
          'UPDATE estoque SET pedido_entregue=1 WHERE pedido_id=?',
          [id],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });

      return res.status(200).send("Entrega cadastrada com sucesso");
    } catch (error) {
      return res.status(500).send("Erro ao atualizar o pedido");
    }
  };

  venda = async (req, res) => {
    try {
        const stringQuantidade = req.query.quantidade;
        const stringProdutos = req.query.produtos;
        const cliente = req.query.id;
        const produtos = stringProdutos.split(",");
        const quantidade = stringQuantidade.split(",");
        const dia = new Date();
        let vensdaId; // Definindo a variável vensdaId fora do escopo do bloco

        for (let index = 0; index < produtos.length; index++) {
            const produtoId = Number(produtos[index]);
            const quantidadeProduto = Number(quantidade[index]);

            await new Promise((resolve, reject) => {
                connection.query(
                    'SELECT * FROM estoque WHERE produto_id = ? AND venda_id IS NULL AND pedido_entregue = 1',
                    [produtoId],
                    (error, results, fields) => {
                        if (error) {
                            reject(error);
                        } else if (results.length >= quantidadeProduto) {
                            resolve();
                        } else {
                            reject(`Produto ${produtoId} não está disponível em quantidade suficiente.`);
                        }
                    }
                );
            });
        }

        await new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO vendas (data,cliente_id) VALUES (?,?)",
                [dia, cliente],
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        vensdaId = results.insertId; // Definindo vensdaId aqui para acessá-lo posteriormente
                        resolve();
                    }
                }
            );
        });

        for (let index = 0; index < produtos.length; index++) {
            await new Promise((resolve, reject) => {
                connection.query(
                    "UPDATE estoque SET venda_id = ? WHERE produto_id = ? AND venda_id IS NULL AND pedido_entregue = 1 LIMIT ?",
                    [vensdaId, Number(produtos[index]), Number(quantidade[index])],
                    (error, results, fields) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            });
        }

        return res.status(200).send("Venda cadastrada com sucesso!");
    } catch (error) {
        console.error("Erro ao cadastrar venda:", error);
        return res.status(500).send("Erro ao cadastrar venda");
    }
};

module.exports = {createProduct, createPedido, updatePedido, venda};