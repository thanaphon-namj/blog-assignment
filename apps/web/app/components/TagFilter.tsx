"use client";

interface Props {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string) => void;
}

export default function TagFilter({
  tags,
  selected,
  onSelect,
}: Readonly<Props>) {
  return (
    <aside className="w-full lg:w-[30%] bg-white/95 p-5 rounded-2xl border border-blue-100/50 lg:sticky lg:top-24 flex flex-col gap-4">
      <div className="border-b border-slate-100 pb-2">
        <h2 className="text-xs font-bold uppercase text-slate-400">
          Filter Tags
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            type="button"
            key={tag}
            className={`h-8 rounded-lg border px-3 text-xs font-bold cursor-pointer inline-flex items-center justify-center ${
              selected === tag
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
            onClick={() => onSelect(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </aside>
  );
}
