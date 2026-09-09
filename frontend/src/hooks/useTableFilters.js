import { useSearchParams } from "react-router-dom";

export const useTableFilters = (keys = []) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const filters = Object.fromEntries(
    keys.map((k) => [k, searchParams.get(k) || ""])
  );

  const setFilter = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (value) params.set(key, value);
      else params.delete(key);

      params.set("page", "1");
      return params;
    });
  };

  const setSearch = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value) params.set("search", value);
    else params.delete("search");

    params.set("page", "1");
    setSearchParams(params);
  };

  const setPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p.toString());
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({ page: "1" });
  };

  return {
    page,
    search,
    filters,
    setFilter,
    setSearch,
    setPage,
    clearFilters,
  };
};
