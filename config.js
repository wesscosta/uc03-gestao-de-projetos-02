// Configuração central da plataforma Nexus Software House
// Altere estes valores para liberar novas Sprints sem editar o código da aplicação.
window.NEXUS_CONFIG = {
  currentSprint: 7,
  unlockedSprints: [1, 2, 3, 4, 5, 6, 7],
  showFutureSprints: true,
  showProfessorMode: true,
  showEventCards: true,
  deliveryChannel: 'Microsoft Teams',
  adminPin: '2026',
  useSupabase: false,
  supabaseConfigTable: 'nexus_config',
  officialToolBySprint: {
    1: 'Portal Nexus + Teams',
    2: 'Miro/FigJam + Teams',
    3: 'Portal Nexus + Docs',
    4: 'Docs + Teams',
    5: 'Slides + Portal + Jira',
    6: 'Jira',
    7: 'Jira',
    8: 'Jira',
    9: 'Jira',
    10: 'Jira',
    11: 'Jira + Apresentação',
    12: 'Miro/Jira',
    13: 'Jira + Alternativas',
    14: 'Canva/Figma',
    15: 'Banca'
  }
};
