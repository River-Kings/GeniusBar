"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalizeEval(analysis) {
    var _a;
    var analysisOutput = {
        fen: analysis.result.fen || analysis.fen,
        provider: "lichess",
        moves: [],
        type: "eval",
        depth: -Infinity,
        multipv: -Infinity
    };
    if (analysis.providerName.startsWith("lichess")) {
        analysisOutput.provider = "lichess";
        if (analysis.providerName == "lichessOpening") {
            analysisOutput.type = "opening";
            analysisOutput.opening = (analysis.result.opening);
            analysisOutput.moves = analysis.result.moves.map(function (move) { return ({
                uci: move.uci
            }); });
        }
        else {
            analysisOutput.type = "eval";
            analysisOutput.moves = analysis.result.pvs.map(function (line) {
                var moveBack = {
                    score: {
                        type: "cp",
                        value: Infinity
                    },
                    uci: line.moves.split(' ')
                };
                if (line.cp) {
                    moveBack.score.type = "cp";
                    moveBack.score.value = line.cp;
                }
                else {
                    moveBack.score.type = "mate";
                    moveBack.score.value = line.mate;
                }
                return moveBack;
            });
        }
    }
    else {
        analysisOutput.provider = "stockfish";
        analysisOutput.type = "eval";
        analysisOutput.moves = analysis.result.lines.map(function (line) { return ({
            uci: line.moves,
            score: line.score
        }); });
    }
    var result = analysis.result;
    analysisOutput.depth = result.depth || null;
    analysisOutput.multipv = result.multipv || ((_a = result.pvs) === null || _a === void 0 ? void 0 : _a.length) || result.moves.length;
    return analysisOutput;
}
exports.default = normalizeEval;
;
//# sourceMappingURL=normalizer.js.map