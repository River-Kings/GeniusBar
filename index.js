import {chessAnalysisApi, PROVIDERS} from 'chess-analysis-api';
// var chessAnalysisApi = require('chess-analysis-api');
// var PROVIDERS = require('chess-analysis-api');

function getEval(fen) {
    chessAnalysisApi.getAnalysis({

    // <https://en.wikipedia.org/wiki/Notation_Forsyth-Edwards>
    fen: "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    // fen: fen, 

    // calcul depth default=7
    depth: 12,

    // number options move should calcul
    multipv: 5,

    // excludes provider.s
    excludes: [
        PROVIDERS.LICHESS_BOOK,
        PROVIDERS.LICHESS_CLOUD_EVAL
    ]
    })
    .then(function (result) {
    console.log(result);
    result['moves'].forEach(function (element) {
        console.log(element['uci']);
        console.log(element['score']);
    });
    })
    // .catch( {
    // console.error(error);
    // throw new Error(error.message);
    // });
};

getEval("adsfasd");