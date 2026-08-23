import type { Metadata } from 'next';
import MyListGrid from '@/components/MyListGrid';

export const metadata: Metadata = {
  title: 'My List',
};

export default function MyListPage() {
  return (
    <div className="min-h-screen px-4 pb-12 pt-24 md:px-8 lg:px-12">
      <h1 className="mb-8 font-display text-3xl tracking-wide text-white md:text-4xl">
        My List
      </h1>
      <MyListGrid />
    </div>
  );
}
