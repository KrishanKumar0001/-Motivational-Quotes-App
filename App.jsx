import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [bg, setBg] = useState(
    "linear-gradient(135deg, #1a1a1a, #333333)"
  );
  const [quote, setQuote] = useState({
    text: "Loading inspiration…",
    author: "",
  });
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const localFallback = useMemo(
    () => [
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
      { text: "Push yourself, because no one else is going to do it for you.", author: "" },
      { text: "Great things never come from comfort zones.", author: "" },
    ],
    []
  );

  async function fetchQuotes() {
    try {
      const res = await fetch("https://type.fit/api/quotes");
      const data = await res.json();
      setQuotes(data.map((q) => ({ text: q.text, author: q.author || "" })));
      setLoading(false);
    } catch {
      setQuotes(localFallback);
      setLoading(false);
      setError("");
    }
  }

  useEffect(() => {
    fetchQuotes();
  }, []);

  function randomGradient() {
    const c1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const c2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return `linear-gradient(135deg, ${c1}, ${c2})`;
  }

  function nextQuote() {
    const pool = quotes.length ? quotes : localFallback;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function handleClick() {
    setBg(randomGradient());
    setQuote(nextQuote());
  }

  return (
    <motion.div
      onClick={handleClick}
      style={{
        background: bg,
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        cursor: "pointer",
        padding: "20px",
      }}
      animate={{ background: bg }}
      transition={{ duration: 1.5 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={quote.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          style={{ color: "#fff", maxWidth: 800 }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{quote.text}</h1>
          {quote.author && <p style={{ marginTop: "10px", fontSize: "1.2rem" }}>— {quote.author}</p>}
          {loading && <p>Loading quotes...</p>}
          {error && <p>{error}</p>}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
