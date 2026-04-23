// Local storage management

const Storage = {
    KEYS: {
        BETS: 'betanalytics_bets',
        BANKROLL: 'betanalytics_bankroll'
    },

    getBets() {
        try {
            const data = localStorage.getItem(this.KEYS.BETS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    saveBets(bets) {
        localStorage.setItem(this.KEYS.BETS, JSON.stringify(bets));
    },

    addBet(bet) {
        const bets = this.getBets();
        bet.id = Date.now() + Math.random();
        bets.unshift(bet);
        this.saveBets(bets);
        return bet;
    },

    deleteBet(id) {
        const bets = this.getBets().filter(b => b.id !== id);
        this.saveBets(bets);
    },

    getBankroll() {
        try {
            const data = localStorage.getItem(this.KEYS.BANKROLL);
            return data ? JSON.parse(data) : {
                initial: 1000,
                current: 1000,
                stakePct: 2,
                stopLoss: 10
            };
        } catch (e) {
            return { initial: 1000, current: 1000, stakePct: 2, stopLoss: 10 };
        }
    },

    saveBankroll(data) {
        localStorage.setItem(this.KEYS.BANKROLL, JSON.stringify(data));
    },

    // Calculate profit for a bet
    calcProfit(bet) {
        const stake = parseFloat(bet.stake);
        const odd = parseFloat(bet.odd);
        switch (bet.result) {
            case 'win': return stake * (odd - 1);
            case 'loss': return -stake;
            case 'void': return 0;
            case 'halfwin': return stake * (odd - 1) / 2;
            case 'halfloss': return -stake / 2;
            default: return 0;
        }
    },

    // Aggregate stats from bets
    getStats() {
        const bets = this.getBets();
        const settled = bets.filter(b => b.result !== 'pending');

        let totalStake = 0;
        let totalProfit = 0;
        let wins = 0;
        const marketStats = {};

        settled.forEach(b => {
            const stake = parseFloat(b.stake);
            const profit = this.calcProfit(b);
            totalStake += stake;
            totalProfit += profit;
            if (b.result === 'win' || b.result === 'halfwin') wins++;

            if (!marketStats[b.market]) {
                marketStats[b.market] = { count: 0, profit: 0, stake: 0 };
            }
            marketStats[b.market].count++;
            marketStats[b.market].profit += profit;
            marketStats[b.market].stake += stake;
        });

        return {
            totalBets: settled.length,
            totalPending: bets.length - settled.length,
            totalStake,
            totalProfit,
            wins,
            roi: totalStake > 0 ? (totalProfit / totalStake) * 100 : 0,
            winrate: settled.length > 0 ? (wins / settled.length) * 100 : 0,
            marketStats
        };
    }
};
