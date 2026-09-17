"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filters, ProductCard, SortSheet } from "@/components/commerce";
import { Pagination } from "@/components/page-chrome";
import { ContentContainer, PageShell } from "@/components/templates/page-shell";
import { EmptyState, ProductGridSkeleton } from "@/components/states";
import { getProductList, productToCard } from "@/lib/services/products";
import type { FilterGroup, ProductListResult } from "@/lib/types";

type Props = {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
};

export function ProductListingView({ category, search, sort = "Popular", page = 1 }: Props) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ProductListResult | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortValue, setSortValue] = useState(sort);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductList({ category, search, sort: sortValue, page, filters: selectedFilters })
      .then(setData)
      .finally(() => setLoading(false));
  }, [category, search, sortValue, page, selectedFilters]);

  const filterGroups: FilterGroup[] = data?.filterGroups ?? [];
  const filterCount = useMemo(() => Object.values(selectedFilters).reduce((t, v) => t + v.length, 0), [selectedFilters]);

  const toggleFilter = (groupTitle: string, option: string) => {
    setSelectedFilters((current) => {
      const currentValues = current[groupTitle] || [];
      const nextValues = currentValues.includes(option) ? currentValues.filter((v) => v !== option) : [...currentValues, option];
      const next = { ...current };
      if (nextValues.length) next[groupTitle] = nextValues;
      else delete next[groupTitle];
      return next;
    });
  };

  const queryRecord = Object.fromEntries(searchParams.entries());

  return (
    <PageShell>
      <ContentContainer>
        <div className="hidden items-center justify-end bg-white px-0 pb-2 pt-2 lg:flex">
          <label className="flex items-center gap-2 text-[12px] font-medium tracking-[0.36px] text-[#3f3f3f]">
            <span>Sort by</span>
            <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              className="border border-[#d7d7d7] bg-white px-2 py-1 text-[12px] outline-none"
            >
              <option>Popular</option>
              <option>Price - Low to High</option>
              <option>Price - High to Low</option>
            </select>
          </label>
        </div>

        <div className="flex gap-6 lg:pb-10">
          <div className="hidden w-[220px] shrink-0 pt-8 lg:block">
            <p className="mb-7 text-[14px] font-semibold uppercase tracking-[0.56px]">Filter</p>
            <Filters groups={filterGroups} selected={selectedFilters} onToggle={toggleFilter} />
          </div>

          <div className="flex-1 px-0 pb-6 pt-[10px] lg:pt-5">
            <div className="mb-4 flex items-center justify-between px-1 lg:hidden">
              <button type="button" onClick={() => setIsSortOpen(true)} className="border border-[#d9d9d9] bg-white px-3 py-2 text-[12px] font-medium uppercase tracking-[0.36px]">
                Sort by : {sortValue}
              </button>
              <button type="button" onClick={() => setIsMobileFilterOpen(true)} className="border border-[#d9d9d9] bg-white px-3 py-2 text-[12px] font-medium uppercase tracking-[0.36px]">
                Filter {filterCount > 0 ? `(${filterCount})` : ""}
              </button>
            </div>

            {loading ? (
              <ProductGridSkeleton />
            ) : data?.products.length ? (
              <>
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8">
                  {data.products.map((product) => (
                    <ProductCard key={product.id} product={productToCard(product)} />
                  ))}
                </div>
                <Pagination page={data.page} totalPages={data.totalPages} basePath="/products" searchParams={queryRecord} />
              </>
            ) : (
              <EmptyState title="No products found" message="Try adjusting your filters or search terms." />
            )}
          </div>
        </div>
      </ContentContainer>

      <SortSheet open={isSortOpen} onClose={() => setIsSortOpen(false)} onApply={setSortValue} />

      {isMobileFilterOpen ? (
        <div className="fixed inset-0 z-50 bg-black/30 lg:hidden" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-[22px] bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold uppercase tracking-[0.72px]">Filter</h3>
              <button type="button" onClick={() => setIsMobileFilterOpen(false)}>Close</button>
            </div>
            {filterGroups.map((group) => (
              <div key={group.title} className="mb-6">
                <h4 className="mb-3 text-[13px] font-semibold uppercase">{group.title}</h4>
                {group.options.map((option) => (
                  <label key={option} className="mb-2 flex items-center justify-between text-[13px]">
                    <span>{option}</span>
                    <input type="checkbox" checked={Boolean(selectedFilters[group.title]?.includes(option))} onChange={() => toggleFilter(group.title, option)} className="accent-black" />
                  </label>
                ))}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 border-t pt-3">
              <button type="button" onClick={() => setSelectedFilters({})} className="h-10 border border-black text-[12px] font-semibold uppercase">Clear All</button>
              <button type="button" onClick={() => setIsMobileFilterOpen(false)} className="h-10 border border-black bg-black text-[12px] font-semibold uppercase text-white">Apply</button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
