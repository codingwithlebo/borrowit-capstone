import { useState, useMemo } from "react";
import type {
  AppRoute,
  FilterState,
  Item,
  BookingDraft,
  BookingConfirmation,
} from "./data/types.ts";
import { MOCK_ITEMS } from "./data/items.ts";

/* ── helpers ───────────────────────────────────── */
function generateCode(): string {
  return "BRW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function formatPrice(item: Item): string {
  if (item.pricing === "free") return "Free";
  return `R${item.pricePerDay}/day`;
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    tools: "Tools", garden: "Garden", kitchen: "Kitchen",
    electronics: "Electronics", sport: "Sport", other: "Other", all: "All",
  };
  return map[cat] ?? cat;
}

/* ── styles (single style block) ──────────────── */
const G = {
  bg: "#0d1117",
  surface: "#161b22",
  surface2: "#1c2128",
  border: "#30363d",
  accent: "#f0883e",
  accentDim: "rgba(240,136,62,0.12)",
  text: "#e6edf3",
  muted: "#8b949e",
  green: "#3fb950",
  error: "#f85149",
  radius: "10px",
  radiusLg: "16px",
};

const css = (obj: Record<string, string | number>) =>
  obj as React.CSSProperties;

/* ── shared components ─────────────────────────── */
function Badge({ label, variant = "default" }: { label: string; variant?: "default" | "free" | "paid" | "category" }) {
  const colors: Record<string, React.CSSProperties> = {
    default: { background: G.surface2, color: G.muted, border: `1px solid ${G.border}` },
    free: { background: "rgba(63,185,80,0.15)", color: G.green, border: `1px solid rgba(63,185,80,0.3)` },
    paid: { background: G.accentDim, color: G.accent, border: `1px solid rgba(240,136,62,0.3)` },
    category: { background: G.surface2, color: G.text, border: `1px solid ${G.border}` },
  };
  return (
    <span style={css({ ...colors[variant], padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, display: "inline-block" })}>
      {label}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={css({ color: G.accent, fontSize: "13px", fontWeight: 600 })}>
      ★ {rating.toFixed(1)}
    </span>
  );
}

function Button({
  children, onClick, variant = "primary", disabled = false, type = "button", fullWidth = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  disabled?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: G.accent, color: "#0d1117", border: "none", fontWeight: 700 },
    ghost: { background: "transparent", color: G.text, border: `1px solid ${G.border}` },
    outline: { background: "transparent", color: G.accent, border: `1px solid ${G.accent}` },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={css({
        ...styles[variant],
        padding: "10px 20px",
        borderRadius: G.radius,
        fontSize: "14px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.15s",
        width: fullWidth ? "100%" : "auto",
      })}
    >
      {children}
    </button>
  );
}

/* ── BROWSE PAGE ────────────────────────────────── */
function BrowsePage({
  onNavigate,
}: {
  onNavigate: (route: AppRoute) => void;
}) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    pricing: "all",
  });

  const filtered = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(filters.search.toLowerCase()));
      const matchCategory =
        filters.category === "all" || item.category === filters.category;
      const matchPricing =
        filters.pricing === "all" || item.pricing === filters.pricing;
      return matchSearch && matchCategory && matchPricing;
    });
  }, [filters]);

  const categories: Array<FilterState["category"]> = [
    "all", "tools", "garden", "kitchen", "electronics", "sport", "other",
  ];

  return (
    <div style={css({ minHeight: "100vh", background: G.bg, color: G.text, fontFamily: "'Inter', system-ui, sans-serif" })}>
      {/* Header */}
      <header style={css({ background: G.surface, borderBottom: `1px solid ${G.border}`, padding: "0 24px" })}>
        <div style={css({ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" })}>
          <div style={css({ display: "flex", alignItems: "center", gap: "10px" })}>
            <span style={css({ fontSize: "22px" })}>🔧</span>
            <span style={css({ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" })}>
              Borrow<span style={css({ color: G.accent })}>it</span>
            </span>
          </div>
          <div style={css({ display: "flex", alignItems: "center", gap: "8px", color: G.muted, fontSize: "13px" })}>
            <span>📍 Joburg West</span>
            <Button variant="ghost" onClick={() => onNavigate({ page: "auth" })}>Sign in</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={css({ background: `linear-gradient(135deg, ${G.surface} 0%, ${G.bg} 100%)`, borderBottom: `1px solid ${G.border}`, padding: "48px 24px 40px" })}>
        <div style={css({ maxWidth: "1100px", margin: "0 auto" })}>
          <p style={css({ color: G.accent, fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" })}>
            Your neighbourhood toolkit
          </p>
          <h1 style={css({ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 12px", lineHeight: 1.1 })}>
            Borrow what you need.<br />
            <span style={css({ color: G.accent })}>From people nearby.</span>
          </h1>
          <p style={css({ color: G.muted, fontSize: "16px", margin: "0 0 32px", maxWidth: "500px" })}>
            Need a drill for one afternoon? A mixer for the weekend? Find tools and gear from neighbours in your area.
          </p>
          {/* Search */}
          <div style={css({ display: "flex", gap: "10px", maxWidth: "560px", flexWrap: "wrap" })}>
            <input
              type="search"
              placeholder="Search for a drill, tent, mixer…"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              style={css({
                flex: 1, minWidth: "200px", background: G.surface2, border: `1px solid ${G.border}`,
                borderRadius: G.radius, padding: "12px 16px", color: G.text, fontSize: "14px",
                outline: "none",
              })}
              aria-label="Search items"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={css({ borderBottom: `1px solid ${G.border}`, padding: "14px 24px", background: G.surface })}>
        <div style={css({ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" })}>
          <span style={css({ color: G.muted, fontSize: "12px", fontWeight: 600, marginRight: "4px" })}>CATEGORY</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters((f) => ({ ...f, category: cat }))}
              style={css({
                padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", border: "1px solid",
                background: filters.category === cat ? G.accent : "transparent",
                color: filters.category === cat ? "#0d1117" : G.muted,
                borderColor: filters.category === cat ? G.accent : G.border,
                transition: "all 0.15s",
              })}
            >
              {categoryLabel(cat)}
            </button>
          ))}
          <span style={css({ color: G.border, margin: "0 4px" })}>|</span>
          <span style={css({ color: G.muted, fontSize: "12px", fontWeight: 600 })}>PRICE</span>
          {(["all", "free", "paid"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilters((f) => ({ ...f, pricing: p }))}
              style={css({
                padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", border: "1px solid",
                background: filters.pricing === p ? G.accent : "transparent",
                color: filters.pricing === p ? "#0d1117" : G.muted,
                borderColor: filters.pricing === p ? G.accent : G.border,
                transition: "all 0.15s",
              })}
            >
              {p === "all" ? "All prices" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main style={css({ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" })}>
        <p style={css({ color: G.muted, fontSize: "13px", marginBottom: "20px" })}>
          {filtered.length} {filtered.length === 1 ? "item" : "items"} available near you
        </p>
        {filtered.length === 0 ? (
          <div style={css({ textAlign: "center", padding: "80px 24px", color: G.muted })}>
            <div style={css({ fontSize: "40px", marginBottom: "12px" })}>🔍</div>
            <p style={css({ fontSize: "16px" })}>No items match your search. Try different filters.</p>
          </div>
        ) : (
          <div style={css({ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" })}>
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => onNavigate({ page: "detail", itemId: item.id })} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ItemCard({ item, onClick }: { item: Item; onClick: () => void }) {
  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      style={css({
        background: G.surface, border: `1px solid ${G.border}`, borderRadius: G.radiusLg,
        overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s",
      })}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = G.accent; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = G.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      <img
        src={item.images[0]}
        alt={item.title}
        style={css({ width: "100%", height: "180px", objectFit: "cover", display: "block" })}
        loading="lazy"
      />
      <div style={css({ padding: "16px" })}>
        <div style={css({ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" })}>
          <h2 style={css({ fontSize: "15px", fontWeight: 700, margin: 0, flex: 1, marginRight: "8px" })}>{item.title}</h2>
          <Badge label={formatPrice(item)} variant={item.pricing === "free" ? "free" : "paid"} />
        </div>
        <p style={css({ color: G.muted, fontSize: "13px", margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" })}>
          {item.description}
        </p>
        <div style={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
          <div style={css({ display: "flex", alignItems: "center", gap: "8px" })}>
            <img src={item.owner.avatar} alt={item.owner.name} style={css({ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" })} />
            <span style={css({ fontSize: "12px", color: G.muted })}>{item.owner.name}</span>
          </div>
          <div style={css({ display: "flex", alignItems: "center", gap: "8px" })}>
            <StarRating rating={item.owner.rating} />
            <span style={css({ fontSize: "12px", color: G.muted })}>📍 {item.distanceKm}km</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── DETAIL PAGE ────────────────────────────────── */
function DetailPage({ itemId, onNavigate }: { itemId: string; onNavigate: (r: AppRoute) => void }) {
  const item = MOCK_ITEMS.find((i) => i.id === itemId);

  if (!item) {
    return (
      <div style={css({ minHeight: "100vh", background: G.bg, color: G.text, display: "flex", alignItems: "center", justifyContent: "center" })}>
        <div style={css({ textAlign: "center" })}>
          <p style={css({ fontSize: "18px", marginBottom: "16px" })}>Item not found.</p>
          <Button onClick={() => onNavigate({ page: "browse" })}>Back to browse</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={css({ minHeight: "100vh", background: G.bg, color: G.text, fontFamily: "'Inter', system-ui, sans-serif" })}>
      <header style={css({ background: G.surface, borderBottom: `1px solid ${G.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px" })}>
        <button
          onClick={() => onNavigate({ page: "browse" })}
          style={css({ background: "none", border: "none", color: G.accent, cursor: "pointer", fontSize: "14px", fontWeight: 600, padding: "4px 0" })}
          aria-label="Back to browse"
        >
          ← Back
        </button>
        <span style={css({ fontWeight: 800, fontSize: "16px" })}>Borrow<span style={css({ color: G.accent })}>it</span></span>
      </header>

      <div style={css({ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" })}>
        <div style={css({ display: "grid", gridTemplateColumns: "1fr min(340px, 100%)", gap: "32px", alignItems: "start" })}>
          {/* Left */}
          <div>
            <img
              src={item.images[0]}
              alt={item.title}
              style={css({ width: "100%", borderRadius: G.radiusLg, objectFit: "cover", maxHeight: "400px", display: "block" })}
            />
            <div style={css({ marginTop: "24px" })}>
              <div style={css({ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" })}>
                <Badge label={categoryLabel(item.category)} variant="category" />
                {item.tags.map((t) => <Badge key={t} label={t} />)}
              </div>
              <h1 style={css({ fontSize: "26px", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.5px" })}>{item.title}</h1>
              <p style={css({ color: G.muted, fontSize: "15px", lineHeight: 1.7, margin: "0 0 24px" })}>{item.description}</p>

              {/* Owner */}
              <div style={css({ background: G.surface, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "16px", display: "flex", alignItems: "center", gap: "12px" })}>
                <img src={item.owner.avatar} alt={item.owner.name} style={css({ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" })} />
                <div>
                  <p style={css({ fontWeight: 700, margin: 0, fontSize: "14px" })}>{item.owner.name}</p>
                  <p style={css({ color: G.muted, margin: 0, fontSize: "12px" })}>📍 {item.owner.neighbourhood} · <StarRating rating={item.owner.rating} /> ({item.owner.reviewCount} reviews)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — booking card */}
          <div style={css({ background: G.surface, border: `1px solid ${G.border}`, borderRadius: G.radiusLg, padding: "24px", position: "sticky", top: "24px" })}>
            <div style={css({ marginBottom: "20px" })}>
              {item.pricing === "free" ? (
                <p style={css({ fontSize: "28px", fontWeight: 800, color: G.green, margin: 0 })}>Free</p>
              ) : (
                <p style={css({ fontSize: "28px", fontWeight: 800, margin: 0 })}>
                  R{item.pricePerDay}<span style={css({ fontSize: "14px", color: G.muted, fontWeight: 400 })}>/day</span>
                </p>
              )}
              <p style={css({ color: G.muted, fontSize: "13px", margin: "4px 0 0" })}>📍 {item.distanceKm}km from you</p>
            </div>
            <Button fullWidth onClick={() => onNavigate({ page: "book", itemId: item.id, step: 1 })}>
              Book now
            </Button>
            <p style={css({ color: G.muted, fontSize: "12px", textAlign: "center", margin: "12px 0 0" })}>
              Free to request · Owner confirms within 24h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── BOOKING FLOW ───────────────────────────────── */
function BookingPage({
  itemId, step, onNavigate,
}: {
  itemId: string;
  step: 1 | 2;
  onNavigate: (r: AppRoute) => void;
}) {
  const item = MOCK_ITEMS.find((i) => i.id === itemId);
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [draft, setDraft] = useState<Omit<BookingDraft, "itemId" | "totalDays" | "totalCost">>({
    startDate: today,
    endDate: tomorrow,
    contactName: "",
    contactEmail: "",
  });

  if (!item) return null;

  const days = Math.max(1, Math.ceil((new Date(draft.endDate).getTime() - new Date(draft.startDate).getTime()) / 86400000));
  const cost = item.pricing === "free" ? 0 : (item.pricePerDay ?? 0) * days;

  function handleConfirm() {
    const confirmation: BookingConfirmation = {
      itemId: item!.id,
      ...draft,
      totalDays: days,
      totalCost: cost,
      confirmationCode: generateCode(),
      confirmedAt: new Date().toISOString(),
    };
    onNavigate({ page: "confirmed", code: confirmation.confirmationCode });
  }

  const stepLabel = step === 1 ? "Pick dates" : "Your details";

  return (
    <div style={css({ minHeight: "100vh", background: G.bg, color: G.text, fontFamily: "'Inter', system-ui, sans-serif" })}>
      <header style={css({ background: G.surface, borderBottom: `1px solid ${G.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px" })}>
        <button
          onClick={() => step === 1 ? onNavigate({ page: "detail", itemId }) : onNavigate({ page: "book", itemId, step: 1 })}
          style={css({ background: "none", border: "none", color: G.accent, cursor: "pointer", fontSize: "14px", fontWeight: 600 })}
        >
          ← Back
        </button>
        <span style={css({ fontWeight: 800, fontSize: "16px" })}>Borrow<span style={css({ color: G.accent })}>it</span></span>
      </header>

      <div style={css({ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" })}>
        {/* Steps indicator */}
        <div style={css({ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" })}>
          {([1, 2] as const).map((s) => (
            <div key={s} style={css({ display: "flex", alignItems: "center", gap: "8px" })}>
              <div style={css({
                width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700,
                background: s <= step ? G.accent : G.surface2,
                color: s <= step ? "#0d1117" : G.muted,
                border: `1px solid ${s <= step ? G.accent : G.border}`,
              })}>
                {s < step ? "✓" : s}
              </div>
              {s === 1 && <div style={css({ height: "1px", width: "40px", background: step > 1 ? G.accent : G.border })} />}
            </div>
          ))}
          <span style={css({ color: G.muted, fontSize: "13px", marginLeft: "8px" })}>{stepLabel}</span>
        </div>

        <div style={css({ background: G.surface, border: `1px solid ${G.border}`, borderRadius: G.radiusLg, padding: "24px", marginBottom: "20px" })}>
          <div style={css({ display: "flex", gap: "12px", alignItems: "center", paddingBottom: "16px", marginBottom: "16px", borderBottom: `1px solid ${G.border}` })}>
            <img src={item.images[0]} alt={item.title} style={css({ width: "56px", height: "56px", borderRadius: G.radius, objectFit: "cover" })} />
            <div>
              <p style={css({ fontWeight: 700, margin: 0, fontSize: "14px" })}>{item.title}</p>
              <p style={css({ color: G.muted, margin: 0, fontSize: "12px" })}>{item.owner.name} · {item.owner.neighbourhood}</p>
            </div>
          </div>

          {step === 1 && (
            <div style={css({ display: "flex", flexDirection: "column", gap: "16px" })}>
              <div>
                <label style={css({ display: "block", fontSize: "13px", fontWeight: 600, color: G.muted, marginBottom: "6px" })}>Pick-up date</label>
                <input
                  type="date"
                  value={draft.startDate}
                  min={today}
                  onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
                  style={css({ width: "100%", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "10px 12px", color: G.text, fontSize: "14px", outline: "none" })}
                />
              </div>
              <div>
                <label style={css({ display: "block", fontSize: "13px", fontWeight: 600, color: G.muted, marginBottom: "6px" })}>Return date</label>
                <input
                  type="date"
                  value={draft.endDate}
                  min={draft.startDate}
                  onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
                  style={css({ width: "100%", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "10px 12px", color: G.text, fontSize: "14px", outline: "none" })}
                />
              </div>
              <div style={css({ background: G.surface2, borderRadius: G.radius, padding: "12px", display: "flex", justifyContent: "space-between" })}>
                <span style={css({ color: G.muted, fontSize: "13px" })}>{days} day{days !== 1 ? "s" : ""}</span>
                <span style={css({ fontWeight: 700 })}>{cost === 0 ? "Free" : `R${cost}`}</span>
              </div>
              <Button fullWidth onClick={() => onNavigate({ page: "book", itemId, step: 2 })}>
                Continue →
              </Button>
            </div>
          )}

          {step === 2 && (
            <div style={css({ display: "flex", flexDirection: "column", gap: "16px" })}>
              <div>
                <label style={css({ display: "block", fontSize: "13px", fontWeight: 600, color: G.muted, marginBottom: "6px" })}>Your name</label>
                <input
                  type="text"
                  value={draft.contactName}
                  placeholder="Thabo Nkosi"
                  onChange={(e) => setDraft((d) => ({ ...d, contactName: e.target.value }))}
                  style={css({ width: "100%", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "10px 12px", color: G.text, fontSize: "14px", outline: "none" })}
                />
              </div>
              <div>
                <label style={css({ display: "block", fontSize: "13px", fontWeight: 600, color: G.muted, marginBottom: "6px" })}>Email address</label>
                <input
                  type="email"
                  value={draft.contactEmail}
                  placeholder="you@example.com"
                  onChange={(e) => setDraft((d) => ({ ...d, contactEmail: e.target.value }))}
                  style={css({ width: "100%", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "10px 12px", color: G.text, fontSize: "14px", outline: "none" })}
                />
              </div>
              <div style={css({ background: G.surface2, borderRadius: G.radius, padding: "12px" })}>
                <div style={css({ display: "flex", justifyContent: "space-between", marginBottom: "4px" })}>
                  <span style={css({ color: G.muted, fontSize: "13px" })}>Duration</span>
                  <span style={css({ fontSize: "13px" })}>{days} day{days !== 1 ? "s" : ""}</span>
                </div>
                <div style={css({ display: "flex", justifyContent: "space-between" })}>
                  <span style={css({ fontWeight: 700 })}>Total</span>
                  <span style={css({ fontWeight: 700, color: G.accent })}>{cost === 0 ? "Free" : `R${cost}`}</span>
                </div>
              </div>
              <Button
                fullWidth
                disabled={!draft.contactName || !draft.contactEmail}
                onClick={handleConfirm}
              >
                Confirm booking
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── CONFIRMATION PAGE ──────────────────────────── */
function ConfirmedPage({ code, onNavigate }: { code: string; onNavigate: (r: AppRoute) => void }) {
  return (
    <div style={css({ minHeight: "100vh", background: G.bg, color: G.text, fontFamily: "'Inter', system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" })}>
      <div style={css({ textAlign: "center", maxWidth: "400px" })}>
        <div style={css({ fontSize: "56px", marginBottom: "16px" })}>✅</div>
        <h1 style={css({ fontSize: "24px", fontWeight: 800, margin: "0 0 8px" })}>You're booked!</h1>
        <p style={css({ color: G.muted, fontSize: "15px", marginBottom: "24px" })}>
          The owner has been notified and will confirm within 24 hours. Check your email for details.
        </p>
        <div style={css({ background: G.surface, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "16px", marginBottom: "24px" })}>
          <p style={css({ color: G.muted, fontSize: "12px", margin: "0 0 4px", fontWeight: 600, letterSpacing: "1px" })}>BOOKING REFERENCE</p>
          <p style={css({ fontFamily: "monospace", fontSize: "22px", fontWeight: 800, color: G.accent, margin: 0 })}>{code}</p>
        </div>
        <Button fullWidth onClick={() => onNavigate({ page: "browse" })}>Browse more items</Button>
      </div>
    </div>
  );
}

/* ── AUTH PAGE ──────────────────────────────────── */
function AuthPage({ onNavigate }: { onNavigate: (r: AppRoute) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={css({ minHeight: "100vh", background: G.bg, color: G.text, fontFamily: "'Inter', system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" })}>
      <div style={css({ width: "100%", maxWidth: "400px" })}>
        <div style={css({ textAlign: "center", marginBottom: "32px" })}>
          <span style={css({ fontSize: "32px" })}>🔧</span>
          <p style={css({ fontWeight: 800, fontSize: "20px", margin: "8px 0 4px" })}>Borrow<span style={css({ color: G.accent })}>it</span></p>
          <p style={css({ color: G.muted, fontSize: "14px" })}>
            {mode === "signin" ? "Welcome back." : "Join your neighbourhood."}
          </p>
        </div>

        <div style={css({ background: G.surface, border: `1px solid ${G.border}`, borderRadius: G.radiusLg, padding: "28px" })}>
          <div style={css({ display: "flex", gap: "0", marginBottom: "24px", background: G.surface2, borderRadius: G.radius, padding: "4px" })}>
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={css({
                  flex: 1, padding: "8px", borderRadius: "7px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600,
                  background: mode === m ? G.accent : "transparent",
                  color: mode === m ? "#0d1117" : G.muted,
                  transition: "all 0.15s",
                })}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <div style={css({ display: "flex", flexDirection: "column", gap: "14px" })}>
            {mode === "signup" && (
              <div>
                <label style={css({ display: "block", fontSize: "13px", fontWeight: 600, color: G.muted, marginBottom: "6px" })}>Name</label>
                <input
                  type="text"
                  value={name}
                  placeholder="Your name"
                  onChange={(e) => setName(e.target.value)}
                  style={css({ width: "100%", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "10px 12px", color: G.text, fontSize: "14px", outline: "none" })}
                />
              </div>
            )}
            <div>
              <label style={css({ display: "block", fontSize: "13px", fontWeight: 600, color: G.muted, marginBottom: "6px" })}>Email</label>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                style={css({ width: "100%", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "10px 12px", color: G.text, fontSize: "14px", outline: "none" })}
              />
            </div>
            <div>
              <label style={css({ display: "block", fontSize: "13px", fontWeight: 600, color: G.muted, marginBottom: "6px" })}>Password</label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                style={css({ width: "100%", background: G.surface2, border: `1px solid ${G.border}`, borderRadius: G.radius, padding: "10px 12px", color: G.text, fontSize: "14px", outline: "none" })}
              />
            </div>
            <Button fullWidth onClick={() => onNavigate({ page: "browse" })}>
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </div>
        </div>

        <p style={css({ textAlign: "center", color: G.muted, fontSize: "13px", marginTop: "16px" })}>
          <button
            onClick={() => onNavigate({ page: "browse" })}
            style={css({ background: "none", border: "none", color: G.accent, cursor: "pointer", fontSize: "13px" })}
          >
            Continue browsing without an account →
          </button>
        </p>
      </div>
    </div>
  );
}

/* ── ROUTER / APP ROOT ──────────────────────────── */
export default function App() {
  const [route, setRoute] = useState<AppRoute>({ page: "browse" });

  const navigate = (r: AppRoute) => setRoute(r);

  switch (route.page) {
    case "browse":
      return <BrowsePage onNavigate={navigate} />;
    case "detail":
      return <DetailPage itemId={route.itemId} onNavigate={navigate} />;
    case "book":
      return <BookingPage itemId={route.itemId} step={route.step} onNavigate={navigate} />;
    case "confirmed":
      return <ConfirmedPage code={route.code} onNavigate={navigate} />;
    case "auth":
      return <AuthPage onNavigate={navigate} />;
  }
}
