import Link from 'next/link';

interface CallToActionProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function CallToAction({
  title,
  description,
  buttonText = "Contact Us Today",
  buttonLink = "/contact"
}: CallToActionProps) {
  return (
    <section className="py-16 bg-yellow-500">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-xl mb-8 text-gray-900">{description}</p>
        <Link 
          href={buttonLink}
          className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
} 