import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

function OrderTracking() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState("");

  const handleTrack = () => {
    setSearched(true);

    const q = query(
      collection(db, "orders"),
      where("orderId", "==", search)
    );

    onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(results);
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📍 Track Your Order</h2>

      {/* INPUT SECTION */}
      <div style={styles.searchBox}>
        <input
  type="text"
  placeholder="Enter your Order ID (GX-...)"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

        <button onClick={handleTrack} style={styles.button}>
          🔍 Track Order
        </button>
      </div>

      {/* RESULTS */}
      {!searched ? (
        <p style={styles.info}>Enter your order ID to track your order</p>
      ) : orders.length === 0 ? (
        <p style={styles.empty}>❌ No orders found</p>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order.id} style={styles.card}>

              {/* HEADER */}
              <div style={styles.header}>
                <strong>📍 {order.location}</strong>
                <span style={getStatusStyle(order.status)}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>

              <hr />

              {/* DETAILS */}
              <p>🔥 {order.brand} - {order.size}</p>

              <p>
                🚚 Vendor:{" "}
                <strong>
                  {order.assignedVendor || "Not assigned"}
                </strong>
              </p>

              {/* DELIVERY INFO */}
              <p style={styles.delivery}>
                ⏱ Estimated delivery: 30–60 mins
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// STATUS ICONS
const getStatusIcon = (status) => {
  if (status === "pending") return "⏳";
  if (status === "delivering") return "🚚";
  if (status === "delivered") return "✅";
};

// STATUS COLORS
const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return styles.pending;
    case "delivering":
      return styles.delivering;
    case "delivered":
      return styles.delivered;
    default:
      return {};
  }
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    color: "#111",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #ff6600, #ff9900)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },

  info: {
    textAlign: "center",
    color: "#fff",
  },

  empty: {
    textAlign: "center",
    color: "#777",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  delivery: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#555",
  },

  // STATUS COLORS
  pending: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
  },

  delivering: {
    backgroundColor: "#f59e0b",
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
  },

  delivered: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
  },
};

export default OrderTracking;