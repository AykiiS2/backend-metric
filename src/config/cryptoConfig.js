module.exports = {
    getSupabaseCredentials: () => {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;
        
        if (!url || !key) {
            throw new Error('Supabase credentials not configured');
        }
        
        return { url, key };
    }
};