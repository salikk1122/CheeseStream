interface TrailerPlayerProps {
  videoKey: string;
  title: string;
}

export default function TrailerPlayer({ videoKey, title }: TrailerPlayerProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}?modestbranding=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
