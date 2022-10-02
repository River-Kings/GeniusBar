import { lichessCloudEval } from './api/providers/lichess-cloud-eval';
import { lichessOpening } from './api/providers/lichess-opening';
import { stockfishEval } from './api/providers/stockfish-eval';
import { AnalysisOutputType } from './api/normalizer';
import { PROVIDERS } from './api/constants';
export declare const chessAnalysisApi: {
    getAnalysis: (params: {
        fen: string;
        multipv?: number;
        depth?: number;
        excludes?: PROVIDERS[];
    }) => Promise<AnalysisOutputType>;
    providers: {
        lichessCloud: typeof lichessCloudEval;
        lichessOpening: typeof lichessOpening;
        stockfish: typeof stockfishEval;
    };
};
export { PROVIDERS };
//# sourceMappingURL=index.d.ts.map