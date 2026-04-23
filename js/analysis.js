// Statistical analysis functions for sports betting

const Analysis = {
    // Poisson probability mass function
    poisson(k, lambda) {
        if (lambda <= 0) return k === 0 ? 1 : 0;
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / this.factorial(k);
    },

    factorial(n) {
        if (n <= 1) return 1;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    },

    // Build a probability matrix for scorelines using Poisson distribution
    buildScoreMatrix(homeXg, awayXg, maxGoals = 8) {
        const matrix = [];
        for (let h = 0; h <= maxGoals; h++) {
            matrix[h] = [];
            for (let a = 0; a <= maxGoals; a++) {
                matrix[h][a] = this.poisson(h, homeXg) * this.poisson(a, awayXg);
            }
        }
        return matrix;
    },

    // Calculate expected goals (xG) using attack/defense strength model
    calculateXg(homeGF, homeGA, awayGF, awayGA, leagueAvg, homeAdv = 1.10) {
        if (leagueAvg <= 0) leagueAvg = 2.5;
        const homeAvg = leagueAvg / 2;
        const awayAvg = leagueAvg / 2;

        const homeAttackStrength = homeGF / homeAvg;
        const homeDefenseStrength = homeGA / awayAvg;
        const awayAttackStrength = awayGF / awayAvg;
        const awayDefenseStrength = awayGA / homeAvg;

        const homeXg = homeAttackStrength * awayDefenseStrength * homeAvg * homeAdv;
        const awayXg = awayAttackStrength * homeDefenseStrength * awayAvg / homeAdv;

        return { homeXg, awayXg };
    },

    // Calculate 1X2 probabilities from score matrix
    calculate1X2(matrix) {
        let pHome = 0, pDraw = 0, pAway = 0;
        for (let h = 0; h < matrix.length; h++) {
            for (let a = 0; a < matrix[h].length; a++) {
                if (h > a) pHome += matrix[h][a];
                else if (h === a) pDraw += matrix[h][a];
                else pAway += matrix[h][a];
            }
        }
        const total = pHome + pDraw + pAway;
        return {
            home: pHome / total,
            draw: pDraw / total,
            away: pAway / total
        };
    },

    // Over/Under probabilities for a given line
    calculateOverUnder(matrix, line) {
        let over = 0, under = 0;
        for (let h = 0; h < matrix.length; h++) {
            for (let a = 0; a < matrix[h].length; a++) {
                const total = h + a;
                if (total > line) over += matrix[h][a];
                else under += matrix[h][a];
            }
        }
        const sum = over + under;
        return { over: over / sum, under: under / sum };
    },

    // Both Teams To Score
    calculateBTTS(matrix) {
        let yes = 0, no = 0;
        for (let h = 0; h < matrix.length; h++) {
            for (let a = 0; a < matrix[h].length; a++) {
                if (h >= 1 && a >= 1) yes += matrix[h][a];
                else no += matrix[h][a];
            }
        }
        const sum = yes + no;
        return { yes: yes / sum, no: no / sum };
    },

    // Top N most probable scorelines
    topScorelines(matrix, n = 8) {
        const list = [];
        for (let h = 0; h < matrix.length; h++) {
            for (let a = 0; a < matrix[h].length; a++) {
                list.push({ home: h, away: a, prob: matrix[h][a] });
            }
        }
        return list.sort((a, b) => b.prob - a.prob).slice(0, n);
    },

    // Convert probability to fair odd
    probToOdd(prob) {
        if (prob <= 0) return 0;
        return 1 / prob;
    },

    // Convert decimal odd to implied probability
    oddToProb(odd) {
        if (odd <= 1) return 0;
        return 1 / odd;
    },

    // Expected Value calculation
    expectedValue(prob, odd, stake) {
        const p = prob / 100;
        const winAmount = (odd - 1) * stake;
        const lossAmount = stake;
        return p * winAmount - (1 - p) * lossAmount;
    },

    // Edge calculation (percentage advantage)
    edge(prob, odd) {
        const p = prob / 100;
        return (p * odd - 1) * 100;
    },

    // Kelly Criterion
    kelly(prob, odd, fraction = 1) {
        const p = prob / 100;
        const q = 1 - p;
        const b = odd - 1;
        if (b <= 0) return 0;
        const f = (b * p - q) / b;
        return Math.max(0, f * fraction);
    },

    // Bookmaker margin (overround) for 1X2
    margin(oddH, oddD, oddA) {
        return (1 / oddH + 1 / oddD + 1 / oddA - 1) * 100;
    },

    // Convert true probabilities considering vig removal (proportional method)
    removeVig(oddH, oddD, oddA) {
        const probH = 1 / oddH;
        const probD = 1 / oddD;
        const probA = 1 / oddA;
        const total = probH + probD + probA;
        return {
            home: probH / total,
            draw: probD / total,
            away: probA / total
        };
    },

    // Odds format conversions
    decimalToFractional(decimal) {
        if (decimal <= 1) return '0/1';
        const dec = decimal - 1;
        const tolerance = 1.0e-6;
        let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = dec;
        do {
            const a = Math.floor(b);
            let aux = h1; h1 = a * h1 + h2; h2 = aux;
            aux = k1; k1 = a * k1 + k2; k2 = aux;
            b = 1 / (b - a);
        } while (Math.abs(dec - h1 / k1) > dec * tolerance && k1 < 100);
        return `${h1}/${k1}`;
    },

    fractionalToDecimal(fractional) {
        const parts = fractional.split('/');
        if (parts.length !== 2) return 0;
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!den) return 0;
        return num / den + 1;
    },

    decimalToAmerican(decimal) {
        if (decimal <= 1) return 0;
        if (decimal >= 2) return Math.round((decimal - 1) * 100);
        return Math.round(-100 / (decimal - 1));
    },

    americanToDecimal(american) {
        if (american > 0) return american / 100 + 1;
        if (american < 0) return 100 / Math.abs(american) + 1;
        return 0;
    },

    decimalToProbability(decimal) {
        if (decimal <= 1) return 0;
        return (1 / decimal) * 100;
    },

    probabilityToDecimal(prob) {
        if (prob <= 0 || prob >= 100) return 0;
        return 100 / prob;
    }
};
