const BaseModel = require('./BaseModel');

class Tabuada extends BaseModel {
  constructor() {
    super('tabuadas');
  }

  async create(titulo, tabuadas) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert([{ titulo, tabuadas }])
      .select();
    
    if (error) throw error;
    return { data, error };
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .order('data_criacao', { ascending: false });
    
    if (error) throw error;
    return { data, error };
  }

  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_tabuada', id)
      .single();
    
    if (error) throw error;
    return { data, error };
  }

  async delete(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id_tabuada', id)
      .select();
    
    if (error) throw error;
    return { data, error };
  }

  async update(id, titulo, tabuadas) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ titulo, tabuadas })
      .eq('id_tabuada', id)
      .select();
    
    if (error) throw error;
    return { data, error };
  }
}

module.exports = Tabuada;
