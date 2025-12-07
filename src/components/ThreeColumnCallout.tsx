interface CalloutItem {
  title: string;
  description: string;
}

interface ThreeColumnCalloutProps {
  title: string;
  items: CalloutItem[];
  className?: string;
}

export default function ThreeColumnCallout({
  title,
  items,
  className = "bg-white"
}: ThreeColumnCalloutProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6">
                <h3 className="font-bold text-black mb-4" style={{ color: '#000000' }}>{item.title}</h3>
                <p className="text-black" style={{ color: '#000000' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 