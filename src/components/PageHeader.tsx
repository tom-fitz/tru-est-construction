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
    <section className={`relative ${heightClasses[height]} w-full`}>
      <div className="absolute inset-0 bg-gray-900/70 z-10" />
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-gray-500" />
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            {description && (
              <p className="text-xl mb-8 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 