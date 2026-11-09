// Etiqueta pequeña reutilizable. variant: 'green' | 'yellow' | 'grey'
export default function Chip({ children, variant = 'grey' }) {
  const cls = variant === 'grey' ? 'sh-chip' : `sh-chip sh-chip--${variant}`;
  return <span className={cls}>{children}</span>;
}
