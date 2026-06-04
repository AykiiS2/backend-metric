app.get('/health', async (req, res) => {
    try {
        console.log('=== HEALTH CHECK DEBUG ===');
        console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING');
        console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'SET' : 'MISSING');
        
        const supabase = getSupabase();
        console.log('Supabase client created');
        
        const { data, error } = await supabase
            .from('Escolas')
            .select('id_escola')
            .limit(1);
        
        console.log('Query result - error:', error);
        console.log('Query result - data:', data);
        
        if (error) {
            throw error;
        }
        
        res.status(200).json({ 
            status: 'OK', 
            timestamp: Date.now(),
            uptime: process.uptime(),
            database: 'connected'
        });
    } catch (error) {
        console.error('Health check error:', error);
        console.error('Error message:', error.message);
        console.error('Error details:', error);
        
        res.status(500).json({ 
            status: 'ERROR', 
            timestamp: Date.now(),
            database: 'disconnected',
            error: error.message,
            details: error.details || 'No details'
        });
    }
});
