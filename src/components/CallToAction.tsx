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
    <section className="py-16 bg-tcs-accent">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-tcs-navy">{title}</h2>
        <p className="text-xl mb-8 text-tcs-navy">{description}</p>
        <Link 
          href={buttonLink}
          className="inline-flex items-center px-8 py-3 bg-tcs-navy text-white font-bold rounded-md hover:bg-tcs-navy-800 transition-colors shadow-lg"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
} 