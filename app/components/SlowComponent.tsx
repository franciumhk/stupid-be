import "../globals.css";
import { useState, useEffect } from "react";

export default function SlowComponent() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // Simulate a slow API call
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      setData("Data loaded!");
    };

    fetchData();
  }, []);

  if (!data) return null; // Return null while loading

  return <div>{data}</div>;
}
