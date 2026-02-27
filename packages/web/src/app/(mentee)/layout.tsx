import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MentorBackButton } from '@/components/layout/MentorSwitch';

export default function MenteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <MentorBackButton />
      <main className="pb-20 md:pb-8 px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
