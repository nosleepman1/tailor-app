// TailleurPro Theme System — Typed Couture Palettes

export interface AppTheme {
  mode: 'light' | 'dark';
  bg: string;
  bgElevated: string;
  bgLevel2: string;
  border: string;
  borderLight: string;
  shadow: string;

  text: string;
  textMuted: string;
  textSubtle: string;

  primary: string;
  primaryLight: string;
  primaryBorder: string;
  primaryDark: string;

  gold: string;
  goldLight: string;

  slate: string;
  slateLight: string;

  success: string;
  successLight: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;
}

export const lightTheme: AppTheme = {
  mode: 'light',
  bg: '#FDFBF7',             // Ivoire Doux
  bgElevated: '#FFFFFF',     // Blanc Pur
  bgLevel2: '#F4F5F7',       // Surface secondaire
  border: '#E8E4D9',
  borderLight: '#F2EFE8',
  shadow: 'rgba(44, 62, 80, 0.06)',

  text: '#2C3E50',           // Bleu Nuit Ardoise
  textMuted: '#5E7084',
  textSubtle: '#8E735B',     // Bronze Taupe

  primary: '#D4AF37',        // Doré Mat / Or Couture
  primaryLight: '#FBF8F0',
  primaryBorder: '#F4E9C8',
  primaryDark: '#B8962E',

  gold: '#D4AF37',
  goldLight: '#FBF8F0',

  slate: '#2C3E50',
  slateLight: '#F4F5F7',

  success: '#10B981',        // Émeraude
  successLight: 'rgba(16, 185, 129, 0.1)',
  error: '#EF4444',          // Rouge Corail
  errorLight: 'rgba(239, 68, 68, 0.1)',
  warning: '#F59E0B',        // Ambre
  warningLight: 'rgba(245, 158, 11, 0.1)',
  info: '#3B82F6',
  infoLight: 'rgba(59, 130, 246, 0.1)',
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  bg: '#121212',             // Noir Profond Atelier
  bgElevated: '#1E1E1E',     // Gris Anthracite
  bgLevel2: '#282828',
  border: '#333333',
  borderLight: '#262626',
  shadow: 'rgba(0, 0, 0, 0.5)',

  text: '#F3F4F6',           // Gris Perle
  textMuted: '#9CA3AF',
  textSubtle: '#6B7280',

  primary: '#FFD700',        // Or Brillant
  primaryLight: 'rgba(255, 215, 0, 0.12)',
  primaryBorder: 'rgba(255, 215, 0, 0.25)',
  primaryDark: '#E6C200',

  gold: '#FFD700',
  goldLight: 'rgba(255, 215, 0, 0.12)',

  slate: '#1E1E1E',
  slateLight: '#282828',

  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.15)',
  error: '#F87171',
  errorLight: 'rgba(248, 113, 113, 0.15)',
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.15)',
  info: '#60A5FA',
  infoLight: 'rgba(96, 165, 250, 0.15)',
};
