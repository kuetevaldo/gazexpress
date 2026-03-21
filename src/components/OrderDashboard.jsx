import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // 🔥 USE REF (IMPORTANT FIX)
  const knownIdsRef = useRef(new Set());

  // 🔓 UNLOCK AUDIO
  useEffect(() => {
    const unlock = () => {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
      document.removeEventListener("click", unlock);
    };

    document.addEventListener("click", unlock);
  }, []);

  // 🔥 REALTIME LISTENER (FINAL FIX)
  useEffect(() => {
    const unsubscribeOrders = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const currentIds = new Set(ordersList.map(o => o.id));

        const previousIds = knownIdsRef.current;

        // ✅ DETECT NEW ORDER
        const newOrders = ordersList.filter(o => !previousIds.has(o.id));

        if (previousIds.size > 0 && newOrders.length > 0) {
          console.log("🔥 NEW ORDER DETECTED");

          // 🔔 SOUND
          const audio = new Audio("/notification.mp3");
          audio.volume = 0.7;
          audio.play().catch(() => {});

          // 🔥 TOAST
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }

        // ✅ UPDATE REF (NO RE-RENDER)
        knownIdsRef.current = currentIds;

        // ✅ UPDATE UI
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

  // 💰 REVENUE
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );

  // ✅ UPDATE STATUS
  const updateStatus = async (id, newStatus) => {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status: newStatus });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // ✅ ASSIGN VENDOR
  const assignVendor = async (orderId, vendorName) => {
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Orders Dashboard</h2>

      {/* 🔥 TOAST */}
      {showToast && (
        <div style={{ ...styles.toast, animation: "slideIn 0.4s ease" }}>
          🚨 New Order Received!
        </div>
      )}

      {/* 📊 STATS */}
      <div style={styles.stats}>
        <div style={styles.statBox}>
          <h3>{orders.length}</h3>
          <p>Orders</p>
        </div>

        <div style={styles.statBox}>
          <h3>{orders.filter(o => o.status === "pending").length}</h3>
          <p>Pending</p>
        </div>

        <div style={styles.statBox}>
          <h3>{totalRevenue} FCFA</h3>
          <p>Revenue</p>
        </div>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              ...styles.card,
              transform: hovered === order.id ? "scale(1.03)" : "scale(1)",
            }}
            onMouseEnter={() => setHovered(order.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <p>🆔 {order.orderId}</p>
            <p><strong>📍 {order.location}</strong></p>
            <p>🏢 {order.brand}</p>
            <p>🧯 {order.size}</p>
            <p>🔢 Qty: {order.quantity}</p>
            <p>📞 {order.phone}</p>
            <p>💰 {order.total || 0} FCFA</p>

            <p>
              📦 Status:{" "}
              <span style={getStatusStyle(order.status)}>
                {order.status}
              </span>
            </p>

            <div style={styles.actions}>
              <button style={styles.pendingBtn} onClick={() => updateStatus(order.id, "pending")}>
                Pending
              </button>

              <button style={styles.deliveringBtn} onClick={() => updateStatus(order.id, "delivering")}>
                Delivering
              </button>

              <button style={styles.deliveredBtn} onClick={() => updateStatus(order.id, "delivered")}>
                Delivered
              </button>
            </div>

            <select
              style={styles.select}
              onChange={(e) => assignVendor(order.id, e.target.value)}
            >
              <option>Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.name}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 STATUS COLORS
const getStatusStyle = (status) => {
  switch (status) {
    case "pending": return styles.pending;
    case "delivering": return styles.delivering;
    case "delivered": return styles.delivered;
    default: return {};
  }
};

const styles = {
  container: { padding: "20px", color: "#fff" },
  title: { textAlign: "center", marginBottom: "20px" },

  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#10b981",
    color: "white",
    padding: "14px",
    borderRadius: "10px",
    zIndex: 9999,
  },

  stats: { display: "flex", gap: "15px", marginBottom: "20px" },

  statBox: {
    flex: 1,
    background: "#fff",
    color: "#111",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    color: "#111",
    padding: "15px",
    borderRadius: "12px",
  },

  actions: { display: "flex", gap: "6px", marginTop: "10px" },

  pendingBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px", borderRadius: "6px" },
  deliveringBtn: { background: "#f59e0b", color: "#fff", border: "none", padding: "6px", borderRadius: "6px" },
  deliveredBtn: { background: "#10b981", color: "#fff", border: "none", padding: "6px", borderRadius: "6px" },

  select: { marginTop: "10px", padding: "8px", width: "100%" },

  pending: { background: "#ef4444", color: "#fff", padding: "4px", borderRadius: "6px" },
  delivering: { background: "#f59e0b", color: "#fff", padding: "4px", borderRadius: "6px" },
  delivered: { background: "#10b981", color: "#fff", padding: "4px", borderRadius: "6px" },
};

export default OrderDashboard;