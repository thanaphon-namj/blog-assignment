"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

interface PageItem {
  key: string;
  value: number | string;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null;

  const getPages = (): PageItem[] => {
    const total = totalPages;
    const current = page;
    const pages: PageItem[] = [];

    if (total <= 7) {
      for (let index = 1; index <= total; index++) {
        pages.push({ key: `page-${index}`, value: index });
      }
    } else {
      pages.push({ key: "page-1", value: 1 });

      if (current > 3) {
        pages.push({ key: "ellipse-left", value: "..." });
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      let startPage = start;
      let endPage = end;

      if (current <= 3) {
        endPage = 4;
      } else if (current >= total - 2) {
        startPage = total - 3;
      }

      for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
        pages.push({ key: `page-${pageNumber}`, value: pageNumber });
      }

      if (current < total - 2) {
        pages.push({ key: "ellipse-right", value: "..." });
      }

      pages.push({ key: `page-${total}`, value: total });
    }

    return pages;
  };

  return (
    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
      <p className="hidden sm:block text-xs text-slate-500 font-medium">
        Page <span className="font-bold text-slate-800">{page}</span> of{" "}
        <span className="font-bold text-slate-800">{totalPages}</span>
      </p>
      <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end items-center">
        <button
          onClick={() => onChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          Previous
        </button>

        <div className="hidden sm:flex gap-1 items-center">
          {getPages().map((item) => {
            if (item.value === "...") {
              return (
                <span
                  key={item.key}
                  className="px-2 text-xs font-bold text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => onChange(item.value as number)}
                className={`h-8 w-8 rounded-lg text-xs font-bold cursor-pointer ${
                  page === item.value
                    ? "bg-blue-600 text-white font-extrabold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.value}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
