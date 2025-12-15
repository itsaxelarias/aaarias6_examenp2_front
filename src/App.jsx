import { useState } from "react";
import PurchaseOrderForm from "./components/PurchaseOrderForm";
import PurchaseOrderList from "./components/PurchaseOrderList";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__content">
          <div>
            <h1 className="title">Gestión de Órdenes de Compra</h1>
            <p className="subtitle">
              Crea y consulta órdenes registradas en tu API
            </p>
          </div>
          <div className="topbar__meta">
            <span className="pill">React + Vite</span>
            <span className="pill pill--soft">API: /api/v1</span>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="grid">
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Crear Orden</h2>
              <p className="card__hint">
                Completa los campos y guarda en la base
              </p>
            </div>
            <div className="card__body">
              <PurchaseOrderForm onCreated={() => setRefresh(!refresh)} />
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Órdenes registradas</h2>
              <p className="card__hint">
                Listado en tiempo real (recarga al crear)
              </p>
            </div>
            <div className="card__body">
              <PurchaseOrderList refresh={refresh} />

            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>arias_leccion2_front</span>
        <span className="footer__sep">·</span>
        <span>localhost:5173</span>
      </footer>
    </div>
  );
}

export default App;
