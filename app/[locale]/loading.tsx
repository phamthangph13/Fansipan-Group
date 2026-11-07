export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="bg-white">
      <div className="border-b border-line bg-cloud">
        <div className="wrap py-12 lg:py-16">
          <div className="h-2.5 w-20 animate-pulse bg-line" />
          <div className="mt-4 h-9 w-full max-w-xl animate-pulse bg-line/80" />
          <div className="mt-3 h-3 w-full max-w-lg animate-pulse bg-line/60" />
          <div className="mt-2 h-3 w-full max-w-md animate-pulse bg-line/60" />
        </div>
      </div>
      <div className="wrap py-12 lg:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="border border-line p-5">
              <div className="h-8 w-8 animate-pulse bg-line/70" />
              <div className="mt-6 h-3 w-24 animate-pulse bg-line/60" />
              <div className="mt-3 h-3 w-full animate-pulse bg-line/50" />
              <div className="mt-2 h-3 w-4/5 animate-pulse bg-line/50" />
            </div>
          ))}
        </div>
        <span className="sr-only">Đang tải nội dung…</span>
      </div>
    </div>
  );
}
