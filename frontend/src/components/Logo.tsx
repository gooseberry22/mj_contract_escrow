import logoImage from 'figma:asset/01aad80c9e4e40f463b2a2f826ac957846249920.png';

export function Logo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const dimensions = size === 'large' ? 'w-32 h-32' : 'w-10 h-10';
  
  return (
    <img 
      src={logoImage} 
      alt="TBA Surrogacy Escrow Logo" 
      className={`${dimensions} object-contain`}
    />
  );
}
