// Integração opcional com Supabase para a Nexus Software House
// Substitua os valores abaixo pelas credenciais do seu projeto Supabase.
// Observação: a anon key pode ficar no front-end quando as políticas RLS estiverem configuradas corretamente.

const SUPABASE_URL = 'https://prriawecgtnggdqstcej.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycmlhd2VjZ3RuZ2dkcXN0Y2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTEwMzEsImV4cCI6MjA5Nzg4NzAzMX0.LdWQ-vtlha5U-VtKh1tA42OCHdaL9gAjzu0VIN23xeo';

window.NEXUS_SUPABASE = {
  enabled: Boolean(
    window.supabase &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('COLE_AQUI') &&
    !SUPABASE_ANON_KEY.includes('COLE_AQUI')
  ),
  client: null
};

if (window.NEXUS_SUPABASE.enabled) {
  window.NEXUS_SUPABASE.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

async function nexusLoadRemoteConfig(tableName = 'nexus_config') {
  if (!window.NEXUS_SUPABASE.enabled) return null;
  const { data, error } = await window.NEXUS_SUPABASE.client
    .from(tableName)
    .select('config')
    .eq('id', 'default')
    .single();
  if (error) {
    console.warn('Não foi possível carregar configuração do Supabase:', error.message);
    return null;
  }
  return data?.config || null;
}

async function nexusSaveRemoteConfig(config, tableName = 'nexus_config') {
  if (!window.NEXUS_SUPABASE.enabled) return { ok: false, reason: 'Supabase não configurado.' };
  const { error } = await window.NEXUS_SUPABASE.client
    .from(tableName)
    .upsert({ id: 'default', config, updated_at: new Date().toISOString() });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
