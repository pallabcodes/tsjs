import { ZenGit, type IZenGit } from '@zen-tui/native';
import { type CommitData } from './index';

let _nativeGit: IZenGit | null = null;
const getNativeGit = () => {
    if (!_nativeGit) _nativeGit = new ZenGit();
    return _nativeGit;
};

export const GitProvider = {
    getCommitLog: (limit: number = 50): CommitData[] => {
        try {
            const json = getNativeGit().getLog(limit);
            return JSON.parse(json);
        } catch (e) {
            return [];
        }
    },
    getCommitDiff: (hash: string): string => {
        try {
            return getNativeGit().getDiff(hash);
        } catch (e) {
            return 'Failed to fetch native diff.';
        }
    },
    stageFile: (path: string): void => {
        try {
            getNativeGit().stageFile(path);
        } catch (e) {}
    },
    unstageFile: (path: string): void => {
        try {
            getNativeGit().unstageFile(path);
        } catch (e) {}
    },
    getStatus: (): string[] => {
        try {
            const json = getNativeGit().getStatus();
            return JSON.parse(json);
        } catch (e) {
            return [];
        }
    },
    commit: (message: string): void => {
        try {
            getNativeGit().commit(message);
        } catch (e) {}
    },
    getBranches: (): string[] => {
        try {
            const json = getNativeGit().getBranches();
            return JSON.parse(json);
        } catch (e) {
            return [];
        }
    }
};
