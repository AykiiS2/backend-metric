const { createClient } = require('@supabase/supabase-js');
const { getSupabaseCredentials } = require('./cryptoConfig');

let supabaseInstance = null;
let supabaseAdminInstance = null;

function createSupabaseClient() {
    const credentials = getSupabaseCredentials();
    
    const options = {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'x-application-name': 'secure-backend'
            }
        }
    };
    
    supabaseInstance = createClient(credentials.url, credentials.key, options);
    return supabaseInstance;
}

function createSupabaseAdmin() {
    const credentials = getSupabaseCredentials();
    
    const options = {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        },
        db: {
            schema: 'public'
        }
    };
    
    supabaseAdminInstance = createClient(credentials.url, credentials.serviceKey || credentials.key, options);
    return supabaseAdminInstance;
}

function getSupabase() {
    if (!supabaseInstance) {
        return createSupabaseClient();
    }
    return supabaseInstance;
}

function getSupabaseAdmin() {
    if (!supabaseAdminInstance) {
        return createSupabaseAdmin();
    }
    return supabaseAdminInstance;
}

async function testConnection() {
    try {
        const supabase = getSupabase();
        const { error } = await supabase.from('Escolas').select('count', { count: 'exact', head: true });
        if (error) throw error;
        return { success: true, message: 'Connection established' };
    } catch (error) {
        return { success: false, message: 'Connection failed' };
    }
}

module.exports = { getSupabase, getSupabaseAdmin, testConnection };
