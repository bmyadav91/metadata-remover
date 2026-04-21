import React from 'react';
import { useTheme } from '../theme/useTheme';

import {
    FilePlay,
    FileText,
    Headphones,
    BookText,
    FileArchive,
    Paperclip,
    ArrowRight,
    Eye,
    LockKeyhole,
    Upload
} from 'lucide-react-native';

const ICONS = {
    FilePlay: FilePlay,
    FileText: FileText,
    Headphones: Headphones,
    BookText: BookText,
    FileArchive: FileArchive,
    Paperclip: Paperclip,
    ArrowRight,
    Eye,
    LockKeyhole,
    Upload
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
    name: IconName;
    size?: number;
    color?: string;
};

export function AppIcon({ name, size = 24, color }: Props) {
    const theme = useTheme();
    const Icon = ICONS[name];

    if (!Icon) return null;

    return <Icon size={size} color={color || theme.text} />;
}