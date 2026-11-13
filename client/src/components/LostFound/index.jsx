import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { fuzzyMatch } from "../../utils/matching";

import "./styles/variables.css";
import "./styles/LostFoundPage.css";
import "./styles/ClaimModal.css";

import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ItemGrid, { EmptyState } from "./ItemGrid";
import ItemForm from "./ItemForm";
import ItemDetail from "./ItemDetail";
import MatchSuggestions from "./MatchSuggestions";
import ClaimModal from "./ClaimModal";
import MyReports from "./MyReports";
import Notifications from "./Notifications";

// ---------------------------------------------------------------------------
// API helpers — all database operations go through the Express/MongoDB backend
// ---------------------------------------------------------------------------

const API = "/api";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// ---------------------------------------------------------------------------

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ status: "all", category: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimTarget, setClaimTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("browse");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, filters, searchQuery]);

  // Fetch all items from MongoDB via Express API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/items");
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      alert(`Failed to load items: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...items];
    if (filters.status !== "all")
      result = result.filter((i) => i.status === filters.status);
    if (filters.category !== "all")
      result = result.filter((i) => i.category === filters.category);
    if (searchQuery) {
      result = fuzzyMatch(searchQuery, result, ["name", "description", "location"]);
    }
    setFiltered(result);
  };

  // Create a new item in MongoDB
  const handleCreateItem = async (formData) => {
    try {
      const newItem = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        category: formData.category,
        imageUrl: null,
        reporterId: auth.currentUser.uid,
        reporterName: auth.currentUser.displayName || auth.currentUser.email,
        date: Date.now(),
      };

      const saved = await apiFetch("/items", {
        method: "POST",
        body: JSON.stringify(newItem),
      });

      setItems((prev) => [...prev, saved]);
      setShowForm(false);
      alert("Item reported successfully!");
    } catch (error) {
      console.error("Error creating item:", error);
      alert(`Failed to create item: ${error.message}`);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const getMatches = (item) => {
    const opposite = item.status === "lost" ? "found" : "lost";
    return items
      .filter((i) => i.status === opposite && i.id !== item.id)
      .map((i) => ({ ...i, score: fuzzyMatch(item.name, i.name) }))
      .filter((i) => i.score > 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  // Mark item as resolved + create a notification in MongoDB
  const handleClaimConfirm = async (item) => {
    try {
      // Update item status
      await apiFetch(`/items/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "resolved" }),
      });

      // Create notification for the reporter
      await apiFetch("/notifications", {
        method: "POST",
        body: JSON.stringify({
          reporterId: item.reporterId,
          itemId: item.id,
          itemName: item.name,
          claimedBy: auth.currentUser.email,
          message: `Your item "${item.name}" has been claimed!`,
          timestamp: Date.now(),
          read: false,
        }),
      });

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "resolved" } : i))
      );
      setClaimTarget(null);
      setSelectedItem(null);
      alert("Item claimed successfully! Reporter has been notified.");
    } catch (error) {
      console.error("Error claiming item:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Delete an item from MongoDB
  const handleDelete = async (id) => {
    try {
      await apiFetch(`/items/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Resolve an item in MongoDB
  const handleResolve = async (id) => {
    try {
      await apiFetch(`/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "resolved" }),
      });
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "resolved" } : i))
      );
    } catch (error) {
      console.error("Error resolving item:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const myItems = items.filter((i) => i.reporterId === auth.currentUser?.uid);

  return (
    <div className="lostfound-container">
      <Notifications />
      <div className="lostfound-header">
        <h1>Lost &amp; Found</h1>
        <div className="lostfound-tabs">
          <button
            onClick={() => setView("browse")}
            className={view === "browse" ? "active" : ""}
          >
            Browse
          </button>
          <button
            onClick={() => setView("myreports")}
            className={view === "myreports" ? "active" : ""}
          >
            My Reports
          </button>
        </div>
        <button className="report-btn" onClick={() => setShowForm(true)}>
          + Report Item
        </button>
      </div>

      {view === "browse" && (
        <>
          <div className="lostfound-controls">
            <SearchBar value={searchQuery} onSearch={setSearchQuery} />
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filtered.length ? (
            <ItemGrid items={filtered} onItemClick={handleItemClick} />
          ) : (
            <EmptyState message="No items found" />
          )}
        </>
      )}

      {view === "myreports" && (
        <MyReports
          items={myItems}
          onDelete={handleDelete}
          onResolve={handleResolve}
          onEdit={() => {}}
        />
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <ItemForm onSubmit={handleCreateItem} />
          </div>
        </div>
      )}

      {selectedItem && (
        <>
          <ItemDetail
            item={selectedItem}
            onClaim={setClaimTarget}
            onClose={() => setSelectedItem(null)}
          />
          <MatchSuggestions
            matches={getMatches(selectedItem)}
            onSelect={(m) => setSelectedItem(m)}
          />
        </>
      )}

      {claimTarget && (
        <ClaimModal
          item={claimTarget}
          onConfirm={handleClaimConfirm}
          onCancel={() => setClaimTarget(null)}
        />
      )}
    </div>
  );
}
