"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROVIDERS = exports.chessAnalysisApi = void 0;
var manager_providers_1 = __importDefault(require("./api/manager-providers"));
var lichess_cloud_eval_1 = require("./api/providers/lichess-cloud-eval");
var lichess_opening_1 = require("./api/providers/lichess-opening");
var stockfish_eval_1 = require("./api/providers/stockfish-eval");
var normalizer_1 = __importDefault(require("./api/normalizer"));
var constants_1 = require("./api/constants");
Object.defineProperty(exports, "PROVIDERS", { enumerable: true, get: function () { return constants_1.PROVIDERS; } });
exports.chessAnalysisApi = {
    getAnalysis: function (params) {
        return new Promise(function (resolve, reject) {
            (0, manager_providers_1.default)(params)
                .then(function (result) { return resolve((0, normalizer_1.default)(result)); })
                .catch(reject);
        });
    },
    providers: {
        lichessCloud: lichess_cloud_eval_1.lichessCloudEval,
        lichessOpening: lichess_opening_1.lichessOpening,
        stockfish: stockfish_eval_1.stockfishEval
    },
};
//# sourceMappingURL=index.js.map