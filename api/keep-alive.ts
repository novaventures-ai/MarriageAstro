import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Missing Supabase environment variables');
            return res.status(500).json({ error: 'Missing Supabase environment variables' });
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Perform a lightweight query to keep the database active
        const { data, error } = await supabase
            .from('profiles')
            .select('user_id')
            .limit(1);

        if (error) {
            console.error('Error pinging Supabase:', error);
            return res.status(500).json({ error: 'Failed to ping Supabase database', details: error.message });
        }

        console.log('Successfully pinged Supabase database');
        return res.status(200).json({ status: 'ok', message: 'Database pinged successfully', data });

    } catch (err: any) {
        console.error('Unexpected error in keep-alive cron job:', err);
        return res.status(500).json({ error: 'Unexpected error', details: err.message });
    }
}
