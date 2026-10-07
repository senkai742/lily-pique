export const colors = {
  primary: '#b588bd',   // Dusty Lavender
  secondary: '#E8D5E0', // Pale Blush 
  background: '#F7F4F6',// Pearl White 
  text: '#4A3B45',      // Deep Plum 
  gold: '#C9B18A',      // Muted Gold 
} as const;

export type ThemeColors = typeof colors;