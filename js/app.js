const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => [...root.querySelectorAll(s)];

function loadConfig(){
  const base = window.NEXUS_CONFIG || {};
  let local = {};
  try { local = JSON.parse(localStorage.getItem('NEXUS_ADMIN_CONFIG') || '{}'); } catch (e) { local = {}; }
  return {
    currentSprint: Number(local.currentSprint || base.currentSprint || ((window.NEXUS_CURRENT_SPRINT || 0) + 1)),
    unlockedSprints: local.unlockedSprints || base.unlockedSprints || [],
    showFutureSprints: local.showFutureSprints ?? base.showFutureSprints ?? true,
    showProfessorMode: local.showProfessorMode ?? base.showProfessorMode ?? true,
    showEventCards: local.showEventCards ?? base.showEventCards ?? true,
    deliveryChannel: local.deliveryChannel || base.deliveryChannel || 'Microsoft Teams',
    adminPin: local.adminPin || base.adminPin || '2026',
    useSupabase: local.useSupabase ?? base.useSupabase ?? false,
    supabaseConfigTable: local.supabaseConfigTable || base.supabaseConfigTable || 'nexus_config',
    officialToolBySprint: {...(base.officialToolBySprint || {}), ...(local.officialToolBySprint || {})}
  };
}

let config = loadConfig();
const rawSprints = window.NEXUS_SPRINTS || [];
let currentIndex = Math.max(0, Math.min(rawSprints.length - 1, (config.currentSprint || 1) - 1));
let unlockedSet = new Set((config.unlockedSprints || []).map(Number));
const clients = window.NEXUS_CLIENTS || [];
const secondEmails = window.NEXUS_SECOND_EMAILS || {};
const thirdEmails = window.NEXUS_THIRD_EMAILS || {};
const meetingTranscripts = window.NEXUS_MEETING_TRANSCRIPTS || {};
const library = window.NEXUS_LIBRARY || [];
const events = window.NEXUS_EVENTS || [];

const workshopTeams = [
  {
    id:'E01', title:'Modelos Sequenciais', members:['Claudio','José'],
    themes:['Modelo Cascata (Waterfall)','Modelo em V (V-Model)'],
    description:'Estudar os modelos clássicos da Engenharia de Software, com foco em planejamento sequencial, documentação forte, validação formal e baixa flexibilidade para mudanças.',
    focus:['Origem dos modelos tradicionais','Fases sequenciais','Documentação e controle','Relação entre desenvolvimento e testes','Quando ainda fazem sentido']
  },
  {
    id:'E02', title:'Modelos Evolutivos', members:['Nereyev','Ronnivon'],
    themes:['Modelo Incremental','Modelo Iterativo'],
    description:'Explicar a evolução dos modelos rígidos para abordagens com entregas parciais, ciclos de aprendizado, feedback progressivo e evolução contínua do produto.',
    focus:['Entregas por partes','Feedback em ciclos','Redução de risco por evolução gradual','Diferença entre incremental e iterativo','Relação com MVP e produto']
  },
  {
    id:'E03', title:'Modelos para Redução de Riscos', members:['Hudson','Maycon'],
    themes:['Modelo Espiral','Prototipação','RAD'],
    description:'Analisar modelos voltados à validação antecipada, experimentação, gestão de riscos e velocidade de entrega antes do investimento pesado em desenvolvimento.',
    focus:['Riscos técnicos e de negócio','Provas de conceito','Protótipos descartáveis e evolutivos','Desenvolvimento rápido','Validação com cliente']
  },
  {
    id:'E04', title:'A Revolução Ágil', members:['Paulo Victor','Pedro Augusto'],
    themes:['Manifesto Ágil','Scrum'],
    description:'Apresentar a ruptura causada pelo Manifesto Ágil e explicar como o Scrum organiza papéis, eventos, artefatos e ciclos curtos de entrega.',
    focus:['Valores e princípios ágeis','Papéis do Scrum','Eventos do Scrum','Artefatos','Quando Scrum ajuda e quando atrapalha']
  },
  {
    id:'E05', title:'Fluxo Contínuo', members:['João Pedro','Ricardo'],
    themes:['Kanban','Scrumban'],
    description:'Demonstrar como a gestão visual, o limite de trabalho em progresso e o fluxo contínuo ajudam equipes a reduzir gargalos e aumentar previsibilidade.',
    focus:['Quadro Kanban','WIP','Fluxo puxado','Métricas de fluxo','Comparação Scrum × Kanban']
  },
  {
    id:'E06', title:'Engenharia Ágil', members:['Josué','Kaic'],
    themes:['Extreme Programming (XP)','Lean Software Development'],
    description:'Explorar práticas técnicas e princípios de melhoria contínua voltados à qualidade, redução de desperdícios, colaboração e excelência na entrega.',
    focus:['Refatoração','Pair programming','TDD e testes','Integração contínua','Eliminação de desperdícios']
  },
  {
    id:'E07', title:'DevOps e Entrega Contínua', members:['Emerson','Marimar'],
    themes:['DevOps','CI/CD','GitOps'],
    description:'Explicar a integração entre desenvolvimento e operações, automação de entrega, monitoramento e cultura de colaboração para reduzir falhas em produção.',
    focus:['Cultura DevOps','Pipeline CI/CD','Deploy contínuo','Monitoramento','Git como fonte da verdade']
  },
  {
    id:'E08', title:'Ecossistema de Ferramentas', members:['Maria Francisca'],
    themes:['Jira','Microsoft Planner','Azure DevOps','GitHub Projects','Trello','ClickUp','Linear'],
    description:'Comparar ferramentas modernas de gestão ágil, incluindo Microsoft Planner por causa do acesso institucional Microsoft, mostrando que a interface muda, mas os conceitos centrais permanecem: backlog, board, issue, sprint, responsáveis, evidências e dashboard.',
    focus:['Backlog nas ferramentas','Board e fluxo','Issue, Epic, Story e Task','Planner e acesso institucional Microsoft','Dashboards e relatórios','Quando escolher cada ferramenta']
  }
];
const workshopStandardTopics = ['O que é?','Quem criou?','Ano de criação','Contexto histórico','Problema que pretendia resolver','Como funciona?','Fluxograma do processo','Principais características','Vantagens','Limitações','Quando utilizar?','Quando evitar?','Empresas que utilizam','Como influenciou a Engenharia de Software','Comparação com outras metodologias','A Nexus Software House adotaria essa abordagem? Justifique.'];



const nexusCityFacts = [
  'População estimada: 50.000 habitantes na primeira fase de expansão.',
  'A Prefeitura deseja validar a Fase 1 antes de avançar para obras completas.',
  'O ambiente de validação será o Minecraft Education, usado como simulação tridimensional.',
  'A gestão operacional deverá acontecer em uma ferramenta escolhida pela equipe, preferencialmente Jira, Microsoft Planner ou Azure DevOps, com evidências e movimentação real dos cards/tarefas.',
  'A entrega final será um MVP demonstrável, não a cidade completa.'
];
const nexusCityDemands = [
  'Qualidade de vida e acesso a serviços essenciais.',
  'Mobilidade urbana eficiente e vias compreensíveis.',
  'Educação, saúde e segurança como serviços mínimos.',
  'Áreas verdes e cuidado ambiental.',
  'Iluminação e infraestrutura básica.',
  'Uso inteligente de tecnologia para melhorar a vida do cidadão.',
  'Crescimento futuro sem expansão desordenada.',
  'Acessibilidade nos principais equipamentos públicos.'
];
const nexusCityOpenPoints = [
  'Qual será o MVP realista para os encontros restantes?',
  'Quais demandas entram agora e quais ficam para versões futuras?',
  'Como dividir a turma em squads ou frentes de trabalho?',
  'Quem será PO, Scrum Master, Tech Lead, Devs, QA e UX/Urbanista?',
  'Quais áreas da cidade têm maior valor para a Prefeitura?',
  'Quais dependências existem entre vias, prédios, áreas verdes e serviços?',
  'Como garantir qualidade sem perder prazo?',
  'Como registrar decisões e mudanças na ferramenta de gestão?'
];
const nexusCityConstraints = [
  'Tempo reduzido: ciclo final de 4 encontros.',
  'Não construir a cidade inteira: entregar apenas um MVP coerente.',
  'Toda construção deve nascer de uma demanda registrada na ferramenta de gestão.',
  'Mudanças da Prefeitura devem passar por análise de impacto.',
  'O Minecraft Education é ambiente de execução, não o objetivo da atividade.',
  'A Daily Nexus deve encerrar cada encontro com avanços, dificuldades e próximos passos.'
];
const nexusCityRoles = [
  {role:'Product Owner', text:'Representa a Prefeitura, prioriza demandas, negocia mudanças, valida entregas e protege o valor do MVP. Não deve tentar construir tudo: deve decidir o que gera mais valor.'},
  {role:'Scrum Master', text:'Facilita o fluxo de trabalho, conduz a Daily Nexus, registra impedimentos, organiza combinados e ajuda a equipe a manter foco, transparência e ritmo.'},
  {role:'Tech Lead', text:'Orienta tecnicamente os Developers, define padrões de construção, cuida da integração entre áreas da cidade e apoia decisões de arquitetura no Minecraft Education.'},
  {role:'Developers', text:'Executam as demandas priorizadas no Minecraft Education, atualizam o Jira, registram evidências, comunicam impedimentos e constroem apenas o que está alinhado ao MVP.'},
  {role:'QA', text:'Valida critérios de aceite, verifica se as entregas atendem ao planejado, registra não conformidades e evita que itens sejam marcados como concluídos sem evidência.'},
  {role:'UX / Urbanista Digital', text:'Avalia a experiência do cidadão, acessibilidade, mobilidade, coerência urbana, distribuição dos serviços públicos e capacidade de expansão futura da Nexus City.'}
];
const nexusCityTeamAssignments = [
  {role:'Diretor de Projetos / PMO', names:['Professor'], note:'Governança, ofícios, auditoria, feedback e representação eventual da Prefeitura.'},
  {role:'Product Owner', names:['Nureyev Santos'], note:'Voz da Prefeitura, priorização e aceite das entregas.'},
  {role:'Scrum Master', names:['Cláudio de Araújo Pereira Rodrigues'], note:'Daily Nexus, impedimentos, Jira e cadência da equipe.'},
  {role:'Tech Lead', names:['Kaic Daniel Vieira Cavalcante'], note:'Padrões técnicos, integração das áreas e apoio aos Developers.'},
  {role:'QA', names:['José Flávio Miranda de Sousa'], note:'Validação dos critérios de aceite e registro de não conformidades.'},
  {role:'UX / Urbanista Digital', names:['Ronnivon Alves Lima'], note:'Coerência urbana, acessibilidade, mobilidade e experiência do cidadão.'},
  {role:'Developers', names:['Caio Carlos Nascimento Costa','Emerson Alves Dos Santos Lima','Hudson Miranda Ferreira','João Pedro Abreu de Sousa','Josué Santos Oliveira','Maria Francisca de Paula da Silva','Marimar Barros de Oliveira','Maycon Anderson Germano do Vale','Paulo Victor das Neves Souza','Pedro Augusto Macêdo dos Santos','Ricardo Da Paz Gomes'], note:'Execução das demandas priorizadas no Minecraft Education e atualização das issues no Jira.'}
];
const nexusCityArchitecture = [
  'Definir uma área central de referência para o MVP: praça, centro administrativo ou eixo principal.',
  'Separar zonas mínimas: residencial, serviços públicos, mobilidade, área verde e tecnologia/infraestrutura.',
  'Criar eixos de circulação antes dos prédios principais para evitar construções isoladas.',
  'Usar placas no Minecraft para identificar áreas, responsáveis e entregas concluídas.',
  'Manter escala coerente entre prédios, ruas, áreas verdes e equipamentos públicos.',
  'Evitar decoração sem função: cada construção precisa ter motivo ligado ao projeto.',
  'Registrar no Jira qual issue originou cada construção relevante.',
  'Deixar espaço para expansão futura, mesmo que não seja construída agora.'
];
const nexusCityDossier = [
  {title:'1. Carta de Abertura', body:'A Prefeitura Municipal de Nexus City contratou a Nexus Software House para conduzir a Fase 1 de um projeto de cidade inteligente. A contratação não solicita uma cidade completa, mas um MVP viável que demonstre como a cidade poderá ser planejada, priorizada, executada e evoluída.'},
  {title:'2. Contexto do Problema', body:'Nexus City deverá receber cerca de 50.000 habitantes. A Prefeitura quer evitar erros comuns de cidades que cresceram sem planejamento: congestionamentos, bairros desconectados, ausência de áreas verdes, serviços públicos mal distribuídos, baixa acessibilidade e desperdício de recursos.'},
  {title:'3. Demanda Central', body:'Transformar uma necessidade ampla em um projeto executável. A equipe deverá interpretar informações, eleger prioridades, organizar o trabalho no Jira e validar uma primeira versão no Minecraft Education.'},
  {title:'4. Demandas Documentadas', body:'Foram citadas necessidades de moradia, mobilidade, saúde, educação, segurança, iluminação, áreas verdes, tecnologia, acessibilidade, saneamento básico, espaços de convivência e capacidade de expansão. Nem tudo caberá no MVP.'},
  {title:'5. Conflitos de Prioridade', body:'A Prefeitura deseja inovação e sustentabilidade. A população cobra serviços essenciais. Empresários querem área comercial. Moradores pedem segurança e mobilidade. O PO deverá ajudar a equipe a tomar decisões de prioridade sem tentar atender tudo ao mesmo tempo.'},
  {title:'6. Restrições', body:'O projeto possui tempo limitado, equipe reduzida, necessidade de entrega incremental e obrigação de registrar decisões. A equipe terá que escolher o que entra na Fase 1 e justificar o que ficará para depois.'},
  {title:'7. Ambiente de Simulação', body:'O Minecraft Education será utilizado como ambiente de execução e validação visual do MVP. Ele não substitui o gerenciamento do projeto. O Jira será a fonte principal de acompanhamento das demandas, responsáveis, status e impedimentos.'},
  {title:'8. Resultado Esperado', body:'Ao final do ciclo, a Prefeitura espera ver um MVP coerente da Nexus City e entender como a equipe gerenciou o projeto: papéis, prioridades, backlog, mudanças, decisões, dificuldades e aprendizados.'}
];
const nexusCitySprints = [
  {sprint:'Encontro 1', title:'Kickoff, leitura do dossiê e organização no Jira', items:['Ler o dossiê da Prefeitura','Confirmar PO, Scrum Master, Tech Lead, QA e UX/Urbanista','Distribuir Developers por frentes de trabalho','Definir MVP possível','Transformar demandas em épicos/issues no Jira','Planejar a primeira execução'], daily:'O que entendemos do problema? O que decidimos priorizar? Quais dúvidas ou impedimentos existem?'},
  {sprint:'Encontro 2', title:'Execução do MVP no Minecraft Education', items:['Abrir ambiente de simulação','Executar issues priorizadas','Atualizar board do Jira','Registrar evidências','Tratar dependências entre squads','Manter foco no MVP'], daily:'O que foi concluído? O que está em andamento? O que bloqueou o time? O que faremos no próximo encontro?'},
  {sprint:'Encontro 3', title:'Ofícios, mudanças, qualidade e Review parcial', items:['Receber ofício da Prefeitura','Avaliar impacto da mudança','Repriorizar backlog quando necessário','Corrigir não conformidades','Realizar Review parcial','Registrar decisões no Jira'], daily:'O que mudou? Como reagimos? O que será ajustado? Quais riscos ainda permanecem?'},
  {sprint:'Encontro 4', title:'Demo Day e prestação de contas', items:['Finalizar MVP','Organizar evidências do Jira','Preparar defesa executiva','Demonstrar Nexus City no Minecraft','Responder perguntas','Registrar lições aprendidas'], daily:'O que entregamos? Quais decisões foram mais importantes? O que aprendemos como equipe?'}
];



function sprintStatus(index){
  const n = index + 1;
  if(index < currentIndex) return 'Concluída';
  if(index === currentIndex) return 'Em andamento';
  if(unlockedSet.has(n)) return 'Liberada';
  return 'Bloqueada';
}
function sprintTool(s, index){ return config.officialToolBySprint[index + 1] || s.tool || 'Portal Nexus'; }
function decorateSprint(s, index){ return {...s, status:sprintStatus(index), tool:sprintTool(s, index), number:index+1}; }
let sprints = rawSprints.map(decorateSprint);
let visibleSprints = config.showFutureSprints ? sprints : sprints.filter((_, i) => i <= currentIndex || unlockedSet.has(i+1));

function recomputeState(){
  currentIndex = Math.max(0, Math.min(rawSprints.length - 1, (config.currentSprint || 1) - 1));
  unlockedSet = new Set((config.unlockedSprints || []).map(Number));
  sprints = rawSprints.map(decorateSprint);
  visibleSprints = config.showFutureSprints ? sprints : sprints.filter((_, i) => i <= currentIndex || unlockedSet.has(i+1));
}

function applyVisibilityConfig(){
  const eventosBtn = qs('[data-tab="eventos"]');
  if(eventosBtn && !config.showEventCards) eventosBtn.style.display = 'none';
}
applyVisibilityConfig();

qsa('#menu button').forEach(btn => btn.addEventListener('click', () => {
  qsa('#menu button').forEach(b=>b.classList.remove('active'));
  qsa('.tab-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const panel = qs('#'+btn.dataset.tab);
  if(panel) panel.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}));

function sectionTitle(title, text){return `<div class="section-title"><h2>${title}</h2><p>${text}</p></div>`}
function pill(text, cls=''){return `<span class="pill ${cls}">${text}</span>`}
function checklist(items=[]){return `<div class="checklist">${items.map(i=>`<div class="check"><span class="box"></span><span>${i}</span></div>`).join('')}</div>`}
function list(items=[]){return `<ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul>`}

function transitionFlow(active='Workshop'){
  const items = ['Discovery','Produto','Requisitos','Backlog','Refinamento','Workshop','Nexus City'];
  return `<div class="workshop-flow">${items.map(i => i === active ? `<strong>${i}</strong>` : `<span>${i}</span>`).join('')}</div>`;
}
function lockNotice(s){
  if(s.status !== 'Bloqueada') return '';
  return `<div class="highlight warning"><strong>Sprint bloqueada:</strong> esta Sprint ainda não está liberada. Altere o arquivo <code>config.js</code> ou use o painel de configuração para habilitá-la.</div>`;
}

function renderDashboard(){
 const c=sprints[currentIndex] || sprints[0];
 if(!c) return;
 qs('#sideSprint').textContent = c.day;
 const sideCard = qs('.side-card span');
 if(sideCard) sideCard.textContent = c.title;
 qs('#dashboard').innerHTML = sectionTitle('Dashboard da Software House','Painel de acompanhamento da UC02. A Sprint atual, as Sprints liberadas e os recursos visíveis são controlados por configuração.')+
 `<div class="grid cols-5">
  <div class="metric"><small>Sprint atual</small><strong>${c.day}</strong><span>${c.title}</span></div>
  <div class="metric"><small>Status</small><strong>${c.status}</strong><span>${c.phase}</span></div>
  <div class="metric"><small>Ferramenta</small><strong>${c.tool}</strong></div>
  <div class="metric"><small>XP</small><strong>${c.xp}</strong><span>${c.coins}</span></div>
  <div class="metric"><small>Entrega</small><strong>${config.deliveryChannel}</strong><span>Atividade da Sprint</span></div>
 </div>
 <div class="panel"><h3>Linha de transição oficial</h3>${transitionFlow((currentIndex + 1) >= 9 ? 'Nexus City' : (currentIndex + 1) >= 8 ? 'Workshop' : 'Refinamento')}<p class="muted flow-note">A fase de consultoria foi concluída. O Workshop consolida metodologias e abre o ciclo operacional da Nexus City.</p></div>
 <div class="panel"><h3>Linha do tempo das Sprints</h3><div class="timeline">${sprints.map((s,i)=>`<div class="timeline-item ${i<currentIndex?'done':i===currentIndex?'active':unlockedSet.has(i+1)?'unlocked':'locked'}"><strong>${String(i+1).padStart(2,'0')}</strong><span>${s.phase}</span></div>`).join('')}</div></div>
 <div class="grid cols-2"><div class="card"><h3>Sprint Goal atual</h3><p>${c.goal}</p></div><div class="card"><h3>Entrega oficial</h3><p>${c.output}</p><div class="highlight"><strong>Canal:</strong> ${config.deliveryChannel}, com evidências do Jira/Minecraft quando aplicável.</div></div></div>`;
}
function renderSprints(){
 qs('#sprints').innerHTML = sectionTitle('Sprints da UC02','As Sprints são liberadas por configuração remota. Use a Central de Controle para definir a Sprint atual, liberar etapas e manter todos os alunos sincronizados.')+
 visibleSprints.map((s)=>`<details ${s.number-1===currentIndex?'open':''}><summary><strong>${s.day}</strong><span class="summary-title">${s.title}</span><span class="budget">${s.status}</span></summary><div class="detail-body">${lockNotice(s)}<div class="pill-row">${pill(s.phase,'go')}${pill(s.xp,'blue')}${pill(s.tool,'hot')}${pill(s.time)}</div><div class="highlight success"><strong>Sprint Goal:</strong> ${s.goal}</div><p><strong>Contexto:</strong> ${s.context}</p><p><strong>Demanda:</strong> ${s.demand}</p><p><strong>Entrega oficial:</strong> ${s.output}</p><div class="grid cols-2"><div class="card"><h3>Checklist</h3>${checklist(s.checklist)}</div><div class="card"><h3>Definition of Done</h3>${list(s.dod)}<h3>Critérios de Aceite</h3>${list(s.acceptance)}</div></div><div class="grid cols-2"><div class="card"><h3>Ferramentas</h3><div class="tools">${(s.tools||[]).map(t=>pill(t)).join('')}</div></div><div class="card"><h3>Competências</h3><div class="tools">${(s.competencies||[]).map(t=>pill(t)).join('')}</div></div></div></div></details>`).join('');
}
function renderClients(){
 qs('#clientes').innerHTML = sectionTitle('Clientes individuais','Cada consultor mantém um cliente. O Portal preserva briefing, e-mails e transcrições; o Jira organiza o trabalho operacional a partir da Sprint 06.')+
 clients.map(st=>{
   const mail2 = secondEmails[st.name] || null;
   const mail3 = thirdEmails[st.name] || null;
   const transcript = meetingTranscripts[st.name] || null;
   const renderEmail = (m,label,badge='') => m ? `
        <div class="email-card new">
          <div class="inbox-head"><strong>📧 ${label}</strong><span class="email-badge ${badge}">${label.includes('Sprint 02')?'Sprint 02':'Sprint 03'}</span></div>
          <div class="inbox-body">
            <div class="email-meta"><strong>De:</strong> ${m.from}<br><strong>Assunto:</strong> ${m.subject}</div>
            <p>${m.body}</p>
            ${m.attachments?`<div class="attachments">${m.attachments.map(a=>`<span class="attachment">📎 ${a}</span>`).join('')}</div>`:''}
          </div>
        </div>` : '';
   const transcriptHtml = transcript ? `
        <div class="transcript-card">
          <div class="inbox-head"><strong>📄 ${transcript.title}</strong><span class="email-badge warn">Dossiê Sprint 03</span></div>
          <div class="inbox-body">
            <p class="muted">Leia como analista. A transcrição não traz requisitos prontos. Extraia falas que indiquem funções do sistema, qualidades esperadas, restrições, regras de negócio e riscos.</p>
            <div class="transcript-text">${transcript.body}</div>
          </div>
        </div>` : '';
   return `<details><summary><span class="student-name">${st.name}</span><span class="summary-title">${st.client} · ${st.segment}</span><span class="budget">${st.budget}</span></summary><div class="detail-body"><div class="card client-profile"><h3>Ficha do Cliente</h3><table><tr><th>Cliente</th><td>${st.client}</td></tr><tr><th>Segmento</th><td>${st.segment}</td></tr><tr><th>Prazo</th><td>${st.deadline}</td></tr><tr><th>Equipe</th><td>${st.team}</td></tr><tr><th>Dificuldade</th><td>${st.difficulty}</td></tr></table><div class="tags">${(st.tags||[]).map(t=>pill(t)).join('')}</div></div><div class="email-thread"><div class="email-card"><div class="inbox-head"><strong>📥 Caixa de Entrada</strong><span class="email-badge warn">E-mail 01</span></div><div class="inbox-body"><div class="email-meta"><strong>De:</strong> ${st.from}<br><strong>Assunto:</strong> ${st.subject}</div><p>${st.briefing}</p></div></div>${renderEmail(mail2,'Novo e-mail recebido · Sprint 02')}${renderEmail(mail3,'Novo e-mail recebido · Sprint 03')}</div>${transcriptHtml}<h4>Informações de apoio</h4><p><strong>Problema aparente:</strong> ${st.problem}</p><p><strong>Objetivo inicial informado:</strong> ${st.objective}</p><div class="grid cols-3"><div class="card"><h3>Restrições</h3>${list(st.restrictions)}</div><div class="card"><h3>Prioridades</h3>${list(st.priorities)}</div><div class="card"><h3>Riscos iniciais</h3>${list(st.risks)}</div></div></div></details>`
 }).join('');
}

function renderWorkshop(){
 const panel = qs('#workshop');
 if(!panel) return;
 panel.innerHTML = sectionTitle('Workshop Corporativo Nexus','Da Engenharia Tradicional ao Ágil Moderno. Este treinamento encerra a fase de consultoria das Sprints 01 a 07 e prepara a equipe para o projeto Nexus City.')+
 `<div class="workshop-hero card">
    <div>
      <span class="eyebrow">Treinamento interno obrigatório</span>
      <h3>Da Estratégia à Execução</h3>
      <p>As equipes irão estudar modelos, metodologias e ferramentas de gestão para defender tecnicamente quais práticas fazem sentido para a Nexus Software House antes do início da Nexus City.</p>
      <div class="pill-row">${pill('4h','blue')}${pill('Apresentação + Mapa Mental','go')}${pill('Defesa oral','hot')}${pill('Preparação para Nexus City')}</div>
    </div>
    <div class="highlight success"><strong>Mensagem central:</strong> não existe metodologia perfeita. Existe abordagem adequada ao contexto, ao risco, ao prazo, à equipe e ao valor esperado pelo cliente.</div>
  </div>
  <div class="grid cols-4 workshop-metrics">
    <div class="metric"><small>Evento</small><strong>Workshop</strong><span>Congresso Técnico Nexus</span></div>
    <div class="metric"><small>Equipes</small><strong>08</strong><span>Temas distribuídos</span></div>
    <div class="metric"><small>Entrega</small><strong>Teams</strong><span>Slides + mapa mental</span></div>
    <div class="metric"><small>Próximo ciclo</small><strong>Nexus City</strong><span>Execução prática</span></div>
  </div>
  <div class="panel transition-panel"><h3>Linha de transição</h3>${transitionFlow('Workshop')}<p class="muted flow-note">Este Workshop é a ponte entre a fase de consultoria e o início da execução colaborativa na Nexus City.</p></div>
  <div class="grid cols-2 workshop-section-gap">
    <div class="card"><h3>Dinâmica</h3><ol><li>Pesquisa orientada e organização do material.</li><li>Construção da apresentação e mapa mental.</li><li>Defesa técnica da metodologia diante da turma.</li><li>Comparação com outras abordagens.</li><li>Decisão final: a Nexus adotaria essa abordagem?</li><li>Se houver ausência, a equipe presente assume a defesa e o professor garante a síntese do tema.</li></ol></div>
    <div class="card"><h3>Entregáveis</h3>${checklist(['Apresentação em PowerPoint, Canva ou Google Slides.','Mapa mental em PDF ou imagem.','Referências utilizadas.','Defesa oral com comparação crítica.','Entrega oficial pelo Microsoft Teams.'])}</div>
  </div>
  <h3 class="block-title">Divisão das equipes</h3>
  <div class="grid cols-2 workshop-teams">${workshopTeams.map(team=>`
    <details class="team-card">
      <summary><strong>${team.id}</strong><span class="summary-title">${team.title}</span><span class="budget">${team.members.join(' + ')}</span></summary>
      <div class="detail-body">
        <div class="pill-row">${team.themes.map(t=>pill(t,'blue')).join('')}</div>
        <p>${team.description}</p>
        <div class="grid cols-2">
          <div class="card"><h3>Foco da pesquisa</h3>${list(team.focus)}</div>
          <div class="card"><h3>Entrega esperada</h3>${checklist(['Explicar a origem e o problema que resolveu.','Apresentar fluxo visual da abordagem.','Comparar com Scrum e Kanban.','Indicar quando usar e quando evitar.','Defender se a Nexus deveria adotar.'])}</div>
        </div>
      </div>
    </details>`).join('')}</div>
  <div class="grid cols-2">
    <div class="card"><h3>Tópicos padrão para todas as equipes</h3><div class="topic-grid">${workshopStandardTopics.map((t,i)=>`<div class="topic-item"><strong>${String(i+1).padStart(2,'0')}</strong><span>${t}</span></div>`).join('')}</div></div>
    <div class="card"><h3>Critérios de avaliação</h3><table><tr><th>Critério</th><th>Peso</th></tr><tr><td>Domínio do conteúdo</td><td>2,0</td></tr><tr><td>Clareza da comunicação</td><td>2,0</td></tr><tr><td>Organização da apresentação</td><td>1,0</td></tr><tr><td>Fundamentação técnica</td><td>2,0</td></tr><tr><td>Comparação crítica</td><td>1,5</td></tr><tr><td>Defesa oral e respostas</td><td>1,5</td></tr><tr><th>Total</th><th>10,0</th></tr></table><div class="highlight warning"><strong>Regra de continuidade:</strong> se um integrante faltar, a equipe apresenta normalmente. Se todos faltarem, o professor faz uma síntese para não prejudicar a turma.</div></div>
  </div>
  <div class="card"><h3>Fechamento do Workshop</h3><p>Após as apresentações, a Diretoria da Nexus consolidará as lições aprendidas e anunciará a transição para o projeto <strong>Nexus City — Smart City Program</strong>.</p><div class="highlight success"><strong>Próxima etapa:</strong> Kickoff da Nexus City, formação das equipes de desenvolvimento, definição de papéis, backlog inicial e execução no Minecraft Education.</div></div>`;
}



function renderNexusCity(){
 const panel = qs('#nexus-city');
 if(!panel) return;
 panel.innerHTML = sectionTitle('Nexus City','Projeto Integrador da UC02. A equipe deverá transformar um dossiê amplo da Prefeitura em execução organizada, usando uma ferramenta de gestão escolhida pela equipe (Jira, Microsoft Planner ou Azure DevOps) e Minecraft Education para validar o MVP.')+
 `<div class="workshop-hero card">
    <div>
      <span class="eyebrow">Projeto Integrador · Fase 1</span>
      <h3>Nexus City — Smart City MVP</h3>
      <p>O foco não é preencher vários documentos. O foco é executar um projeto com gestão: interpretar o dossiê, separar demandas, dividir equipes, priorizar, acompanhar na ferramenta de gestão, adaptar-se a mudanças e demonstrar o MVP no Minecraft Education.</p>
      <div class="pill-row">${pill('Cliente: Prefeitura Municipal','blue')}${pill('Execução: Minecraft Education','go')}${pill('Gestão: Jira / Planner / Azure DevOps / Planner / Azure DevOps','hot')}${pill('Ciclo final: 4 encontros')}</div>
    </div>
    <div class="highlight success"><strong>Regra de ouro:</strong> cada construção relevante precisa estar vinculada a uma demanda ou issue no Jira. Minecraft é execução; a ferramenta de gestão é o controle do projeto.</div>
  </div>

  <div class="panel transition-panel"><h3>Fluxo oficial</h3>${transitionFlow('Nexus City')}<p class="muted flow-note">A fase de consultoria terminou. A Nexus City inicia a fase prática: transformar demanda realista em execução acompanhada.</p></div>

  <div class="grid cols-5">
    <div class="metric"><small>Fase atual</small><strong>Execução</strong><span>Projeto Integrador</span></div>
    <div class="metric"><small>Cliente</small><strong>Prefeitura</strong><span>Nexus City</span></div>
    <div class="metric"><small>Produto</small><strong>MVP</strong><span>Smart City</span></div>
    <div class="metric"><small>Gestão</small><strong>Jira</strong><span>Backlog e board</span></div>
    <div class="metric"><small>Ambiente</small><strong>Minecraft</strong><span>Simulação visual</span></div>
  </div>

  <details open class="city-briefing"><summary><strong>📄 Dossiê Técnico da Prefeitura</strong><span class="summary-title">Processo Administrativo nº 014/2032</span><span class="budget">Ler</span></summary><div class="detail-body">
    <div class="highlight"><strong>Uso do dossiê:</strong> este documento não entrega backlog pronto. Ele apresenta demandas, problemas, conflitos e restrições. O PO, o Scrum Master, o Tech Lead, o QA e o UX/Urbanista deverão conduzir a equipe para transformar essas informações em execução na ferramenta de gestão escolhida e no Minecraft Education.</div>
    <div class="grid cols-2">${nexusCityDossier.map(d=>`<div class="card"><h3>${d.title}</h3><p>${d.body}</p></div>`).join('')}</div>
  </div></details>

  <div class="grid cols-2">
    <div class="card"><h3>Fatos já informados pela Prefeitura</h3>${checklist(nexusCityFacts)}</div>
    <div class="card"><h3>Demandas documentadas</h3>${checklist(nexusCityDemands)}</div>
  </div>

  <div class="grid cols-2 city-section-gap">
    <div class="card"><h3>Pontos que a equipe precisa decidir</h3>${list(nexusCityOpenPoints)}<div class="highlight warning"><strong>Atenção:</strong> não existe resposta única. Toda decisão deverá ter justificativa.</div></div>
    <div class="card"><h3>Restrições de projeto</h3>${list(nexusCityConstraints)}</div>
  </div>

  <div class="panel city-section-gap"><h3>Arquitetura mínima no Minecraft Education</h3><p class="muted">A arquitetura abaixo não é um desenho pronto. É um conjunto de princípios para evitar construções desconectadas e manter o MVP coerente.</p><div class="grid cols-2">${nexusCityArchitecture.map(i=>`<div class="check"><span class="box"></span><span>${i}</span></div>`).join('')}</div></div>

  <h3 class="block-title">Papéis obrigatórios da equipe</h3>
  <div class="grid cols-3">${nexusCityRoles.map(r=>`<div class="card"><h3>${r.role}</h3><p>${r.text}</p></div>`).join('')}</div>

  <div class="panel city-section-gap"><h3>Organização oficial da equipe</h3><p class="muted">Distribuição recomendada para o ciclo final da Nexus City. O professor atua como Diretor de Projetos/PMO e, em momentos específicos, como representante da Prefeitura.</p><div class="grid cols-2">${nexusCityTeamAssignments.map(t=>`<div class="card"><div class="pill-row">${pill(t.role,'blue')}</div><h3>${t.names.join('<br>')}</h3><p>${t.note}</p></div>`).join('')}</div><div class="highlight warning"><strong>Importante:</strong> os papéis não são títulos simbólicos. Cada responsável deverá atuar durante as cerimônias, manter evidências no Jira e defender decisões no Demo Day.</div></div>

  <div class="panel city-section-gap"><h3>Plano enxuto dos 4 encontros</h3><p class="muted">A atividade foi reduzida para priorizar execução, acompanhamento e tomada de decisão, evitando excesso de documentos.</p><div class="grid cols-2">${nexusCitySprints.map(s=>`<div class="card"><div class="pill-row">${pill(s.sprint,'blue')}${pill('Daily Nexus','go')}</div><h3>${s.title}</h3>${checklist(s.items)}<div class="highlight"><strong>Daily Nexus:</strong> ${s.daily}</div></div>`).join('')}</div></div>

  <div class="grid cols-2">
    <div class="card"><h3>Entregáveis mínimos</h3>${checklist(['Ferramenta de gestão atualizada com demandas, responsáveis e status.','MVP demonstrável no Minecraft Education.','Registro das decisões e mudanças principais.','Daily Nexus ao final de cada encontro.','Defesa executiva no Demo Day.'])}</div>
    <div class="card"><h3>O que será avaliado</h3>${list(['Gestão do projeto e clareza dos papéis.','Qualidade da priorização e do quadro de gestão.','Execução coerente do MVP no Minecraft.','Capacidade de lidar com mudanças.','Comunicação, colaboração e defesa das decisões.'])}</div>
  </div>

  <div class="card city-section-gap"><h3>Mensagem da Diretoria</h3><blockquote>Grandes cidades, assim como grandes sistemas, começam com boas decisões. A Prefeitura não espera uma cidade completa em quatro encontros. Espera uma equipe capaz de entender demandas, priorizar valor, executar com transparência e defender tecnicamente suas escolhas. A partir de agora, o projeto da Nexus City está oficialmente em execução.</blockquote></div>`;
}

function renderEvents(){
 if(!config.showEventCards){ qs('#eventos').innerHTML = ''; return; }
 const byPhase = events.reduce((acc,e)=>{ (acc[e.sprint] ||= []).push(e); return acc; }, {});
 qs('#eventos').innerHTML = sectionTitle('Eventos da Diretoria e da Prefeitura','Cartas de evento atualizadas para o novo ciclo: Workshop, Kickoff e execução da Nexus City. Use durante as Sprints para provocar análise de impacto, repriorização, qualidade e comunicação executiva.')+
 `<div class="panel transition-panel"><h3>Linha de transição</h3>${transitionFlow((currentIndex + 1) >= 9 ? 'Nexus City' : 'Workshop')}<p class="muted flow-note">Os eventos antigos de clientes individuais foram substituídos por situações corporativas da Nexus City.</p></div>`+
 `<div class="grid cols-3">${events.map(e=>`<div class="card event-card ${e.level}"><div class="pill-row">${pill('Sprint '+e.sprint,'blue')}${pill(e.category || 'Evento')}${pill(e.level==='high'?'Alto impacto':'Médio impacto','hot')}</div><h3>${e.title}</h3><p>${e.text}</p>${e.action?`<div class="highlight"><strong>Ação esperada:</strong> ${e.action}</div>`:''}</div>`).join('')}</div>`+
 `<div class="panel"><h3>Como usar os eventos</h3><div class="grid cols-3"><div class="card"><h3>1. Ler</h3><p>Apresente o evento como comunicado da Diretoria, Prefeitura ou stakeholder.</p></div><div class="card"><h3>2. Decidir</h3><p>A equipe avalia impacto em escopo, prazo, qualidade, riscos e backlog.</p></div><div class="card"><h3>3. Registrar</h3><p>A decisão precisa aparecer no Jira, no relatório ou na entrega do Teams.</p></div></div></div>`;
}
function renderLibrary(){
 qs('#biblioteca').innerHTML = sectionTitle('Biblioteca do Consultor','Guia de consulta da Nexus Software House. Conceitos com definição, uso prático, erros comuns e exemplos aplicados à Nexus City.')+
 `<div class="panel"><h3>Ferramenta de gestão: a equipe pode escolher</h3><p>O Jira continua sendo uma opção forte, mas a equipe também poderá utilizar Microsoft Planner ou Azure DevOps, especialmente porque todos possuem acesso institucional Microsoft. A escolha deve ser justificada pelo PO e pelo Scrum Master.</p><div class="highlight"><strong>Regra:</strong> a ferramenta escolhida precisa permitir demandas, responsáveis, status, prioridades, evidências, impedimentos e acompanhamento do progresso.</div></div>`+
 `<div class="grid cols-2">${library.map(l=>`<details class="library-detail"><summary><strong>${l.title}</strong><span class="summary-title">${l.text}</span><span class="budget">${l.cat}</span></summary><div class="detail-body">${l.details || `<p>${l.text}</p>`}</div></details>`).join('')}</div>`;
}
function renderEvaluation(){
 qs('#avaliacao').innerHTML = sectionTitle('Avaliação e Gamificação','Avaliação contínua por processo, decisão, organização e defesa técnica. XP e TechCoins reforçam a experiência, mas não substituem critérios pedagógicos.')+
 `<div class="grid cols-2"><div class="card"><h3>Critérios gerais</h3><table><tr><th>Critério</th><th>XP</th></tr><tr><td>Discovery, CSD e problema</td><td>10</td></tr><tr><td>Stakeholders, personas e jornada</td><td>10</td></tr><tr><td>Visão, MVP e requisitos</td><td>15</td></tr><tr><td>Escopo e engenharia de requisitos</td><td>15</td></tr><tr><td>Metodologias, Scrum/Kanban e Jira</td><td>15</td></tr><tr><td>Product Backlog e Sprint Planning</td><td>15</td></tr><tr><td>Execução, mudanças, review e retrospectiva</td><td>15</td></tr><tr><td>Defesa final</td><td>5</td></tr><tr><th>Total</th><th>100</th></tr></table></div><div class="card"><h3>TechCoins</h3><ul><li>Entrega no prazo: +80</li><li>Boa decisão técnica: +60</li><li>Quadro organizado: +70</li><li>Evento bem tratado: +100</li><li>Uso inadequado de IA: -80</li><li>Quadro desatualizado: -50</li><li>Escopo sem controle: -70</li></ul><div class="highlight warning"><strong>Defesa oral:</strong> o professor pode selecionar qualquer Story, evento ou decisão e pedir rastreabilidade.</div></div></div>`;
}
function renderProfessor(){
 const panel = qs('#professor');
 if(!panel) return;
 if(!config.showProfessorMode){ panel.innerHTML = ''; return; }
 panel.innerHTML = sectionTitle('Modo Professor','Roteiro operacional para condução da UC. Ideal para não se perder entre slides, portal, Jira e Teams.')+
 `<div class="grid cols-2"><div class="card"><h3>Fluxo de cada encontro</h3><ol><li>Abrir slides da Sprint.</li><li>Provocar com pergunta ou problema.</li><li>Apresentar conceito mínimo.</li><li>Conectar com Portal/Jira.</li><li>Tempo de produção.</li><li>Socialização curta.</li><li>Entrega no Teams.</li><li>Fechamento e gancho.</li></ol></div><div class="card"><h3>Perguntas que evitam respostas prontas</h3><ul><li>De qual evidência saiu essa decisão?</li><li>Isso é fato, hipótese ou dúvida?</li><li>Qual requisito originou essa Story?</li><li>Por que essa Story entra nesta Sprint?</li><li>O que acontece se removermos esse item?</li><li>Como o Jira comprova o andamento?</li></ul></div></div>`+
 visibleSprints.map(s=>`<details><summary><strong>${s.day}</strong><span class="summary-title">${s.title}</span><span class="budget">Professor</span></summary><div class="detail-body"><p>${s.teacher}</p><div class="highlight"><strong>Ferramenta central:</strong> ${s.tool}</div></div></details>`).join('');
}
async function initNexus(){
  if(config.useSupabase && window.NEXUS_SUPABASE?.enabled && typeof nexusLoadRemoteConfig === 'function'){
    try{
      const remote = await nexusLoadRemoteConfig(config.supabaseConfigTable);
      if(remote && typeof remote === 'object'){
        localStorage.setItem('NEXUS_ADMIN_CONFIG', JSON.stringify(remote));
        config = loadConfig();
        recomputeState();
      }
    }catch(e){ console.warn('Falha ao carregar configuração remota:', e); }
  }
  applyVisibilityConfig();
  renderDashboard();renderSprints();renderClients();renderWorkshop();renderNexusCity();renderEvents();renderLibrary();renderEvaluation();
}
initNexus();
