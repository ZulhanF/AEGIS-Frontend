import { useState, useEffect, useCallback } from "react";
import { getOverview } from "../utils/api";

export function useOverview() {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOverview();
      setOverview(data.overview);
    } catch (err) {
      setError(err.message || "Failed to fetch overview data");
      console.error("Error fetching overview:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    overview,
    isLoading,
    error,
    refetch: fetchOverview,
  };
}
