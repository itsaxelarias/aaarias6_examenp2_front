import { useEffect, useMemo, useState } from "react";
import api from "../service/api";

function statusClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "APPROVED") return "badge badge--approved";
  if (s === "REJECTED") return "badge badge--rejected";
  if (s === "CANCELLED") return "badge badge--cancelled";
  if (s === "SUBMITTED") return "badge badge--submitted";
  return "badge badge--draft";
}

export default function PurchaseOrderList({ refresh }) {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
  const load = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await api.get("/v1/purchase-orders");

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError("Error consultando la API");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [refresh]); // ← CLAVE


  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((o) => {
      const haystack = [
        o.id,
        o.orderNumber,
        o.supplierName,
        o.status,
        o.currency,
        o.expectedDeliveryDate,
        o.createdAt,
        o.totalAmount,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [orders, q]);

  if (loading) return <p className="muted">Cargando...</p>;
  if (error) return <div className="alert alert--error">Error: {error}</div>;

  return (
    <div className="list">
      <div className="list__toolbar">
        <div className="search">
          <input
            className="search__input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por supplier, status, orderNumber..."
          />
        </div>
        <div className="list__count">
          {filtered.length} registro(s)
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No hay órdenes para mostrar.</p>
      ) : (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>OrderNumber</th>
                <th>Supplier</th>
                <th>Status</th>
                <th className="t-right">Total</th>
                <th>Currency</th>
                <th>Expected Delivery</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="mono">{o.id}</td>
                  <td className="mono">{o.orderNumber}</td>
                  <td>{o.supplierName}</td>
                  <td>
                    <span className={statusClass(o.status)}>{o.status}</span>
                  </td>
                  <td className="t-right mono">{o.totalAmount}</td>
                  <td className="mono">{o.currency}</td>
                  <td className="mono">{o.expectedDeliveryDate}</td>
                  <td className="mono">{o.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
