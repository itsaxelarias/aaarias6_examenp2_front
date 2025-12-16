import { useState } from "react";
import api from "../service/api";

const STATUSES = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "CANCELLED"];

export default function PurchaseOrderForm({ onCreated }) {
  const [form, setForm] = useState({
    orderNumber: "",
    supplierName: "",
    status: "DRAFT",
    totalAmount: "",
    currency: "USD",
    expectedDeliveryDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/v1/purchase-orders", {
        ...form,
        totalAmount: Number(form.totalAmount),
      });

      setForm({
        orderNumber: "",
        supplierName: "",
        status: "DRAFT",
        totalAmount: "",
        currency: "USD",
        expectedDeliveryDate: "",
      });

      onCreated?.();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error al crear la orden"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="alert alert--error">{error}</div>}

      <div className="form__grid">
        <div className="field">
          <label className="field__label">Order Number</label>
          <input
            className="field__control"
            name="orderNumber"
            value={form.orderNumber}
            onChange={handleChange}
            placeholder="PO-2025-000123"
            required
          />
        </div>

        <div className="field">
          <label className="field__label">Supplier</label>
          <input
            className="field__control"
            name="supplierName"
            value={form.supplierName}
            onChange={handleChange}
            placeholder="ACME Tools"
            required
          />
        </div>

        <div className="field">
          <label className="field__label">Status</label>
          <select
            className="field__control"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label">Total Amount</label>
          <input
            className="field__control"
            name="totalAmount"
            type="number"
            step="0.01"
            value={form.totalAmount}
            onChange={handleChange}
            placeholder="1500.75"
            required
          />
        </div>

        <div className="field">
          <label className="field__label">Currency</label>
          <select
            className="field__control"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="field">
          <label className="field__label">Expected Delivery Date</label>
          <input
            className="field__control"
            name="expectedDeliveryDate"
            type="date"
            value={form.expectedDeliveryDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form__actions">
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear Orden"}
        </button>

        <button
          className="btn btn--ghost"
          type="button"
          onClick={() =>
            setForm({
              orderNumber: "",
              supplierName: "",
              status: "DRAFT",
              totalAmount: "",
              currency: "USD",
              expectedDeliveryDate: "",
            })
          }
          disabled={loading}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
