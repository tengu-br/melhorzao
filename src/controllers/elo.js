var EloRank = require('elo-rank')
var elo = new EloRank(32)

matchup = (playerA, playerB, resultAonB) => {
    var expectedScoreA = elo.getExpected(playerA, playerB)
    var expectedScoreB = elo.getExpected(playerB, playerA)
    playerA = elo.updateRating(expectedScoreA, resultAonB, playerA)
    playerB = elo.updateRating(expectedScoreB, Math.abs(resultAonB - 1), playerB)
    return ({ playerA, playerB })
}

exports.matchup = matchup