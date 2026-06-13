const supabase = require('../config/supabase');

class Escola {
    static async create(escolaData) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('escolas')
            .insert([escolaData])
            .select();
        
        if (error) throw error;
        return data[0];
    }
    
    static async findAll() {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('escolas')
            .select('*');
        
        if (error) throw error;
        return data;
    }
    
    static async findById(id) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('escolas')
            .select('*')
            .eq('id_escola', id)
            .single();
        
        if (error) throw error;
        return data;
    }
    
    static async update(id, escolaData) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('escolas')
            .update(escolaData)
            .eq('id_escola', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }
    
    static async delete(id) {
        const supabaseClient = supabase.getSupabase();
        const { error } = await supabaseClient
            .from('escolas')
            .delete()
            .eq('id_escola', id);
        
        if (error) throw error;
        return true;
    }
    
    static async getTurmas(id_escola) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('turmas')
            .select('*')
            .eq('id_escola', id_escola);
        
        if (error) throw error;
        return data;
    }
    
    static async getAlunos(id_escola) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('alunos')
            .select('*')
            .eq('id_escola', id_escola);
        
        if (error) throw error;
        return data;
    }
}

module.exports = Escola;