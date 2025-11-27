export default function Skeleton({ rows = 3 }) {
  return (
    <div className="animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 my-2 rounded"></div>
      ))}
    </div>
  );
}