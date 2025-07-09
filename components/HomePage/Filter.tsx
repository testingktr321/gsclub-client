"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, X } from "lucide-react";
import { useFilter } from "@/hooks/useFilter";

interface FilterOption {
  id: string;
  name: string;
}

interface FilterOptions {
  brands: FilterOption[];
  flavors: FilterOption[];
  puffs: FilterOption[];
  nicotineLevels: FilterOption[];
}

const Filter = () => {
  const {
    brandId,
    flavorId,
    puffsId,
    nicotineId,
    setFilters,
    clearFilters,
    removeFilter,
  } = useFilter();

  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const getSelectedFilterName = (
    type: "brandId" | "flavorId" | "puffsId" | "nicotineId"
  ) => {
    const id = { brandId, flavorId, puffsId, nicotineId }[type];
    if (!id) return null;

    const options = {
      brandId: filterOptions?.brands,
      flavorId: filterOptions?.flavors,
      puffsId: filterOptions?.puffs,
      nicotineId: filterOptions?.nicotineLevels,
    }[type];

    return options?.find((option) => option.id === id)?.name;
  };

  const activeFilters = [
    { type: "brandId", id: brandId, name: getSelectedFilterName("brandId") },
    { type: "flavorId", id: flavorId, name: getSelectedFilterName("flavorId") },
    { type: "puffsId", id: puffsId, name: getSelectedFilterName("puffsId") },
    {
      type: "nicotineId",
      id: nicotineId,
      name: getSelectedFilterName("nicotineId"),
    },
  ].filter((filter) => filter.id);

  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (brandId) params.append("brandId", brandId);
      if (flavorId) params.append("flavorId", flavorId);
      if (puffsId) params.append("puffsId", puffsId);
      if (nicotineId) params.append("nicotineId", nicotineId);

      const response = await fetch(
        `/api/products/filter-options?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }
      const data = await response.json();
      setFilterOptions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  },[ brandId, flavorId, puffsId, nicotineId]);

  useEffect(() => {
    fetchFilterOptions();
  }, [brandId, flavorId,fetchFilterOptions, puffsId, nicotineId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleOptionClick = (
  type: "brandId" | "flavorId" | "puffsId" | "nicotineId",
  id: string
) => {
  // Get the current value for this filter type
  const currentValue = { brandId, flavorId, puffsId, nicotineId }[type];
  
  // If the clicked option is already selected, remove the filter
  if (currentValue === id) {
    removeFilter(type);
  } else {
    // Otherwise, set the new filter
    setFilters({ [type]: id });
  }
  
  // Close the dropdown
  setOpenDropdown(null);
};

  const hasActiveFilters = activeFilters.length > 0;

  if (error) return <div className="flex gap-2 p-2">Error: {error}</div>;

  return (
    <div
      className="flex items-center gap-4 w-11/12 mx-auto py-7 md:py-10 font-unbounded"
      ref={filterRef}
    >
      <section className="flex flex-wrap items-center gap-1 md:gap-4 lg:gap-8 xl:gap-10 bg-black rounded-full px-8 md:px-6 py-2.5 md:py-2 text-white w-full text-sm">
        {/* heading */}
        <div className="hidden lg:block">
          <h2 className="font-black ml-3">Filter by</h2>
        </div>

        {/* Loading state */}
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="relative">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full">
                <div className="h-6 w-20 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))
        ) : (
          <>
            {/* Brand Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("brand")}
                className={`flex items-center cursor-pointer gap-2 px-4 py-1.5 hover:bg-gray-800 rounded-full transition-colors ${
                  brandId ? "bg-gray-700" : ""
                }`}
              >
                <span>Brand</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    openDropdown === "brand" ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {openDropdown === "brand" && (
                <div className="absolute z-10 mt-2 w-fit md:w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-[50vh] overflow-y-auto">
                  {filterOptions?.brands.map((brand) => (
                    <div
                      key={brand.id}
                      className={`px-4 flex items-center justify-between py-2 hover:bg-gray-700 cursor-pointer transition-colors ${
                        brandId === brand.id ? "bg-gray-700" : ""
                      }`}
                      onClick={() => handleOptionClick("brandId", brand.id)}
                    >
                      {brand.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Flavor Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("flavor")}
                className={`flex items-center cursor-pointer gap-2 px-4 py-1.5 hover:bg-gray-800 rounded-full transition-colors ${
                  flavorId ? "bg-gray-700" : ""
                }`}
              >
                <span>Flavor</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    openDropdown === "flavor" ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {openDropdown === "flavor" && (
                <div className="absolute z-10 mt-2 w-fit md:w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-[50vh] overflow-y-auto">
                  {filterOptions?.flavors.map((flavor) => (
                    <>
                      <div
                        key={flavor.id}
                        className={`px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors ${
                          flavorId === flavor.id ? "bg-gray-700" : ""
                        }`}
                        onClick={() => handleOptionClick("flavorId", flavor.id)}
                      >
                        {flavor.name}
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>

            {/* Puffs Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("puffs")}
                className={`flex items-center cursor-pointer gap-2 px-4 py-1.5 hover:bg-gray-800 rounded-full transition-colors ${
                  puffsId ? "bg-gray-700" : ""
                }`}
              >
                <span>Puffs</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    openDropdown === "puffs" ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {openDropdown === "puffs" && (
                <div className="absolute z-10 mt-2 w-fit md:w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-[50vh] overflow-y-auto">
                  {filterOptions?.puffs.map((puff) => (
                    <div
                      key={puff.id}
                      className={`px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors ${
                        puffsId === puff.id ? "bg-gray-700" : ""
                      }`}
                      onClick={() => handleOptionClick("puffsId", puff.id)}
                    >
                      {puff.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nicotine Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("nicotine")}
                className={`flex items-center gap-2 px-4 py-1.5 hover:bg-gray-800 rounded-full transition-colors cursor-pointer ${
                  nicotineId ? "bg-gray-700" : ""
                }`}
              >
                <span>Nicotine</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    openDropdown === "nicotine" ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {openDropdown === "nicotine" && (
                <div className="absolute z-10 mt-2 w-fit md:w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-[50vh] overflow-y-auto">
                  {filterOptions?.nicotineLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors ${
                        nicotineId === level.id ? "bg-gray-700" : ""
                      }`}
                      onClick={() => handleOptionClick("nicotineId", level.id)}
                    >
                      {level.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Filters Dropdown */}
            {/* <div className="relative">
              <button
                onClick={() => toggleDropdown("activeFilters")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                  hasActiveFilters ? "bg-gray-700 hover:bg-gray-800" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!hasActiveFilters}
              >
                <span>Active Filters ({activeFilters.length})</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    openDropdown === "activeFilters" ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {openDropdown === "activeFilters" && (
                <div className="absolute z-10 right-0 mt-2 w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-[50vh] overflow-y-auto">
                  {activeFilters.length > 0 ? (
                    <>
                      {activeFilters.map((filter) => (
                        <div
                          key={filter.type}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <span>{filter.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFilter(filter.type as any);
                            }}
                            className="hover:text-gray-300 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <div className="border-t border-gray-700 mt-1 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFilters();
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400 hover:text-red-300 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-2 text-gray-400">No active filters</div>
                  )}
                </div>
              )}
            </div> */}
          </>
        )}

        {!loading && hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer ml-auto"
          >
            <X size={16} />
            Clear all
          </button>
        )}
      </section>
    </div>
  );
};

export default Filter;
