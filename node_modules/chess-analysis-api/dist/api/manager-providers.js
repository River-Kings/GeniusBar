"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lichess_opening_1 = require("./providers/lichess-opening");
var lichess_cloud_eval_1 = require("./providers/lichess-cloud-eval");
var stockfish_eval_1 = require("./providers/stockfish-eval");
var chess_js_1 = require("chess.js");
var constants_1 = require("./constants");
function clamp(value, min, max) {
    if (value > max) {
        return max;
    }
    else if (value < min) {
        return min;
    }
    return value;
}
function getResult(providers, params, originalResolve, originalReject) {
    var currentProvider = providers[0];
    return new Promise(function (resolve, reject) {
        var workerCallback = {
            resolve: originalResolve || resolve,
            reject: originalReject || reject
        };
        if (currentProvider == null) {
            // provider has been skiped
            providers.shift();
            getResult(providers, params, workerCallback.resolve, workerCallback.reject);
        }
        else {
            currentProvider(params)
                .then(function (result) {
                workerCallback.resolve({
                    result: result,
                    providerName: currentProvider.name // provider function name
                });
            })
                .catch(function (error) {
                if (providers.length > 1) {
                    providers.shift();
                    getResult(providers, params, workerCallback.resolve, workerCallback.reject);
                }
                else {
                    workerCallback.reject({
                        errorLastProvider: error,
                        message: "all providers not available"
                    });
                }
            });
        }
    });
}
function getAnalysis(params) {
    var _a, _b, _c;
    // fix optionals params
    params.multipv = clamp(params.multipv || constants_1.DEFAULT_MULTI_PV, constants_1.MIN_MULTI_PV, constants_1.MAX_MULTI_PV);
    params.depth = clamp(params.depth || constants_1.DEFAULT_DEPTH, constants_1.MIN_DEPTH, constants_1.MAX_DEPTH);
    var chessReferee = new chess_js_1.Chess(params.fen);
    var isValidFen = chessReferee.validate_fen(params.fen).valid;
    if (!isValidFen) {
        throw new Error("FEN is not valid, analysis has been aborted");
    }
    if (chessReferee.game_over()) {
        throw new Error("FEN position is already resolve");
    }
    var countPlayedMoves = parseInt(params.fen.split(' ').pop());
    var providersOrder = [];
    var providers = {
        lichessOpening: (((_a = params.excludes) === null || _a === void 0 ? void 0 : _a.includes(constants_1.PROVIDERS.LICHESS_BOOK)) ? null : lichess_opening_1.lichessOpening),
        lichessCloudEval: (((_b = params.excludes) === null || _b === void 0 ? void 0 : _b.includes(constants_1.PROVIDERS.LICHESS_CLOUD_EVAL)) ? null : lichess_cloud_eval_1.lichessCloudEval),
        stockfishEval: (((_c = params.excludes) === null || _c === void 0 ? void 0 : _c.includes(constants_1.PROVIDERS.STOCKFISH)) ? null : stockfish_eval_1.stockfishEval)
    };
    if (countPlayedMoves < 15) {
        // [lichessOpening, lichessCloudEval, stockfishEval]
        providersOrder = [
            providers.lichessOpening,
            providers.lichessCloudEval,
            providers.stockfishEval
        ];
    }
    else if (countPlayedMoves < 35) {
        // [lichessCloudEval, stockfishEval]
        providersOrder = [
            providers.lichessCloudEval,
            providers.stockfishEval
        ];
    }
    else {
        // stockfishEval
        providersOrder = [
            providers.stockfishEval
        ];
    }
    return getResult(providersOrder, params);
}
exports.default = getAnalysis;
//# sourceMappingURL=manager-providers.js.map