import { useState } from "react";
import "./styles/ItemForm.css";

export default function ItemForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    status: "lost",
    category: "electronics",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      name: "",
      description: "",
      location: "",
      status: "lost",
      category: "electronics",
    });
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Item name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        required
      />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="electronics">Electronics</option>
        <option value="documents">Documents</option>
        <option value="accessories">Accessories</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
