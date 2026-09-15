import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  fetchData,
  uploadData,
  type AppData,
} from "../api/api";

const emptyData: AppData = {
  players: [],
  fines: [],
  foodDuties: [],
};

export function useData() {
  const [data, setData] =
    useState<AppData>(emptyData);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchData();

      setData(result);
    } catch (error) {
      console.error(error);

      setError(
        "Impossibile caricare i dati",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (newData: AppData) => {
      try {
        setSaving(true);
        setError(null);

        await uploadData(newData);

        setData(newData);
      } catch (error) {
        console.error(error);

        setError(
          "Impossibile salvare i dati",
        );

        throw error;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return {
    data,
    loading,
    saving,
    error,
    load,
    save,
  };
}