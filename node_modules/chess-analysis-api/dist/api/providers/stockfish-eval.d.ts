export declare type StockfishScoreType = "cp" | "mate";
export interface StockfishEntry {
    depth: number;
    multipv: number;
    score: {
        type: StockfishScoreType;
        value: number;
    };
    moves: string[];
}
export interface StockfishEval {
    lines: StockfishEntry[];
    depth: number;
    multipv: number;
    fen: string;
}
/** @see /test/stockfish-parse-line-info.test.ts */
export declare function parseLineInfo(data: string): StockfishEntry;
export declare function getBestLines(entries: StockfishEntry[][]): StockfishEntry[];
export declare function stockfishEval(params: {
    fen: string;
    multipv?: number;
    depth?: number;
}): Promise<StockfishEval>;
//# sourceMappingURL=stockfish-eval.d.ts.map