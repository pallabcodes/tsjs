import { ButtonProps } from '@mui/material';
/**
 * MUI Button Deconstruction
 */
export type MUIButtonVariant = ButtonProps['variant'];
export type MUIButtonColor = ButtonProps['color'];
export type MiniMUIButton = {
    variant: Exclude<MUIButtonVariant, undefined>;
    label: string;
    onClick: () => void;
};
