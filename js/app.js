// Main application logic

const App = {
    init() {
        this.setupNavigation();
        this.setupMatchAnalysis();
        this.setupValueBets();
        this.setupKelly();
        this.setupOddsConverter();
        this.setupBankroll();
        this.setupHistory();
        this.setupMargin();
        this.refreshDashboard();
        this.loadBankrollForm();

        // Set today's date in bet form
        const dateInput = document.getElementById('bet-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    },

    setupNavigation() {
        const items = document.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.view');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.view;
                items.forEach(i => i.classList.remove('active'));
                views.forEach(v => v.classList.remove('active'));
                item.classList.add('active');
                document.getElementById(target).classList.add('active');
                if (target === 'dashboard') this.refreshDashboard();
                if (target === 'history') this.renderBets();
                if (target === 'bankroll') this.renderBankrollSummary();
            });
        });
    },

    formatBRL(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    setupMatchAnalysis() {
        document.getElementById('analyze-match').addEventListener('click', () => {
            const homeName = document.getElementById('home-name').value || 'Casa';
            const awayName = document.getElementById('away-name').value || 'Visitante';
            const hgf = parseFloat(document.getElementById('home-goals-for').value);
            const hga = parseFloat(document.getElementById('home-goals-against').value);
            const agf = parseFloat(document.getElementById('away-goals-for').value);
            const aga = parseFloat(document.getElementById('away-goals-against').value);
            const leagueAvg = parseFloat(document.getElementById('league-avg').value);
            const homeAdv = parseFloat(document.getElementById('home-advantage').value);

            const { homeXg, awayXg } = Analysis.calculateXg(hgf, hga, agf, aga, leagueAvg, homeAdv);
            const matrix = Analysis.buildScoreMatrix(homeXg, awayXg);
            const result1X2 = Analysis.calculate1X2(matrix);
            const btts = Analysis.calculateBTTS(matrix);
            const top = Analysis.topScorelines(matrix, 12);

            // Populate names
            document.getElementById('result-home-name').textContent = homeName;
            document.getElementById('result-away-name').textContent = awayName;
            document.getElementById('xg-home-name').textContent = homeName;
            document.getElementById('xg-away-name').textContent = awayName;
            document.getElementById('xg-home').textContent = homeXg.toFixed(2);
            document.getElementById('xg-away').textContent = awayXg.toFixed(2);

            // 1X2 bars
            this.fillProbBar('home', result1X2.home);
            this.fillProbBar('draw', result1X2.draw);
            this.fillProbBar('away', result1X2.away);

            // Goals markets table
            const goalsTable = document.getElementById('goals-markets');
            const lines = [0.5, 1.5, 2.5, 3.5, 4.5];
            let html = '<thead><tr><th>Linha</th><th>Over %</th><th>Odd Justa</th><th>Under %</th><th>Odd Justa</th></tr></thead><tbody>';
            lines.forEach(line => {
                const ou = Analysis.calculateOverUnder(matrix, line);
                html += `<tr>
                    <td><strong>${line}</strong></td>
                    <td>${(ou.over * 100).toFixed(1)}%</td>
                    <td>${Analysis.probToOdd(ou.over).toFixed(2)}</td>
                    <td>${(ou.under * 100).toFixed(1)}%</td>
                    <td>${Analysis.probToOdd(ou.under).toFixed(2)}</td>
                </tr>`;
            });
            html += '</tbody>';
            goalsTable.innerHTML = html;

            // BTTS table
            document.getElementById('btts-markets').innerHTML = `
                <thead><tr><th>Mercado</th><th>Probabilidade</th><th>Odd Justa</th></tr></thead>
                <tbody>
                    <tr><td><strong>Sim</strong></td><td>${(btts.yes * 100).toFixed(1)}%</td><td>${Analysis.probToOdd(btts.yes).toFixed(2)}</td></tr>
                    <tr><td><strong>Não</strong></td><td>${(btts.no * 100).toFixed(1)}%</td><td>${Analysis.probToOdd(btts.no).toFixed(2)}</td></tr>
                </tbody>
            `;

            // Scorelines
            const scoreGrid = document.getElementById('scoreline-grid');
            scoreGrid.innerHTML = top.map((s, idx) => `
                <div class="scoreline ${idx === 0 ? 'top-1' : ''}">
                    <div class="scoreline-score">${s.home} - ${s.away}</div>
                    <div class="scoreline-prob">${(s.prob * 100).toFixed(1)}%</div>
                </div>
            `).join('');

            document.getElementById('analysis-results').classList.remove('hidden');
        });
    },

    fillProbBar(type, prob) {
        const pct = (prob * 100).toFixed(1);
        document.getElementById(`prob-${type}-fill`).style.width = `${pct}%`;
        document.getElementById(`prob-${type}-val`).textContent = `${pct}%`;
        document.getElementById(`prob-${type}-odds`).textContent = `@ ${Analysis.probToOdd(prob).toFixed(2)}`;
    },

    setupValueBets() {
        const calc = () => {
            const prob = parseFloat(document.getElementById('vb-prob').value);
            const odd = parseFloat(document.getElementById('vb-odd').value);
            const stake = parseFloat(document.getElementById('vb-stake').value);

            const ev = Analysis.expectedValue(prob, odd, stake);
            const edge = Analysis.edge(prob, odd);
            const fairOdd = Analysis.probToOdd(prob / 100);

            document.getElementById('vb-ev').textContent = this.formatBRL(ev);
            const evPctEl = document.getElementById('vb-ev-pct');
            evPctEl.textContent = `${edge.toFixed(2)}% sobre stake`;
            evPctEl.className = 'stat-change ' + (ev > 0 ? 'positive' : 'negative');

            document.getElementById('vb-edge').textContent = `${edge.toFixed(2)}%`;
            document.getElementById('vb-fair-odd').textContent = fairOdd.toFixed(2);

            const recEl = document.getElementById('vb-recommendation');
            const recDetailEl = document.getElementById('vb-rec-detail');
            if (edge >= 5) {
                recEl.textContent = '✅ APOSTAR';
                recEl.style.color = 'var(--success)';
                recDetailEl.textContent = 'Edge significativo encontrado';
            } else if (edge > 0) {
                recEl.textContent = '⚠️ MARGINAL';
                recEl.style.color = 'var(--warning)';
                recDetailEl.textContent = 'Edge baixo, considere com cautela';
            } else {
                recEl.textContent = '❌ EVITAR';
                recEl.style.color = 'var(--danger)';
                recDetailEl.textContent = 'Sem valor positivo';
            }
        };
        document.getElementById('calc-value').addEventListener('click', calc);
        calc();
    },

    setupKelly() {
        const calc = () => {
            const bankroll = parseFloat(document.getElementById('kelly-bankroll').value);
            const prob = parseFloat(document.getElementById('kelly-prob').value);
            const odd = parseFloat(document.getElementById('kelly-odd').value);
            const fraction = parseFloat(document.getElementById('kelly-fraction').value);

            const fullKelly = Analysis.kelly(prob, odd, 1);
            const fractionalKelly = Analysis.kelly(prob, odd, fraction);
            const stake = bankroll * fractionalKelly;
            const profit = stake * (odd - 1);
            const p = prob / 100;
            const growth = p > 0 && fractionalKelly > 0
                ? (p * Math.log(1 + fractionalKelly * (odd - 1)) + (1 - p) * Math.log(1 - fractionalKelly)) * 100
                : 0;

            document.getElementById('kelly-stake').textContent = this.formatBRL(stake);
            document.getElementById('kelly-stake-pct').textContent = `${(fractionalKelly * 100).toFixed(2)}% da banca`;
            document.getElementById('kelly-full').textContent = `${(fullKelly * 100).toFixed(2)}%`;
            document.getElementById('kelly-profit').textContent = this.formatBRL(profit);
            document.getElementById('kelly-growth').textContent = `${growth.toFixed(3)}%`;
        };
        document.getElementById('calc-kelly').addEventListener('click', calc);
        calc();
    },

    setupOddsConverter() {
        const inputs = document.querySelectorAll('[data-format]');
        let updating = false;
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                if (updating) return;
                updating = true;
                const format = e.target.dataset.format;
                const value = e.target.value;
                let decimal = 0;

                if (format === 'decimal') decimal = parseFloat(value);
                else if (format === 'fractional') decimal = Analysis.fractionalToDecimal(value);
                else if (format === 'american') decimal = Analysis.americanToDecimal(parseFloat(value));
                else if (format === 'probability') decimal = Analysis.probabilityToDecimal(parseFloat(value));

                if (decimal > 1 && isFinite(decimal)) {
                    if (format !== 'decimal') document.getElementById('odd-decimal').value = decimal.toFixed(2);
                    if (format !== 'fractional') document.getElementById('odd-fractional').value = Analysis.decimalToFractional(decimal);
                    if (format !== 'american') document.getElementById('odd-american').value = Analysis.decimalToAmerican(decimal);
                    if (format !== 'probability') document.getElementById('odd-probability').value = Analysis.decimalToProbability(decimal).toFixed(2);
                }
                updating = false;
            });
        });
    },

    setupMargin() {
        document.getElementById('calc-margin').addEventListener('click', () => {
            const h = parseFloat(document.getElementById('margin-home').value);
            const d = parseFloat(document.getElementById('margin-draw').value);
            const a = parseFloat(document.getElementById('margin-away').value);
            const margin = Analysis.margin(h, d, a);
            const trueProbs = Analysis.removeVig(h, d, a);

            document.getElementById('margin-results').innerHTML = `
                <div class="margin-result-item">
                    <div class="margin-result-label">Margem da Casa</div>
                    <div class="margin-result-value">${margin.toFixed(2)}%</div>
                </div>
                <div class="margin-result-item">
                    <div class="margin-result-label">Prob Real Casa</div>
                    <div class="margin-result-value">${(trueProbs.home * 100).toFixed(1)}%</div>
                </div>
                <div class="margin-result-item">
                    <div class="margin-result-label">Prob Real Empate</div>
                    <div class="margin-result-value">${(trueProbs.draw * 100).toFixed(1)}%</div>
                </div>
                <div class="margin-result-item">
                    <div class="margin-result-label">Prob Real Visitante</div>
                    <div class="margin-result-value">${(trueProbs.away * 100).toFixed(1)}%</div>
                </div>
            `;
        });
    },

    setupBankroll() {
        document.getElementById('save-bankroll').addEventListener('click', () => {
            const data = {
                initial: parseFloat(document.getElementById('br-initial').value),
                current: parseFloat(document.getElementById('br-current').value),
                stakePct: parseFloat(document.getElementById('br-stake-pct').value),
                stopLoss: parseFloat(document.getElementById('br-stop-loss').value)
            };
            Storage.saveBankroll(data);
            this.renderBankrollSummary();
            this.refreshDashboard();
            const btn = document.getElementById('save-bankroll');
            const originalText = btn.textContent;
            btn.textContent = '✓ Salvo!';
            setTimeout(() => { btn.textContent = originalText; }, 1500);
        });
    },

    loadBankrollForm() {
        const br = Storage.getBankroll();
        document.getElementById('br-initial').value = br.initial;
        document.getElementById('br-current').value = br.current;
        document.getElementById('br-stake-pct').value = br.stakePct;
        document.getElementById('br-stop-loss').value = br.stopLoss;
        this.renderBankrollSummary();
    },

    renderBankrollSummary() {
        const br = Storage.getBankroll();
        const change = br.initial > 0 ? ((br.current - br.initial) / br.initial) * 100 : 0;
        const stake = br.current * br.stakePct / 100;
        const stopLoss = br.current * br.stopLoss / 100;
        document.getElementById('bankroll-summary').innerHTML = `
            <div class="summary-item">
                <div class="summary-item-label">Banca Inicial</div>
                <div class="summary-item-value">${this.formatBRL(br.initial)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-item-label">Banca Atual</div>
                <div class="summary-item-value">${this.formatBRL(br.current)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-item-label">Variação</div>
                <div class="summary-item-value" style="color: ${change >= 0 ? 'var(--success)' : 'var(--danger)'}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</div>
            </div>
            <div class="summary-item">
                <div class="summary-item-label">Stake Sugerida</div>
                <div class="summary-item-value">${this.formatBRL(stake)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-item-label">Stop Loss Diário</div>
                <div class="summary-item-value" style="color: var(--danger)">${this.formatBRL(stopLoss)}</div>
            </div>
        `;
    },

    setupHistory() {
        document.getElementById('add-bet').addEventListener('click', () => {
            const bet = {
                date: document.getElementById('bet-date').value,
                event: document.getElementById('bet-event').value,
                market: document.getElementById('bet-market').value,
                stake: parseFloat(document.getElementById('bet-stake').value),
                odd: parseFloat(document.getElementById('bet-odd').value),
                result: document.getElementById('bet-result').value
            };
            if (!bet.event || !bet.stake || !bet.odd) {
                alert('Preencha pelo menos evento, stake e odd');
                return;
            }
            Storage.addBet(bet);
            document.getElementById('bet-event').value = '';
            this.renderBets();
            this.refreshDashboard();
        });
        this.renderBets();
    },

    renderBets() {
        const bets = Storage.getBets();
        const tbody = document.getElementById('bets-tbody');
        if (!bets.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Nenhuma aposta registrada</td></tr>';
            return;
        }
        const labels = {
            pending: 'Pendente', win: 'Vitória', loss: 'Derrota',
            void: 'Anulada', halfwin: 'Meia Vit.', halfloss: 'Meia Der.'
        };
        tbody.innerHTML = bets.map(b => {
            const profit = Storage.calcProfit(b);
            const profitClass = profit > 0 ? 'profit-positive' : profit < 0 ? 'profit-negative' : '';
            const dateStr = b.date ? new Date(b.date).toLocaleDateString('pt-BR') : '-';
            return `
                <tr>
                    <td>${dateStr}</td>
                    <td>${this.escapeHtml(b.event)}</td>
                    <td>${this.escapeHtml(b.market)}</td>
                    <td>${this.formatBRL(b.stake)}</td>
                    <td>${parseFloat(b.odd).toFixed(2)}</td>
                    <td><span class="result-badge result-${b.result}">${labels[b.result]}</span></td>
                    <td class="${profitClass}">${b.result === 'pending' ? '-' : this.formatBRL(profit)}</td>
                    <td><button class="btn btn-danger" data-id="${b.id}">Excluir</button></td>
                </tr>
            `;
        }).join('');
        tbody.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Excluir esta aposta?')) {
                    Storage.deleteBet(parseFloat(btn.dataset.id));
                    this.renderBets();
                    this.refreshDashboard();
                }
            });
        });
    },

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    refreshDashboard() {
        const stats = Storage.getStats();
        const br = Storage.getBankroll();
        const change = br.initial > 0 ? ((br.current - br.initial) / br.initial) * 100 : 0;

        document.getElementById('dash-bankroll').textContent = this.formatBRL(br.current);
        const changeEl = document.getElementById('dash-bankroll-change');
        changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}% desde o início`;
        changeEl.className = 'stat-change ' + (change >= 0 ? 'positive' : 'negative');

        document.getElementById('dash-roi').textContent = `${stats.roi.toFixed(2)}%`;
        document.getElementById('dash-roi-detail').textContent = `Lucro: ${this.formatBRL(stats.totalProfit)}`;

        document.getElementById('dash-winrate').textContent = `${stats.winrate.toFixed(1)}%`;
        document.getElementById('dash-winrate-detail').textContent = `${stats.wins} vitórias em ${stats.totalBets} apostas`;

        document.getElementById('dash-total-bet').textContent = this.formatBRL(stats.totalStake);
        document.getElementById('dash-total-bets').textContent = `${stats.totalBets} resolvidas, ${stats.totalPending} pendentes`;

        // Recent bets
        const bets = Storage.getBets().slice(0, 5);
        const labels = {
            pending: 'Pendente', win: 'Vitória', loss: 'Derrota',
            void: 'Anulada', halfwin: 'Meia Vit.', halfloss: 'Meia Der.'
        };
        const recentEl = document.getElementById('dash-recent-bets');
        if (!bets.length) {
            recentEl.innerHTML = '<div class="empty-state">Nenhuma aposta registrada ainda. Adicione uma no menu Histórico.</div>';
        } else {
            recentEl.innerHTML = bets.map(b => `
                <div class="recent-bet-item">
                    <div>
                        <div class="recent-bet-event">${this.escapeHtml(b.event)}</div>
                        <div class="recent-bet-market">${this.escapeHtml(b.market)} @ ${parseFloat(b.odd).toFixed(2)}</div>
                    </div>
                    <span class="result-badge result-${b.result}">${labels[b.result]}</span>
                    <strong>${this.formatBRL(b.stake)}</strong>
                </div>
            `).join('');
        }

        // Markets performance
        const marketsEl = document.getElementById('dash-markets');
        const markets = Object.entries(stats.marketStats).sort((a, b) => b[1].profit - a[1].profit);
        if (!markets.length) {
            marketsEl.innerHTML = '<div class="empty-state">Sem dados suficientes</div>';
        } else {
            marketsEl.innerHTML = markets.slice(0, 6).map(([name, data]) => {
                const roi = data.stake > 0 ? (data.profit / data.stake) * 100 : 0;
                return `
                    <div class="recent-bet-item">
                        <div>
                            <div class="recent-bet-event">${this.escapeHtml(name)}</div>
                            <div class="recent-bet-market">${data.count} apostas · ROI ${roi.toFixed(1)}%</div>
                        </div>
                        <strong style="color: ${data.profit >= 0 ? 'var(--success)' : 'var(--danger)'}">${this.formatBRL(data.profit)}</strong>
                    </div>
                `;
            }).join('');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
