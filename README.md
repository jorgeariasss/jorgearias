# BetAnalytics Pro

Webapp completo de análise estatística para apostas esportivas em futebol. Ferramenta educacional e analítica que ajuda a tomar decisões mais informadas em casas de apostas como Betano, Bet365, Sportingbet e similares.

## Funcionalidades

### Dashboard
- Visão geral da banca, ROI, taxa de acerto e total apostado
- Últimas apostas registradas
- Performance por mercado

### Análise de Partida (Modelo Poisson)
- Cálculo de xG (gols esperados) usando força de ataque/defesa
- Probabilidades 1X2 (vitória casa/empate/visitante)
- Mercados Over/Under (0.5, 1.5, 2.5, 3.5, 4.5)
- Ambas Marcam (BTTS Sim/Não)
- Top 12 placares mais prováveis
- Odds justas para todos os mercados

### Detector de Value Bets
- Cálculo de Valor Esperado (EV)
- Detecção de edge (vantagem) sobre a casa
- Comparação odd justa vs odd da casa
- Recomendação automática (apostar/marginal/evitar)

### Calculadora Kelly Criterion
- Stake ótima baseada em probabilidade real e odd
- Frações de Kelly (1/2, 1/4, 1/10) para reduzir variância
- Lucro potencial e crescimento esperado

### Conversor de Odds
- Decimal ↔ Fracionário ↔ Americano ↔ Probabilidade
- Calculadora de margem da casa (vig/juice)
- Remoção de vig (probabilidades reais)

### Gestão de Banca
- Configuração de banca inicial e atual
- Stake fixa percentual
- Stop loss diário
- Variação total da banca

### Histórico de Apostas
- Registro completo de apostas
- Cálculo automático de lucro/prejuízo
- Suporte a meia vitória/derrota e anuladas
- Persistência local (localStorage)

### Estratégias e Conceitos
- Guia educacional sobre value betting, Poisson, Kelly
- Vieses cognitivos comuns
- Erros frequentes
- Métricas importantes

## Como Usar

Abra o arquivo `index.html` em qualquer navegador moderno. Não requer servidor, instalação ou conexão à internet.

```bash
# Opcional: servir localmente
python3 -m http.server 8000
# acesse http://localhost:8000
```

## Tecnologias

- HTML5, CSS3, JavaScript vanilla (sem dependências)
- LocalStorage para persistência
- Responsive design (mobile-first)

## Aviso Importante

Esta ferramenta é exclusivamente para análise estatística e educação. Apostas envolvem risco financeiro. **Aposte apenas com responsabilidade** e nunca dinheiro reservado para necessidades essenciais. Se você sente que o jogo está fora de controle, busque ajuda em https://www.jogadoresanonimos.com.br/

## Estrutura

```
.
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── analysis.js   # Funções estatísticas (Poisson, Kelly, EV)
    ├── storage.js    # Persistência local
    └── app.js        # Controle de UI
```
