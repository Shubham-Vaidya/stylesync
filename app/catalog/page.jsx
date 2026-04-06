'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

/* ───── CATALOG DATA ───── */

const CATALOG = [

  /* tshirts */

  {
    id: 1,
    name: "Street T-Shirt",
    brand: "StyleSync",
    price: "$40",
    category: "TOPS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/1_pwe5t0",
    filename: "tshirt1.png"
  },

  {
    id: 2,
    name: "Minimal Tee",
    brand: "StyleSync",
    price: "$45",
    category: "TOPS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/4_ffbavx",
    filename: "tshirt2.png"
  },

  {
    id: 3,
    name: "Graphic Tee",
    brand: "StyleSync",
    price: "$50",
    category: "TOPS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/4_jw7xu4",
    filename: "tshirt3.png"
  },

  {
    id: 4,
    name: "Casual Tee",
    brand: "StyleSync",
    price: "$38",
    category: "TOPS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/2_tz88gd",
    filename: "tshirt4.png"
  },

  /* hoodies */

  {
    id: 5,
    name: "Street Hoodie",
    brand: "StyleSync",
    price: "$95",
    category: "TOPS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/1_vd3xou",
    filename: "hoodie1.png"
  },

  {
    id: 6,
    name: "Minimal Hoodie",
    brand: "StyleSync",
    price: "$92",
    category: "TOPS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/4_hkjvds",
    filename: "hoodie2.png"
  },

  {
    id: 7,
    name: "Graphic Hoodie",
    brand: "StyleSync",
    price: "$100",
    category: "TOPS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/3_yqasap",
    filename: "hoodie3.png"
  },

  {
    id: 8,
    name: "Oversized Hoodie",
    brand: "StyleSync",
    price: "$105",
    category: "TOPS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/2_eajaqs",
    filename: "hoodie4.png"
  },

  /* pants */

  {
    id: 9,
    name: "Cargo Pants",
    brand: "StyleSync",
    price: "$80",
    category: "BOTTOMS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/1_ztccpj",
    filename: "pants1.png"
  },

  {
    id: 10,
    name: "Street Pants",
    brand: "StyleSync",
    price: "$78",
    category: "BOTTOMS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/2_lpngqy",
    filename: "pants2.png"
  },

  {
    id: 11,
    name: "Relaxed Pants",
    brand: "StyleSync",
    price: "$85",
    category: "BOTTOMS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/4_nfwmwt",
    filename: "pants3.png"
  },

  {
    id: 12,
    name: "Minimal Pants",
    brand: "StyleSync",
    price: "$82",
    category: "BOTTOMS",
    image: "https://res.cloudinary.com/deec2rsc7/image/upload/3_ozvj71",
    filename: "pants4.png"
  }

]

/* ───── PRODUCT CARD ───── */

function ProductCard({ item }) {

  const router = useRouter()

  return (

    <div
      style={{
        border: "1px solid #333",
        borderRadius: "6px",
        overflow: "hidden",
        background: "#111"
      }}
    >

      <div style={{ aspectRatio: "3/4", overflow: "hidden" }}>

        <img
          src={item.image}
          alt={item.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

      </div>

      <div style={{ padding: "12px" }}>

        <p style={{ color: "#888", fontSize: "12px" }}>{item.brand}</p>

        <p style={{ color: "#fff", fontSize: "14px" }}>{item.name}</p>

        <p style={{ color: "#C8A96E", fontSize: "12px" }}>{item.price}</p>

        <button
          onClick={() => router.push(`/tryon?garment=${item.filename}`)}
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "8px",
            background: "#C8A96E",
            border: "none",
            cursor: "pointer"
          }}
        >

          TRY ON

        </button>

      </div>

    </div>

  )

}

/* ───── PAGE COMPONENT ───── */

export default function CatalogPage() {

  const [query, setQuery] = useState("")

  const filtered = CATALOG.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  return (

    <div style={{ background: "#080808", minHeight: "100vh", padding: "40px" }}>

      <h1 style={{ color: "#fff", marginBottom: "20px" }}>

        Catalog

      </h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clothes..."
        style={{
          padding: "10px",
          marginBottom: "30px",
          background: "#111",
          border: "1px solid #333",
          color: "#fff"
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: "20px"
        }}
      >

        {filtered.map(item => (
          <ProductCard key={item.id} item={item} />
        ))}

      </div>

    </div>

  )

}