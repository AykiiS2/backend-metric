const express = require('express');
const router = express.Router();
const { corrigirImagem, corrigirTexto, upload } = require('../controllers/correcaoController');

router.post('/imagem', upload.single('imagem'), corrigirImagem);
router.post('/texto', corrigirTexto);

module.exports = router;