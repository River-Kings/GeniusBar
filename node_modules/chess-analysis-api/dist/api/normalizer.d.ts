export declare type AnalysisOutputProviderType = "lichess" | "stockfish";
export declare type AnalysisOutputActionType = "opening" | "eval";
export declare type AnalysisOutputLineScoreType = "cp" | "mate";
export declare type AnalysisOutputLineScore = {
    type: AnalysisOutputLineScoreType;
    value: number;
};
export declare type AnalysisOutputLineType = {
    score?: AnalysisOutputLineScore;
    uci: string | string[];
};
export declare type AnalysisOutputType = {
    provider: AnalysisOutputProviderType;
    type: AnalysisOutputActionType;
    fen: string;
    depth?: number;
    multipv?: number;
    opening?: {
        eco: string;
        name: string;
    } | null;
    moves: AnalysisOutputLineType[];
};
export default function normalizeEval(analysis: any): AnalysisOutputType;
//# sourceMappingURL=normalizer.d.ts.map