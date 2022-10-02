import { PROVIDERS } from './constants';
export default function getAnalysis(params: {
    fen: string;
    multipv?: number;
    depth?: number;
    excludes?: PROVIDERS[];
}): Promise<any>;
//# sourceMappingURL=manager-providers.d.ts.map