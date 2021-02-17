/*
Como você deve saber, ELO é só uma conta matemática cabulosa. Ao invés de tentar replicar
a lógica, eu só importei um pacote com as funcionalidades básicas. Para pesquisar pacotes
e ver a documentação de cada um, é só ir no npmjs.com e ser feliz
*/
var EloRank = require('elo-rank')
// Instanciando a biblioteca
var elo = new EloRank(32)

/*
Funçãozinha de matchup -> pega dois jogadores e o resultado de A sobre B (ganhou 1, perdeu 0 ou empate 0.5)
e retorna qual deve ser o novo ELO de cada um. Não faz nenhuma leitura ou alteração no banco.
*/
matchup = (playerA, playerB, resultAonB) => {
    var expectedScoreA = elo.getExpected(playerA, playerB)
    var expectedScoreB = elo.getExpected(playerB, playerA)
    playerA = elo.updateRating(expectedScoreA, resultAonB, playerA)
    playerB = elo.updateRating(expectedScoreB, Math.abs(resultAonB - 1), playerB)
    return ({ playerA, playerB })
}

/*
TO-DO:
Função de matchmaking.
Apesar de não ser essencial, a falta de um sistema de pareamento dificulta a distinção dentre os extremos
do nosso ranking. i.e. as coisas vão +/- ter a posição certa, mas a precisão vai ser baixa. e.g: boas coisas
vão ficar em cima e coisas ruins vão ficar em baixo, mas não vamos conseguir distinguir de maneira precisa qual
das coisas boas é melhor e qual das coisas ruins é pior.
*/

// Exportando a função para ser usada em outros arquivos ao longo do projeto
exports.matchup = matchup