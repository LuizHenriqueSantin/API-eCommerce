const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post('/create-product', productController.createProduct);
router.post('/pedido', productController.createPedido);
router.put('/pedido/:id', productController.updatePedido);
router.post('/cadastro-venda', productController.venda);

module.exports = router;