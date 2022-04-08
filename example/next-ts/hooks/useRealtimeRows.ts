import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const useRealtimeRows = (table, column, value) => {
  const [rows, setRows] = useState([]);

  const handleInsert = (payload) => {
    console.log(payload);
    setRows((prev) => [...prev, payload.new]);
  }

  const handleDelete = (payload) => {
    console.log(payload);
    setRows((prev) => prev.filter((i) => i.id !== payload?.old?.id));
  }

  const handleUpdate = (payload) => {
    console.log(payload);
    setRows((prev) => [...prev.filter((i) => i.id !== payload?.old?.id), payload.new]);
  }

  useEffect(() => {
    supabase.from(`${table}`)
      .select("*")
      .gte(column, value) // Update to match operator below
      .then(({ data }) => setRows(data ?? []));
  }, [])

  useEffect(() => {
    const subscription = supabase
      .from(`${table}:${column}=gte.${value}`) // Only eq works
      .on('INSERT', handleInsert)
      .on('DELETE', handleDelete)
      .on('UPDATE', handleUpdate)
      .subscribe();

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return [rows];
}