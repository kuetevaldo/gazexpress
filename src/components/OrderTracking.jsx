import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

function OrderTracking() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);

  const handleTrack = () => {
    const q = query(
      collection(db, "orders"),
      where("phone", "==", phone)
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

      <input
        type="text"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleTrack} style={styles.button}>
        Track Order
      </button>

      {orders.length === 0 ? (
        <p style={styles.empty}>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <p><strong>📍 {order.location}</strong></p>
            <p>🔥 {order.brand} - {order.size}</p>

            <p>
              📦 Status:{" "}
              <span style={getStatusStyle(order.status)}>
                {order.status}
              </span>
            </p>

            <p>🚚 Vendor: {order.assignedVendor || "Not assigned"}</p>
          </div>
        ))
      )}
    </div>
  );
}

// 🔥 STATUS COLORS
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
    maxWidth: "400px",
    margin: "20px auto",
    textAlign: "center",
    color: "#111",
  },

  title: {
    color: "#111",
    marginBottom: "10px",
  },

  input: {
    padding: "12px",
    width: "100%",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  button: {
    padding: "12px",
    width: "100%",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #ff6600, #ff9900)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },

  empty: {
    marginTop: "15px",
    color: "#777",
  },

  card: {
    border: "1px solid #ddd",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "10px",
    textAlign: "left",
    backgroundColor: "#ffffff",
    color: "#111",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  // 🔥 STATUS COLORS
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