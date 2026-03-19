import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const unsubscribeOrders = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      }
    );

    const unsubscribeVendors = onSnapshot(
      collection(db, "vendors"),
      (snapshot) => {
        const vendorsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVendors(vendorsList);
      }
    );

    return () => {
      unsubscribeOrders();
      unsubscribeVendors();
    };
  }, []);

  const notifyCustomer = (order, newStatus) => {
    let message = "";

    if (newStatus === "delivering") {
      message = `🚚 Your gas is on the way!

📍 Location: ${order.location}
🔥 ${order.brand} ${order.size}

Driver is coming to you.`;
    }

    if (newStatus === "delivered") {
      message = `✅ Your gas has been delivered!

🔥 ${order.brand} ${order.size}

Thank you for using GazExpress 🙌`;
    }

    if (!message) return;

    const url = `https://wa.me/237${order.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const orderRef = doc(db, "orders", id);

      await updateDoc(orderRef, { status: newStatus });

      const updatedOrder = orders.find((o) => o.id === id);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );

      if (updatedOrder) {
        notifyCustomer(updatedOrder, newStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const assignVendor = async (orderId, vendorName) => {
    try {
      const orderRef = doc(db, "orders", orderId);

      await updateDoc(orderRef, {
        assignedVendor: vendorName,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, assignedVendor: vendorName }
            : order
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Orders Dashboard</h2>

      {orders.length === 0 ? (
        <p style={styles.empty}>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <p><strong>📍 {order.location}</strong></p>
            <p>🏢 {order.brand}</p>
            <p>🧯 {order.size}</p>
            <p>🔢 Qty: {order.quantity}</p>
            <p>📞 {order.phone}</p>

            {/* STATUS */}
            <p>
              📦 Status:{" "}
              <span style={getStatusStyle(order.status)}>
                {order.status}
              </span>
            </p>

            {/* 🔥 COLORED STATUS BUTTONS */}
            <div style={styles.actions}>
              <button
                style={styles.pendingBtn}
                onClick={() => updateStatus(order.id, "pending")}
              >
                Pending
              </button>

              <button
                style={styles.deliveringBtn}
                onClick={() => updateStatus(order.id, "delivering")}
              >
                Delivering
              </button>

              <button
                style={styles.deliveredBtn}
                onClick={() => updateStatus(order.id, "delivered")}
              >
                Delivered
              </button>
            </div>

            {/* VENDOR */}
            <p>
              🚚 Vendor:{" "}
              <strong>{order.assignedVendor || "Not assigned"}</strong>
            </p>

            <select
              style={styles.select}
              onChange={(e) =>
                assignVendor(order.id, e.target.value)
              }
            >
              <option>Select Vendor</option>

              {vendors
                .filter(
                  (v) =>
                    v.brand?.toLowerCase().trim() ===
                    order.brand?.toLowerCase().trim()
                )
                .map((vendor) => (
                  <option key={vendor.id} value={vendor.name}>
                    {vendor.name}
                  </option>
                ))}
            </select>
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
    maxWidth: "500px",
    margin: "20px auto",
    color: "#111",
  },

  title: {
    textAlign: "center",
    marginBottom: "15px",
    color: "#111",
  },

  empty: {
    textAlign: "center",
    color: "#777",
  },

  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  actions: {
    display: "flex",
    gap: "6px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  // 🔥 NEW BUTTON STYLES
  pendingBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  deliveringBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#f59e0b",
    color: "white",
    cursor: "pointer",
  },

  deliveredBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#10b981",
    color: "white",
    cursor: "pointer",
  },

  select: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

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

export default OrderDashboard;