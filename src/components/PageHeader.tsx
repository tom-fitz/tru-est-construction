import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  description?: string;
  height?: 'sm' | 'md' | 'lg';
}

export default function PageHeader({ 
  title, 
  description, 
  height = 'md',
}: PageHeaderProps) {
  const heightClasses = {
    sm: 'h-[300px]',
    md: 'h-[400px]',
    lg: 'h-[500px]'
  };

  return (
    <section className={`relative ${heightClasses[height]} w-full overflow-hidden bg-gradient-to-br from-tcs-navy-900 via-tcs-navy-800 to-gray-900`}>
      <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url('/graph-paper.svg')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px',
            filter: 'invert(1) brightness(0.3) contrast(1.2)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url('/graph-paper.svg')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '150px 150px',
            transform: 'rotate(45deg)',
            filter: 'invert(1) brightness(0.25) contrast(1.1)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('/graph-paper.svg')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            filter: 'invert(1) brightness(0.2) contrast(1.1)',
          }}
        />

      {/* TCS Logo - Left-aligned and Semi-transparent */}
      <div className="absolute inset-0 flex items-end justify-start pl-8 md:pl-16 pb-8 opacity-45">
        <Image
          src="/tcs_logo_transparent_buffer.png"
          alt="TCS Logo"
          width={500}
          height={233}
          className="max-w-md"
          priority
        />
      </div>
      
      {/* Dark gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-tcs-navy-900/80 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tcs-blue-900/10 to-transparent" />
      
      <div className="relative h-full w-full">
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            {description && (
              <p className="text-xl max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 