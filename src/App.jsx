import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import OrderDashboard from "./components/OrderDashboard";
import OrderTracking from "./components/OrderTracking";

import gasMan from "./images/Gas-man.webp";

function App() {
  const [location, setLocation] = useState("");
  const [brand, setBrand] = useState("Bocom");
  const [size, setSize] = useState("12.5kg");
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 💰 SIMPLE PRICE LOGIC
const priceList = {
  "6kg": 3000,
  "12.5kg": 6500,
  "35kg": 15000,
  "50kg": 22000,
};

const price = priceList[size] || 0;
const total = price * quantity;
const orderId = "GX-" + Date.now();

      try {
      await addDoc(collection(db, "orders"), {
        orderId, // 🆔 NEW
        location,
        brand,
        size,
        quantity,
        phone,
        price,
        total, // 💰 IMPORTANT
        status: "pending",
        createdAt: new Date(),
      });

      setSuccess(true);
    } catch (error) {
      alert("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
  <div style={styles.page}>
    {/* NAVBAR */}
    <div style={styles.navbar}>
      <h2 style={styles.logo}>🔥 GazExpress</h2>

      <div>
        <button style={styles.navBtn} onClick={() => {
          setShowTracking(false);
          setShowDashboard(false);
        }}>
          Home
        </button>

        <button style={styles.navBtn} onClick={() => {
          setShowTracking(true);
          setShowDashboard(false);
        }}>
          Track
        </button>

        <button style={styles.navBtn} onClick={() => {
          setShowDashboard(true);
          setShowTracking(false);
        }}>
          Admin
        </button>
      </div>
    </div>

    {/* MAIN */}
    <div style={styles.container}>
      <div style={styles.overlay}>

        {showTracking ? (
          <OrderTracking />
        ) : showDashboard ? (
          <OrderDashboard />
        ) : success ? (
          <div style={styles.successBox}>
            <h2>✅ Order Confirmed!</h2>
            <p>Your gas is on the way 🚚</p>

            <button style={styles.button} onClick={() => {
              setSuccess(false);
              setLocation("");
              setBrand("Bocom");
              setSize("12.5kg");
              setQuantity(1);
              setPhone("");
            }}>
              Order Again
            </button>
          </div>
        ) : (
          <>
            <h1 style={styles.title}>🔥 Fast Gas Delivery</h1>

            <p style={styles.subtitle}>
              Order your cooking gas in minutes 🚚
            </p>

            <p style={styles.trust}>
              ✔ Fast delivery • ✔ Trusted vendors • ✔ Available in Douala
            </p>

            <div style={styles.formWrapper}>
              <form onSubmit={handleSubmit} style={styles.form}>

                <label>📍 Location</label>
                <input
                  type="text"
                  placeholder="Bonamousadi..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  style={styles.input}
                />

                <label>🏢 Brand</label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} style={styles.input}>
                  <option>Bocom</option>
                  <option>TotalEnergies</option>
                  <option>Tradex</option>
                  <option>Ola Energy</option>
                </select>

                <label>🧯 Size</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} style={styles.input}>
                  <option>6kg</option>
                  <option>12.5kg</option>
                  <option>35kg</option>
                  <option>50kg</option>
                </select>

                <label>🔢 Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={styles.input}
                />

                <label>📞 Phone</label>
                <input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={styles.input}
                />

                <button type="submit" style={styles.button}>
                  {loading ? "Sending..." : "Order Gas 🚚"}
                </button>

              </form>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
  
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    backgroundColor: "#fff",
  },

  logo: {
    color: "#111",
  },

  navBtn: {
    marginLeft: "10px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor:"rgba(0,0,0,0.6)",
    cursor: "pointer",
    color:"#fff",
  },

  container: {
    flex: 1,
    backgroundImage: `url(${gasMan})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding:"20px",
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    padding: "30px",
    borderRadius: "15px",
    color: "white",
    width: "100%",
    maxWidth: "450px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#ddd",
  },

  trust: {
    fontSize: "13px",
    color: "#bbb",
    textAlign: "center",
    marginBottom: "15px",
  },

  formWrapper: {
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #ff6600, #ff9900)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  
  successBox: {
    textAlign: "center",
  },
};

export default App;