type BrandLogoKind = 'symbol' | 'wordmark';
type BrandLogoTone = 'dark' | 'light' | 'theme';

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  kind?: BrandLogoKind;
  label?: string;
  tone?: BrandLogoTone;
}

const logoSources: Record<BrandLogoKind, { dark: string; light: string }> = {
  symbol: {
    dark: '/brand/aeon-symbol-dark.png',
    light: '/brand/aeon-symbol-light.png',
  },
  wordmark: {
    dark: '/brand/aeon-logo-dark.png',
    light: '/brand/aeon-logo-light.png',
  },
};

export default function BrandLogo({
  className = '',
  imageClassName = '',
  kind = 'wordmark',
  label = 'Peter Xie / Portfolio',
  tone = 'theme',
}: BrandLogoProps) {
  const sources = logoSources[kind];

  return (
    <span
      aria-label={label}
      className={`brand-logo brand-logo-${kind} brand-logo-tone-${tone} ${className}`.trim()}
      role="img"
    >
      <img
        alt=""
        aria-hidden="true"
        className={`brand-logo-image brand-logo-image-dark ${imageClassName}`.trim()}
        decoding="async"
        src={sources.dark}
      />
      <img
        alt=""
        aria-hidden="true"
        className={`brand-logo-image brand-logo-image-light ${imageClassName}`.trim()}
        decoding="async"
        src={sources.light}
      />
    </span>
  );
}
