import { useRealtimeRows } from '../hooks/useRealtimeRows';

const Realtime = () => {
  const [rows] = useRealtimeRows('test', 'id', 3);

  return rows.map(row => (<pre key={row.id}>{JSON.stringify(row, null, 2)}</pre>));
}

export default Realtime;