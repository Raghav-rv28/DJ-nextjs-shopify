import Navbar from 'components/layout/navbar';
import LoadingDots from 'components/loading-dots';
import { ThemeProvider } from 'components/theme-provider';
import { Toaster } from 'components/ui/toaster';
import { GeistSans } from 'geist/font';
import { ensureStartsWith } from 'lib/utils';
import { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode, Suspense } from 'react';
import './globals.css';
const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // const user = await currentUser();
  // const prisma = new PrismaClient();
  // const getUserData = async () => {
  //   if (user) {
  //     const userDetails = await prisma.user.findUnique({
  //       where: {
  //         email: user.emailAddresses[0]?.emailAddress
  //       }
  //     });
  //     return userDetails;
  //   }
  // };
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-background text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NextTopLoader />
          <Navbar />
          <Suspense fallback={<LoadingDots className="text-lg text-orange-300" />}>
            <main>
              {children}
              <Toaster />
            </main>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
