"use client"
import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useFilter } from '@/hooks/useFilter'

interface FilterOption {
    id: string
    name: string
}

interface FilterOptions {
    brands: FilterOption[]
    flavors: FilterOption[]
    puffs: FilterOption[]
    nicotineLevels: FilterOption[]
}

const Filter = () => {
    const {
        brandId,
        flavorId,
        puffsId,
        nicotineId,
        setFilters,
        clearFilters
    } = useFilter();

    const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const filterRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch('/api/products/filter-options')
                if (!response.ok) {
                    throw new Error('Failed to fetch filter options')
                }
                const data = await response.json()
                setFilterOptions(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchFilterOptions()
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setOpenDropdown(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const toggleDropdown = (dropdownName: string) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
    }

    const handleOptionClick = (type: 'brandId' | 'flavorId' | 'puffsId' | 'nicotineId', id: string) => {
        setFilters({ [type]: id });
        setOpenDropdown(null);
    };

    const activeFilters = { brandId, flavorId, puffsId, nicotineId };
    const hasActiveFilters = Object.values(activeFilters).some(Boolean);

    if (error) return <div className="flex gap-2 p-2">Error: {error}</div>

    return (
        <div className="flex items-center gap-4 w-11/12 mx-auto py-7 md:py-10 font-unbounded" ref={filterRef}>
            <section className="flex flex-wrap items-center gap-1 md:gap-5 lg:gap-10 xl:gap-16 bg-black rounded-full px-8 md:px-6 py-2.5 md:py-2 text-white w-full text-sm">
                {/* heading */}
                <div className='hidden lg:block'>
                    <h2 className='font-black ml-3 '>Filter by</h2>
                </div>

                {/* Loading state */}
                {loading ? (
                    <>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="relative">
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full">
                                    <div className="h-6 w-20 bg-gray-700 rounded-full animate-pulse"></div>
                                    <div className="h-5 w-5 bg-gray-700 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {/* Brand Filter */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('brand')}
                                className={`flex items-center cursor-pointer gap-2 px-4 py-1.5 hover:bg-gray-800 rounded-full transition-colors ${brandId ? 'bg-gray-700' : ''
                                    }`}
                            >
                                <span>Brand</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${openDropdown === 'brand' ? 'rotate-0' : '-rotate-90'}`}
                                />
                            </button>
                            {openDropdown === 'brand' && (
                                <div className="absolute z-10 mt-2 w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                                    {filterOptions?.brands.map((brand) => (
                                        <div
                                            key={brand.id}
                                            className={`px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors ${brandId === brand.id ? 'bg-gray-700' : ''
                                                }`}
                                            onClick={() => handleOptionClick('brandId', brand.id)}
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
                                onClick={() => toggleDropdown('flavor')}
                                className={`flex items-center cursor-pointer gap-2 px-4 py-1.5 hover:bg-gray-800 rounded-full transition-colors ${flavorId ? 'bg-gray-700' : ''
                                    }`}
                            >
                                <span>Flavor</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${openDropdown === 'flavor' ? 'rotate-0' : '-rotate-90'}`}
                                />
                            </button>
                            {openDropdown === 'flavor' && (
                                <div className="absolute z-10 mt-2 w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                                    {filterOptions?.flavors.map((flavor) => (
                                        <div
                                            key={flavor.id}
                                            className={`px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors ${flavorId === flavor.id ? 'bg-gray-700' : ''
                                                }`}
                                            onClick={() => handleOptionClick('flavorId', flavor.id)}
                                        >
                                            {flavor.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Puffs Filter */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('puffs')}
                                className={`flex items-center cursor-pointer gap-2 px-4 py-1.5 hover:bg-gray-800 rounded-full transition-colors ${puffsId ? 'bg-gray-700' : ''
                                    }`}
                            >
                                <span>Puffs</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${openDropdown === 'puffs' ? 'rotate-0' : '-rotate-90'}`}
                                />
                            </button>
                            {openDropdown === 'puffs' && (
                                <div className="absolute z-10 mt-2 w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                                    {filterOptions?.puffs.map((puff) => (
                                        <div
                                            key={puff.id}
                                            className={`px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors ${puffsId === puff.id ? 'bg-gray-700' : ''
                                                }`}
                                            onClick={() => handleOptionClick('puffsId', puff.id)}
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
                                onClick={() => toggleDropdown('nicotine')}
                                className={`flex items-center gap-2 px-4 py-1.5 hover:bg-gray-800 rounded-full transition-colors cursor-pointer ${nicotineId ? 'bg-gray-700' : ''
                                    }`}
                            >
                                <span>Nicotine</span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${openDropdown === 'nicotine' ? 'rotate-0' : '-rotate-90'}`}
                                />
                            </button>
                            {openDropdown === 'nicotine' && (
                                <div className="absolute z-10 mt-2 w-48 bg-black border border-gray-700 text-white rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                                    {filterOptions?.nicotineLevels.map((level) => (
                                        <div
                                            key={level.id}
                                            className={`px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors ${nicotineId === level.id ? 'bg-gray-700' : ''
                                                }`}
                                            onClick={() => handleOptionClick('nicotineId', level.id)}
                                        >
                                            {level.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {!loading && hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={16} />
                        Clear filters
                    </button>
                )}
            </section>
        </div>
    )
}

export default Filter