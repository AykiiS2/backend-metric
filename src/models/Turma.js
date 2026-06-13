const supabase = require('../config/supabase');

class Turma {
    static async create(turmaData) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('turmas')
            .insert([turmaData])
            .select();
        
        if (error) throw error;
        return data[0];
    }
    
    static async findAll(filters = {}) {
        const supabaseClient = supabase.getSupabase();
        let query = supabaseClient.from('turmas').select('*');
        
        if (filters.id_escola) query = query.eq('id_escola', filters.id_escola);
        if (filters.serie) query = query.eq('serie', filters.serie);
        if (filters.periodo) query = query.eq('periodo', filters.periodo);
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    }
    
    static async findById(id) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('turmas')
            .select('*')
            .eq('id_turma', id)
            .single();
        
        if (error) throw error;
        return data;
    }
    
    static async update(id, turmaData) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('turmas')
            .update(turmaData)
            .eq('id_turma', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }
    
    static async delete(id) {
        const supabaseClient = supabase.getSupabase();
        const { error } = await supabaseClient
            .from('turmas')
            .delete()
            .eq('id_turma', id);
        
        if (error) throw error;
        return true;
    }
    
    static async getAlunos(id_turma) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('alunos')
            .select('*')
            .eq('id_turma', id_turma);
        
        if (error) throw error;
        return data;
    }
}

module.exports = Turma;