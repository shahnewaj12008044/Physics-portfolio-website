import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Research from "@/components/Research";
import About from "@/components/About";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";

// Always read the latest JSON so admin edits appear without a rebuild.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();

  return (
    <main className="relative min-h-screen bg-void-950 pb-24 md:pb-0">
      <Navbar />
      <Hero profile={content.profile} />
      <Research papers={content.papers} />
      <About profile={content.profile} />
      <Certificates
        categories={content.categories}
        certificates={content.certificates}
      />
      <Contact profile={content.profile} />
    </main>
  );
}
