import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Echo - Digital Legacy Platform',
  description: 'Turn your digital presence into a lasting legacy. Echo guides you to curate, preserve and share the story you want to leave behind.',
  openGraph: {
    title: 'Echo - Digital Legacy Platform',
    description: 'Turn your digital presence into a lasting legacy.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
}
