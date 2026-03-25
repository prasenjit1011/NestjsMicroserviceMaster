import React, { useEffect, useState } from "react";
import axios from "axios";
import { FixedSizeList as List } from "react-window";

export default function App() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    let allData = [];

    // Faker API max 1000 per request
    for (let i = 0; i < 10; i++) {
      const res = await axios.get(
        `https://fakerapi.it/api/v1/companies?_quantity=1000&_seed=${i}`
      );
      allData = [...allData, ...res.data.data];
    }

    setCompanies(allData);
  };

  const Row = ({ index, style }) => {
    const company = companies[index];
    if (!company) return null;

    return (
      <div style={{
        ...style,
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid #ddd"
      }}>
        <span>{index + 1}</span>
        <span>{company.name}</span>
        <span>{company.country}</span>
        <span>{company.email}</span>
      </div>
    );
  };

  return (
    <div>
      <h2>Companies List (Virtualized 10,000 rows)</h2>

      <List
        height={500}
        itemCount={companies.length}
        itemSize={50}
        width={"100%"}
      >
        {Row}
      </List>
    </div>
  );
}