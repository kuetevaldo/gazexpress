import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import OrderDashboard from "./components/OrderDashboard";
import OrderTracking from "./components/OrderTracking";

// IMAGE
import gasMan from "./images/Gas-man.jpg";

function App() {
  const [location, setLocation] = useState("");
  const [brand, setBrand] = useState("Bocom");
  const [size, setSize] = useState("12.5kg");
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

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

    try {
      await addDoc(collection(db, "orders"), {
        location,
        brand,
        size,
        quantity,
        phone,
        status: "pending",
        createdAt: new Date(),
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.page}>
      {/* ✅ NAVBAR */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🔥 GazExpress</h2>

        <div>
          <button
            style={styles.navBtn}
            onClick={() => {
              setShowTracking(false);
              setShowDashboard(false);
            }}
          >
            Home
          </button>

          <button
            style={styles.navBtn}
            onClick={() => {
              setShowTracking(true);
              setShowDashboard(false);
            }}
          >
            Track
          </button>

          <button
            style={styles.navBtn}
            onClick={() => {
              setShowDashboard(true);
              setShowTracking(false);
            }}
          >
            Admin
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          ...styles.container,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            ...styles.left,
            height: isMobile ? "40%" : "100%",
          }}
        >
          <img
            src={gasMan}
            alt="GazExpress"
            style={{
              ...styles.image,
              width: isMobile ? "60%" : "80%",
            }}
          />
        </div>

        {/* RIGHT */}
        <div
          style={{
            ...styles.right,
            height: isMobile ? "60%" : "100%",
            padding: isMobile ? "20px" : "40px",
          }}
        >
          {showTracking ? (
            <OrderTracking />
          ) : showDashboard ? (
            <OrderDashboard />
          ) : success ? (
            <div style={styles.successBox}>
              <h2>✅ Order Confirmed!</h2>
              <p>Your gas is on the way 🚚</p>

              <button
                style={styles.button}
                onClick={() => {
                  setSuccess(false);
                  setLocation("");
                  setBrand("Bocom");
                  setSize("12.5kg");
                  setQuantity(1);
                  setPhone("");
                }}
              >
                Order Again
              </button>
            </div>
          ) : (
            <>
              <h1 style={{ color: "#111" }}>🔥 GazExpress</h1>
<p style={{ color: "#555" }}>
  Fast gas delivery in Douala 🚚
</p>

              <div style={styles.formWrapper}>
  <form onSubmit={handleSubmit} style={styles.form}>
                <input
                  type="text"
                  placeholder="📍 Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  style={styles.input}
                />

                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  style={styles.input}
                >
                  <option>Bocom</option>
                  <option>TotalEnergies</option>
                  <option>Tradex</option>
                  <option>Ola Energy</option>
                </select>

                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  style={styles.input}
                >
                  <option>6kg</option>
                  <option>12.5kg</option>
                  <option>35kg</option>
                  <option>50kg</option>
                </select>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={styles.input}
                />

                <input
                  type="tel"
                  placeholder="📞 Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={styles.input}
                />

                <button type="submit" style={styles.button}>
                  Order Gas 🚚
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
    height: "100vh",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fff",
  },

  logo: {
    margin: 0,
  },

  navBtn: {
    marginLeft: "10px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ffffff",
  },

  left: {
    flex: 1,
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    objectFit: "contain",
  },

  right: {
  flex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  color: "#111", // ✅ ADD THIS (VERY IMPORTANT)
},

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
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

navbar: {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 30px",
  borderBottom: "1px solid #eee",
  backgroundColor: "#fff",
  color: "#111", // ✅ ADD THIS
},
logo: {
  margin: 0,
  color: "#111", // ✅ ADD THIS
},
navBtn: {
  marginLeft: "10px",
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  backgroundColor: "#fff",
  cursor: "pointer",
  color: "#111",
  fontWeight: "500",
  transition: "0.2s",
},
formWrapper: {
  width: "100%",
  maxWidth: "400px", // 🔥 limits form size
  margin: "0 auto",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#fff",  // 🔥 center it
},

};

export default App;