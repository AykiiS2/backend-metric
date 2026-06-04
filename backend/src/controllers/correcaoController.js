const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { recognizeEquations } = require('../services/ocrService');
const { corrigirMultiplasEquacoes } = require('../services/mathCorrectorService');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens JPG/PNG são permitidas'));
        }
    }
});

async function corrigirImagem(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Nenhuma imagem enviada'
            });
        }
        
        const imagePath = req.file.path;
        
        const resultadoOCR = await recognizeEquations(imagePath);
        
        await fs.unlink(imagePath).catch(console.error);
        
        if (resultadoOCR.quantidade === 0) {
            return res.status(422).json({
                success: false,
                error: 'Nenhuma equação encontrada na imagem',
                textoRaw: resultadoOCR.textoCompleto
            });
        }
        
        const correcao = corrigirMultiplasEquacoes(resultadoOCR.equacoes);
        
        return res.json({
            success: true,
            ocr: {
                textoCompleto: resultadoOCR.textoCompleto,
                equacoesEncontradas: resultadoOCR.equacoes,
                quantidade: resultadoOCR.quantidade
            },
            correcao
        });
        
    } catch (error) {
        console.error('Erro na correção:', error);
        
        if (req.file?.path) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        
        return res.status(500).json({
            success: false,
            error: 'Erro ao processar imagem',
            message: error.message
        });
    }
}

async function corrigirTexto(req, res) {
    try {
        const { equacoes } = req.body;
        
        if (!equacoes || !Array.isArray(equacoes) || equacoes.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Lista de equações não fornecida ou inválida'
            });
        }
        
        const correcao = corrigirMultiplasEquacoes(equacoes);
        
        return res.json({
            success: true,
            correcao
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    corrigirImagem,
    corrigirTexto,
    upload
};