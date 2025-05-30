"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterSelect from "@/components/shared/filterSelect";
import TyreCard from "@/components/shared/tyreCard";

import { TyreCard as TyreCardType, TyreData } from "../types";

import axios from "axios";

import { useEffect, useState, useCallback, useRef } from "react";

export default function TruckTiresPage() {
  const [tyres, setTyres] = useState<TyreCardType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  const getCatalog = async (page: number = 1, limit: number = 10) => {
    const res = await axios.get<TyreData>("/api/proxy/api/tiers/catalog", {
      params: {
        page,
        limit,
      },
    });
    return res.data.tiers;
  };

  const loadTyres = useCallback(
    async (page: number, isNewSearch: boolean = false) => {
      setLoading(true);
      try {
        const newTyres = await getCatalog(page, 5);

        if (newTyres.length === 0) {
          setHasMore(false);
        } else {
          setTyres((prevTyres) =>
            isNewSearch ? newTyres : [...prevTyres, ...newTyres]
          );
          // If we get less than the limit, we've reached the end
          if (newTyres.length < 5) {
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
    loadTyres(1, true);
  }, [loadTyres]);

  // Load more when page changes
  useEffect(() => {
    if (currentPage > 1) {
      loadTyres(currentPage);
    }
  }, [currentPage, loadTyres]);

  // Reset pagination when filters change (you'll need to implement this)
  const resetPagination = () => {
    setCurrentPage(1);
    setTyres([]);
    setHasMore(true);
    loadTyres(1, true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Грузовые шины</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <FilterSelect
          label="Ширина"
          options={[
            { label: "Все", value: "all" },
            { label: "295", value: "295" },
            { label: "315", value: "315" },
            { label: "385", value: "385" },
          ]}
          onChange={resetPagination} // Add this prop to trigger reset
        />

        <FilterSelect
          label="Высота"
          options={[
            { label: "Все", value: "all" },
            { label: "70", value: "70" },
            { label: "80", value: "80" },
            { label: "90", value: "90" },
          ]}
          onChange={resetPagination}
        />

        <FilterSelect
          label="Диаметр"
          options={[
            { label: "Все", value: "all" },
            { label: "R22.5", value: "r22.5" },
            { label: "R19.5", value: "r19.5" },
            { label: "R17.5", value: "r17.5" },
          ]}
          onChange={resetPagination}
        />

        <FilterSelect
          label="Ось"
          options={[
            { label: "Все", value: "all" },
            { label: "Ведущая", value: "drive" },
            { label: "Рулевая", value: "steer" },
            { label: "Прицепная", value: "trailer" },
          ]}
          onChange={resetPagination}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tyres &&
          tyres.map((tire, index) => {
            // Add ref to the last element for intersection observer
            if (tyres.length === index + 1) {
              return (
                <div ref={lastTyreElementRef} key={index}>
                  <TyreCard model={tire} />
                </div>
              );
            } else {
              return <TyreCard key={index} model={tire} />;
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
    </div>
  );
}
