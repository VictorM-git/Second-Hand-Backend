// Indicador numérico del panel de moderación.
export default function StatCard({ label, value }) {
  return (
    <div className="stat">
      <p className="stat__label">{label}</p>
      <p className="stat__value">{value}</p>
    </div>
  );
}
