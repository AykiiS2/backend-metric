const supabase = require('../config/supabase');
const { maskSensitiveData } = require('../utils/hashHelper');

class Aluno {
    static async create(alunoData) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('alunos')
            .insert([alunoData])
            .select();
        
        if (error) throw error;
        return data[0];
    }
    
    static async findAll(filters = {}) {
        const supabaseClient = supabase.getSupabase();
        let query = supabaseClient.from('alunos').select('*');
        
        if (filters.id_escola) query = query.eq('id_escola', filters.id_escola);
        if (filters.id_turma) query = query.eq('id_turma', filters.id_turma);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return data.map(aluno => ({
            ...aluno,
            email: aluno.email ? maskSensitiveData(aluno.email) : null,
            contato: aluno.contato ? maskSensitiveData(aluno.contato) : null
        }));
    }
    
    static async findById(id) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('alunos')
            .select('*')
            .eq('id_aluno', id)
            .single();
        
        if (error) throw error;
        
        return {
            ...data,
            email: data.email ? maskSensitiveData(data.email) : null,
            contato: data.contato ? maskSensitiveData(data.contato) : null
        };
    }
    
    static async update(id, alunoData) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('alunos')
            .update(alunoData)
            .eq('id_aluno', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }
    
    static async delete(id) {
        const supabaseClient = supabase.getSupabase();
        const { error } = await supabaseClient
            .from('alunos')
            .delete()
            .eq('id_aluno', id);
        
        if (error) throw error;
        return true;
    }
    
    static async findByTurma(id_turma) {
        const supabaseClient = supabase.getSupabase();
        const { data, error } = await supabaseClient
            .from('alunos')
            .select('*')
            .eq('id_turma', id_turma);
        
        if (error) throw error;
        return data;
    }
}

module.exports = Aluno;