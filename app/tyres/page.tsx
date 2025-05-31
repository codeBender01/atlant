"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterSelect from "@/components/shared/filterSelect";
import TyreCard from "@/components/shared/tyreCard";

import { TyreCard as TyreCardType, TyreData } from "../types";

import axios from "axios";

import { useEffect, useState, useCallback, useRef } from "react";

interface Filters {
  axis?: string;
  size?: string;
  speed_index?: string;
  tread_depth?: number;
}

export default function TruckTiresPage() {
  const [tyres, setTyres] = useState<TyreCardType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<Filters>({});

  const observer = useRef<IntersectionObserver | null>(null);
  const lastTyreElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const getCatalog = async (
    page: number = 1,
    limit: number = 10,
    appliedFilters: Filters = {}
  ) => {
    // Build query parameters with proper type conversion
    const params: any = {
      page,
      limit,
    };

    // Add filters to params with proper type handling
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        if (key === "tread_depth") {
          // Convert tread_depth to number
          params[key] = Number(value);
        } else {
          params[key] = value;
        }
      }
    });

    console.log("API Request params:", params); // Debug log

    try {
      const res = await axios.get<TyreData>("/api/proxy/api/tiers/catalog", {
        params,
      });

      console.log("API Response:", res.data); // Debug log
      return res.data.tiers;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  const loadTyres = useCallback(
    async (
      page: number,
      isNewSearch: boolean = false,
      appliedFilters: Filters = {}
    ) => {
      setLoading(true);
      try {
        console.log("Loading tyres with filters:", appliedFilters); // Debug log
        const newTyres = await getCatalog(page, 10, appliedFilters);

        if (newTyres.length === 0) {
          setHasMore(false);
        } else {
          setTyres((prevTyres) =>
            isNewSearch ? newTyres : [...prevTyres, ...newTyres]
          );
          // If we get less than the limit, we've reached the end
          if (newTyres.length < 10) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error("Error loading tyres:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadTyres(1, true, filters);
  }, [loadTyres]);

  // Load more when page changes (with current filters)
  useEffect(() => {
    if (currentPage > 1) {
      loadTyres(currentPage, false, filters);
    }
  }, [currentPage, loadTyres, filters]);

  // Reset pagination and reload when filters change
  useEffect(() => {
    console.log("Filters changed:", filters); // Debug log
    setCurrentPage(1);
    setTyres([]);
    setHasMore(true);
    loadTyres(1, true, filters);
  }, [filters, loadTyres]);

  // Handle filter changes with proper type conversion
  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    console.log(`Filter change: ${filterType} = ${value}`); // Debug log

    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (value === "all" || !value) {
        // Remove the filter
        delete newFilters[filterType];
      } else {
        // Set the filter with proper type
        if (filterType === "tread_depth") {
          newFilters[filterType] = Number(value);
        } else {
          newFilters[filterType] = value;
        }
      }

      return newFilters;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Грузовые шины</h1>

      {/* Debug info - remove in production */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 w-[90vw] mx-auto">
        <FilterSelect
          label="Ось"
          options={[
            { label: "Все", value: "all" },
            { label: "Передняя", value: "front" },
            { label: "Задняя", value: "rear" },
          ]}
          onChange={(value) => handleFilterChange("axis", value)}
        />

        <FilterSelect
          label="Размер"
          options={[
            { label: "Все", value: "all" },
            { label: "225/48R15", value: "225/48R15" },
            { label: "247/52R19", value: "247/52R19" },
            { label: "204/40R16", value: "204/40R16" },
            { label: "209/55R17", value: "209/55R17" },
            { label: "225/45R19", value: "225/45R19" },
            { label: "207/57R17", value: "207/57R17" },
            { label: "225/57R18", value: "225/57R18" },
            { label: "240/64R16", value: "240/64R16" },
            { label: "196/44R18", value: "196/44R18" },
          ]}
          onChange={(value) => handleFilterChange("size", value)}
        />

        <FilterSelect
          label="Индекс скорости"
          options={[
            { label: "Все", value: "all" },
            { label: "Y", value: "Y" },
            { label: "T", value: "T" },
            { label: "V", value: "V" },
            { label: "H", value: "H" },
          ]}
          onChange={(value) => handleFilterChange("speed_index", value)}
        />

        <FilterSelect
          label="Глубина протектора"
          options={[
            { label: "Все", value: "all" },
            { label: "7.0", value: "7" },
            { label: "7.1", value: "7.1" },
            { label: "7.2", value: "7.2" },
            { label: "7.9", value: "7.9" },
            { label: "8.5", value: "8.5" },
            { label: "8.7", value: "8.7" },
            { label: "9.0", value: "9" },
          ]}
          onChange={(value) => handleFilterChange("tread_depth", value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tyres &&
          tyres.map((tire, index) => {
            // Add ref to the last element for intersection observer
            if (tyres.length === index + 1) {
              return (
                <div ref={lastTyreElementRef} key={`${tire.id}-${index}`}>
                  <TyreCard model={tire} />
                </div>
              );
            } else {
              return <TyreCard key={`${tire.id}-${index}`} model={tire} />;
            }
          })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* No more results indicator */}
      {!hasMore && tyres.length > 0 && (
        <div className="text-center mt-8 text-gray-500">Все шины загружены</div>
      )}

      {/* No results found */}
      {!loading && tyres.length === 0 && (
        <div className="text-center mt-8 text-gray-500">
          По выбранным фильтрам шины не найдены
        </div>
      )}
    </div>
  );
}
