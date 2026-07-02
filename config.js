// Configuração central da plataforma Nexus Software House
// Altere estes valores para liberar novas Sprints sem editar o código da aplicação.
window.NEXUS_CONFIG = {
  currentSprint: 9,
  unlockedSprints: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  showFutureSprints: true,
  showProfessorMode: true,
  showEventCards: true,
  deliveryChannel: 'Microsoft Teams',
  adminPin: '2026',
  useSupabase: true,
  supabaseConfigTable: 'nexus_config',
  officialToolBySprint: {
    1: 'Portal Nexus + Teams',
    2: 'Miro/FigJam + Teams',
    3: 'Portal Nexus + Docs',
    4: 'Docs + Teams',
    5: 'Slides + Portal + Ferramentas Ágeis',
    6: 'Jira / Planner / Azure DevOps',
    7: 'Jira / Planner / Azure DevOps',
    8: 'Workshop + Teams',
    9: 'Dossiê + Ferramenta de Gestão',
    10: 'Minecraft Education + Ferramenta de Gestão',
    11: 'Minecraft Education + Ferramenta de Gestão + Ofícios',
    12: 'Banca + Nexus City',
    13: 'Miro/FigJam + Ferramenta de Gestão',
    14: 'Canva/Figma',
    15: 'Banca + Nexus City'
  }
};
