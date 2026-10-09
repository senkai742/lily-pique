const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://oqzxtdwmuaunzovzqwog.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
// check if we can run raw sql to create table? supabase JS doesn't support this easily.
