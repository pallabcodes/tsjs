import { Theme, SxProps } from '@mui/material';
/**
 * MUI Theme & SxProps Deconstruction
 * Understanding how MUI handles styling with 'sx'
 */
export type MySx = SxProps<Theme>;
export type MiniTheme = {
    palette: {
        primary: string;
        secondary: string;
    };
};
export declare const createMiniTheme: (config: MiniTheme) => MiniTheme;
