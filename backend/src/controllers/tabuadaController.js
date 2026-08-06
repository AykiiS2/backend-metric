import Tabuada from '../models/Tabuada.js';

const tabuadaModel = new Tabuada();

export const salvarTabuada = async (req, res) => {
  try {
    const { titulo, tabuadas } = req.body;
    
    if (!titulo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Título é obrigatório' 
      });
    }

    if (!tabuadas) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dados da tabuada são obrigatórios' 
      });
    }

    const { data, error } = await tabuadaModel.create(titulo, tabuadas);
    
    if (error) throw error;
    
    res.status(201).json({ 
      success: true, 
      data: data[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const listarTabuadas = async (req, res) => {
  try {
    const { data, error } = await tabuadaModel.findAll();
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const buscarTabuadaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID é obrigatório' 
      });
    }

    const { data, error } = await tabuadaModel.findById(id);
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tabuada não encontrada' 
      });
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const deletarTabuada = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID é obrigatório' 
      });
    }

    const { data, error } = await tabuadaModel.delete(id);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tabuada não encontrada' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Tabuada deletada com sucesso' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const atualizarTabuada = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, tabuadas } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID é obrigatório' 
      });
    }

    if (!titulo && !tabuadas) {
      return res.status(400).json({ 
        success: false, 
        error: 'Pelo menos um campo deve ser atualizado' 
      });
    }

    const existing = await tabuadaModel.findById(id);
    if (existing.error) throw existing.error;
    
    if (!existing.data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tabuada não encontrada' 
      });
    }

    const updateTitulo = titulo || existing.data.titulo;
    const updateTabuadas = tabuadas || existing.data.tabuadas;

    const { data, error } = await tabuadaModel.update(id, updateTitulo, updateTabuadas);
    
    if (error) throw error;
    
    res.status(200).json({ 
      success: true, 
      data: data[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
