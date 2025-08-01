// utils/ReportGenerator.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const generateReport = async () => {
  const snapshot = await getDocs(collection(db, "orders"));
  let totalRevenue = 0;
  const productMap = new Map();

  snapshot.forEach((doc) => {
    const { items, total } = doc.data();
    totalRevenue += total;

    items.forEach((item) => {
      const { name, quantity } = item;
      if (productMap.has(name)) {
        productMap.set(name, productMap.get(name) + quantity);
      } else {
        productMap.set(name, quantity);
      }
    });
  });

  const topProduct = Array.from(productMap.entries()).sort((a, b) => b[1] - a[1])[0];

  return {
    totalRevenue,
    topProduct,
    sales: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  };
};
