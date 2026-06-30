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
    themes:['Jira','Azure DevOps','GitHub Projects','Trello','ClickUp','Linear'],
    description:'Comparar ferramentas modernas de gestão ágil, mostrando que a interface muda, mas os conceitos centrais permanecem: backlog, board, issue, sprint e dashboard.',
    focus:['Backlog nas ferramentas','Board e fluxo','Issue, Epic, Story e Task','Dashboards e relatórios','Quando escolher cada ferramenta']
  }
];
const workshopStandardTopics = ['O que é?','Quem criou?','Ano de criação','Contexto histórico','Problema que pretendia resolver','Como funciona?','Fluxograma do processo','Principais características','Vantagens','Limitações','Quando utilizar?','Quando evitar?','Empresas que utilizam','Como influenciou a Engenharia de Software','Comparação com outras metodologias','A Nexus Software House adotaria essa abordagem? Justifique.'];


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
 <div class="panel"><h3>Trilha da UC02</h3><div class="workshop-flow dashboard-flow"><span>Discovery</span><span>Produto</span><span>Requisitos</span><span>Backlog</span><span>Refinamento</span><strong>Workshop</strong><span>Nexus City</span></div></div>
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
  <div class="panel transition-panel"><h3>Linha de transição</h3><div class="workshop-flow"><span>Discovery</span><span>Produto</span><span>Requisitos</span><span>Backlog</span><span>Refinamento</span><strong>Workshop</strong><span>Nexus City</span></div></div>
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

function renderEvents(){
 if(!config.showEventCards){ qs('#eventos').innerHTML = ''; return; }
 qs('#eventos').innerHTML = sectionTitle('Eventos da Diretoria','Cartas de evento para usar principalmente entre as Sprints 07 e 12. Elas tornam o Jira vivo e forçam adaptação, negociação e registro de decisão.')+
 `<div class="grid cols-3">${events.map(e=>`<div class="card event-card ${e.level}"><div class="pill-row">${pill('Sprint '+e.sprint,'blue')}${pill(e.level==='high'?'Alto impacto':'Médio impacto','hot')}</div><h3>${e.title}</h3><p>${e.text}</p></div>`).join('')}</div>`;
}
function renderLibrary(){
 qs('#biblioteca').innerHTML = sectionTitle('Biblioteca do Consultor','Glossário vivo da UC02. Use como referência rápida durante as Sprints, sem transformar a aula em leitura teórica.')+
 `<div class="grid cols-3">${library.map(l=>`<div class="card"><div class="pill-row">${pill(l.cat,'blue')}</div><h3>${l.title}</h3><p>${l.text}</p></div>`).join('')}</div>`;
}
function renderEvaluation(){
 qs('#avaliacao').innerHTML = sectionTitle('Avaliação e Gamificação','Avaliação contínua por processo, decisão, organização e defesa técnica. XP e TechCoins reforçam a experiência, mas não substituem critérios pedagógicos.')+
 `<div class="grid cols-2"><div class="card"><h3>Critérios gerais</h3><table><tr><th>Critério</th><th>XP</th></tr><tr><td>Discovery, CSD e problema</td><td>10</td></tr><tr><td>Stakeholders, personas e jornada</td><td>10</td></tr><tr><td>Visão, MVP e requisitos</td><td>15</td></tr><tr><td>Escopo e engenharia de requisitos</td><td>15</td></tr><tr><td>Metodologias, Scrum/Kanban e Jira</td><td>15</td></tr><tr><td>Product Backlog e Sprint Planning</td><td>15</td></tr><tr><td>Execução, mudanças, review e retrospectiva</td><td>15</td></tr><tr><td>Defesa final</td><td>5</td></tr><tr><th>Total</th><th>100</th></tr></table></div><div class="card"><h3>TechCoins</h3><ul><li>Entrega no prazo: +80</li><li>Boa decisão técnica: +60</li><li>Jira organizado: +70</li><li>Evento bem tratado: +100</li><li>Uso inadequado de IA: -80</li><li>Board desatualizado: -50</li><li>Escopo sem controle: -70</li></ul><div class="highlight warning"><strong>Defesa oral:</strong> o professor pode selecionar qualquer Story, evento ou decisão e pedir rastreabilidade.</div></div></div>`;
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
  renderDashboard();renderSprints();renderClients();renderWorkshop();renderEvents();renderLibrary();renderEvaluation();
}
initNexus();
