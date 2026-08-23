import type { Metadata } from 'next';
import MyListGrid from '@/components/MyListGrid';

export const metadata: Metadata = {
  title: 'My List',
};

export default function MyListPage() {
  return (
    <div className="min-h-screen px-4 pb-24 pt-20 sm:pt-24 md:px-8 md:pb-12 lg:px-12">
      <h1 className="mb-6 font-display text-2xl tracking-wide text-white sm:mb-8 sm:text-3xl md:text-4xl">
        My List
      </h1>
      <MyListGrid />
    </div>
  );
}
