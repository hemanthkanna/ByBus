import { useEffect, useState, type ReactNode } from "react";

type IconName =
  | "arrow"
  | "box"
  | "bus"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "headset"
  | "home"
  | "location"
  | "package"
  | "phone"
  | "profile"
  | "shield"
  | "swap"
  | "truck"
  | "wallet";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    package: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>,
    headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2ZM20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2ZM17 18c0 2-2 3-5 3" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    swap: <><path d="m7 7-3 3 3 3M4 10h16M17 17l3-3-3-3M20 14H4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    box: <><path d="M3 7h18v14H3zM3 7l3-4h12l3 4M12 3v4" /></>,
    truck: <><path d="M3 5h11v12H3zM14 9h4l3 4v4h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
    shield: <><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    bus: <><rect x="4" y="3" width="16" height="17" rx="3" /><path d="M4 13h16M8 7h8M7 20v2M17 20v2" /><circle cx="8" cy="16.5" r="1" /><circle cx="16" cy="16.5" r="1" /></>,
    phone: <path d="M7 3 4 5c0 8 7 15 15 15l2-3-5-3-2 2c-3-1-5-3-6-6l2-2-3-5Z" />,
    wallet: <><path d="M4 6h15a2 2 0 0 1 2 2v11H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12" /><path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z" /></>,
    arrow: <><path d="m15 18-6-6 6-6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-mark"><span /></span>
      <span>BYBUS</span>
    </div>
  );
}

function Button({ children, onClick, variant = "primary", disabled = false }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost"; disabled?: boolean }) {
  return <button className={`button button-${variant}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function notify(message: string) {
  window.dispatchEvent(new CustomEvent("bybus-notify", { detail: message }));
}

function ToastHub() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    let timer = 0;
    const show = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(""), 2400);
    };
    window.addEventListener("bybus-notify", show);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("bybus-notify", show);
    };
  }, []);
  return message ? <div className="toast"><Icon name="check" size={16} />{message}</div> : null;
}

type Page = "home" | "shipments" | "support" | "profile" | "tracking";

const cities = ["Chennai", "Bengaluru", "Hyderabad", "Coimbatore", "Madurai"];

function Field({ label, icon, value, onChange }: { label: string; icon: IconName; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span className="field-icon"><Icon name={icon} size={19} /></span>
      <span className="field-copy"><small>{label}</small>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {cities.map((city) => <option key={city}>{city}</option>)}
        </select>
      </span>
      <Icon name="chevron" size={17} />
    </label>
  );
}

function BottomNav({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  const items: { page: Page; icon: IconName; label: string }[] = [
    { page: "home", icon: "home", label: "Home" },
    { page: "shipments", icon: "package", label: "Shipments" },
    { page: "support", icon: "headset", label: "Support" },
    { page: "profile", icon: "profile", label: "Profile" },
  ];
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button key={item.page} className={page === item.page ? "active" : ""} onClick={() => setPage(item.page)}>
          <Icon name={item.icon} size={21} /><span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Header({ eyebrow, title, onBack }: { eyebrow?: string; title?: string; onBack?: () => void }) {
  return (
    <header className="app-header">
      {onBack ? <button className="icon-button" onClick={onBack} aria-label="Go back"><Icon name="arrow" /></button> : <Logo />}
      {title && <div className="header-title">{eyebrow && <small>{eyebrow}</small>}<strong>{title}</strong></div>}
      {!onBack && <button className="avatar" onClick={() => notify("You’re all caught up")} aria-label="Open notifications">AS<span /></button>}
      {onBack && <div className="header-spacer" />}
    </header>
  );
}

function Home({ onBook, onTrack }: { onBook: () => void; onTrack: () => void }) {
  const [from, setFrom] = useState("Chennai");
  const [to, setTo] = useState("Bengaluru");
  const swap = () => { setFrom(to); setTo(from); };
  return (
    <div className="page home-page">
      <div className="blue-shell">
        <Header />
        <div className="welcome-row">
          <div><span>Good morning,</span><h1>Arjun</h1></div>
          <div className="overnight"><Icon name="clock" size={15} /> Overnight delivery</div>
        </div>
        <div className="hero-copy">
          <div className="route-art" aria-hidden="true">
            <span className="art-dot dot-a" /><span className="art-dot dot-b" />
            <span className="art-line" /><span className="mini-bus"><Icon name="bus" size={30} /></span>
          </div>
          <p>City to city, while you sleep.</p>
          <h2>Send parcels<br />overnight.</h2>
        </div>
      </div>

      <main className="home-content">
        <section className="booking-card">
          <div className="section-heading">
            <div><small>BOOK A DELIVERY</small><h2>Where is it going?</h2></div>
            <span className="secure-chip"><Icon name="shield" size={14} /> Secure</span>
          </div>
          <div className="route-fields">
            <Field label="FROM" icon="location" value={from} onChange={setFrom} />
            <button className="swap-button" onClick={swap} aria-label="Swap cities"><Icon name="swap" size={18} /></button>
            <Field label="TO" icon="location" value={to} onChange={setTo} />
          </div>
          <div className="split-fields">
            <label className="mini-field"><span><Icon name="calendar" size={18} /></span><small>SEND ON</small><strong>Today</strong></label>
            <label className="mini-field"><span><Icon name="box" size={18} /></span><small>PARCEL</small><strong>Medium</strong></label>
          </div>
          <div className="estimate"><span><Icon name="clock" size={17} /> Estimated delivery</span><strong>Tomorrow by 7:00 AM</strong></div>
          <Button onClick={onBook}>Find buses <span>→</span></Button>
        </section>

        <section className="benefits">
          <div><span><Icon name="truck" /></span><strong>Overnight</strong><small>Fast delivery</small></div>
          <div><span><Icon name="shield" /></span><strong>Protected</strong><small>Handled safely</small></div>
          <div><span><Icon name="location" /></span><strong>Live tracking</strong><small>Every milestone</small></div>
        </section>

        <section className="track-card" onClick={onTrack}>
          <div className="track-visual"><span className="pulse"><Icon name="location" size={20} /></span><i /><i /></div>
          <div><small>ACTIVE SHIPMENT</small><h3>Track your parcel</h3><p>Chennai <span>→</span> Bengaluru</p></div>
          <button aria-label="Track parcel"><Icon name="chevron" /></button>
        </section>
      </main>
    </div>
  );
}

const busServices = [
  { name: "Starlink Travels", time: "10:30 PM", arrival: "6:30 AM", type: "A/C Sleeper", space: "32 kg left", badge: "Fastest" },
  { name: "KPN Express", time: "11:15 PM", arrival: "7:45 AM", type: "Volvo Multi-Axle", space: "18 kg left", badge: "Popular" },
  { name: "Parveen Travels", time: "9:45 PM", arrival: "6:15 AM", type: "A/C Seater", space: "45 kg left", badge: "Best value" },
];

function BookingFlow({ close, complete }: { close: () => void; complete: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedBus, setSelectedBus] = useState(0);
  const [parcelType, setParcelType] = useState("Box");
  const [fragile, setFragile] = useState(false);
  const [payment, setPayment] = useState<"online" | "cash">("online");
  const titles = ["Choose your bus", "Tell us about it", "Sender & receiver", "Review & pay"];
  return (
    <div className="flow page">
      <Header eyebrow={`STEP ${step} OF 4`} title={titles[step - 1]} onBack={step === 1 ? close : () => setStep(step - 1)} />
      <div className="stepper">{[1, 2, 3, 4].map((n) => <span key={n} className={n <= step ? "done" : ""} />)}</div>

      {step === 1 && <main className="flow-content">
        <div className="route-summary"><div><small>FROM</small><strong>Chennai</strong></div><div className="route-line"><Icon name="bus" size={18} /></div><div><small>TO</small><strong>Bengaluru</strong></div></div>
        <p className="result-count">3 overnight services available</p>
        <div className="service-list">
          {busServices.map((bus, index) => <button key={bus.name} className={`service-card ${selectedBus === index ? "selected" : ""}`} onClick={() => setSelectedBus(index)}>
            <div className="service-top"><span className="company-mark">{bus.name.charAt(0)}</span><div><strong>{bus.name}</strong><small>{bus.type}</small></div><span className="service-badge">{bus.badge}</span></div>
            <div className="times"><div><strong>{bus.time}</strong><small>Chennai</small></div><div className="duration"><span /><small>8 hr</small><span /></div><div><strong>{bus.arrival}</strong><small>Bengaluru</small></div></div>
            <div className="service-foot"><span><Icon name="box" size={16} /> {bus.space}</span><strong>₹450</strong></div>
          </button>)}
        </div>
      </main>}

      {step === 2 && <main className="flow-content">
        <p className="lead">What are you sending?</p>
        <div className="parcel-grid">{["Documents", "Box", "Electronics", "Clothes", "Food", "Other"].map((type) => <button key={type} className={parcelType === type ? "selected" : ""} onClick={() => setParcelType(type)}><Icon name={type === "Documents" ? "package" : type === "Electronics" ? "phone" : "box"} /><span>{type}</span>{parcelType === type && <i><Icon name="check" size={12} /></i>}</button>)}</div>
        <div className="form-card">
          <label><small>ESTIMATED WEIGHT</small><div><input defaultValue="5" inputMode="decimal" /><span>kg</span></div></label>
          <div className="dimension-row"><label><small>LENGTH</small><input placeholder="30 cm" /></label><label><small>WIDTH</small><input placeholder="20 cm" /></label><label><small>HEIGHT</small><input placeholder="15 cm" /></label></div>
        </div>
        <button className={`toggle-row ${fragile ? "enabled" : ""}`} onClick={() => setFragile(!fragile)}><span><strong>Fragile parcel</strong><small>{fragile ? "Extra-care handling added" : "Requires extra care"}</small></span><i><b /></i></button>
        <div className="info-note"><Icon name="shield" size={20} /><p><strong>Your parcel is protected</strong><br />Every shipment is verified at pickup and drop-off.</p></div>
      </main>}

      {step === 3 && <main className="flow-content">
        <div className="person-card"><div className="card-title"><span>S</span><div><small>SENDER</small><strong>Pickup details</strong></div></div><label><small>FULL NAME</small><input defaultValue="Arjun Sharma" /></label><label><small>MOBILE NUMBER</small><input defaultValue="+91 98765 43210" /></label><label><small>PICKUP POINT</small><input defaultValue="Koyambedu Bus Terminus" /></label></div>
        <div className="person-card receiver"><div className="card-title"><span>R</span><div><small>RECEIVER</small><strong>Drop-off details</strong></div></div><label><small>FULL NAME</small><input defaultValue="Priya Nair" /></label><label><small>MOBILE NUMBER</small><input defaultValue="+91 91234 56789" /></label><label><small>DROP POINT</small><input defaultValue="Majestic Bus Station" /></label></div>
      </main>}

      {step === 4 && <main className="flow-content">
        <div className="review-route"><span><Icon name="location" /></span><div><small>YOUR ROUTE</small><h3>Chennai <b>→</b> Bengaluru</h3><p>Tonight, 10:30 PM · Starlink Travels</p></div></div>
        <div className="review-card"><div><span>Parcel</span><strong>{parcelType} · 5 kg</strong></div><div><span>Sender</span><strong>Arjun Sharma</strong></div><div><span>Receiver</span><strong>Priya Nair</strong></div></div>
        <h3 className="payment-title">Payment method</h3>
        <button className={`payment-option ${payment === "online" ? "selected" : ""}`} onClick={() => setPayment("online")}><span><Icon name="wallet" /></span><div><strong>UPI / Cards</strong><small>Pay securely online</small></div><i>{payment === "online" && <Icon name="check" size={13} />}</i></button>
        <button className={`payment-option ${payment === "cash" ? "selected" : ""}`} onClick={() => setPayment("cash")}><span><Icon name="bus" /></span><div><strong>Cash at counter</strong><small>Pay while handing over</small></div><i>{payment === "cash" && <Icon name="check" size={13} />}</i></button>
        <div className="price-card"><div><span>Parcel charge</span><strong>₹450</strong></div><div><span>Platform fee</span><strong>₹20</strong></div><div><span>Total</span><strong>₹470</strong></div></div>
      </main>}

      <footer className="flow-footer">
        <div>{step === 1 && <><small>FROM</small><strong>₹450</strong></>}{step === 4 && <><small>TOTAL</small><strong>₹470</strong></>}</div>
        <Button onClick={step < 4 ? () => setStep(step + 1) : complete}>{step < 4 ? "Continue" : payment === "online" ? "Pay securely" : "Confirm booking"} <span>→</span></Button>
      </footer>
    </div>
  );
}

function Tracking({ onBack }: { onBack: () => void }) {
  return <div className="page tracking-page">
    <div className="tracking-hero"><Header title="Track shipment" onBack={onBack} /><div className="tracking-status"><span>IN TRANSIT</span><small>BYB250618001234</small><h1>Your parcel is on the move</h1><p>Arriving tomorrow by <strong>6:30 AM</strong></p></div></div>
    <main className="tracking-content">
      <section className="map-card">
        <div className="map-grid" />
        <span className="map-city city-start">Chennai</span><span className="map-city city-mid">Krishnagiri</span><span className="map-city city-end">Bengaluru</span>
        <svg viewBox="0 0 350 180" preserveAspectRatio="none"><path d="M40 145 C90 120 75 70 145 88 S235 135 310 35" /></svg>
        <span className="map-pin pin-start" /><span className="map-pin pin-end" />
        <span className="bus-pin"><Icon name="bus" size={22} /></span>
        <div className="map-update"><span /> Live · updated 2 min ago</div>
      </section>
      <section className="eta-card"><div><small>ESTIMATED ARRIVAL</small><strong>6:30 AM</strong><span>Tomorrow · On time</span></div><div className="eta-ring"><strong>3h</strong><small>42m</small></div></section>
      <section className="timeline-card"><div className="section-heading"><h2>Journey updates</h2><span>4 of 7</span></div>
        {[["Booking confirmed", "Today, 10:02 AM"], ["Parcel received", "Today, 8:15 PM"], ["Loaded on bus", "Today, 9:40 PM"], ["In transit", "Departed at 10:32 PM"], ["Arrived in Bengaluru", "Expected 6:15 AM"], ["Delivered", "Expected by 7:00 AM"]].map((item, i) => <div className={`timeline-item ${i < 4 ? "complete" : ""} ${i === 3 ? "current" : ""}`} key={item[0]}><i>{i < 3 ? <Icon name="check" size={13} /> : i === 3 ? <Icon name="bus" size={14} /> : ""}</i><div><strong>{item[0]}</strong><small>{item[1]}</small></div></div>)}
      </section>
      <section className="support-strip"><span><Icon name="headset" /></span><div><strong>Need help with this shipment?</strong><small>Our support team is available 24/7</small></div><Icon name="chevron" /></section>
    </main>
  </div>;
}

function Shipments({ onTrack }: { onTrack: () => void }) {
  const [tab, setTab] = useState<"Active" | "Delivered" | "Cancelled">("Active");
  return <div className="page basic-page"><Header title="My shipments" /><main>
    <div className="tabs">{(["Active", "Delivered", "Cancelled"] as const).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item} {item === "Active" && <span>1</span>}</button>)}</div>
    {tab === "Active" && <section className="shipment-card"><div className="shipment-head"><span>IN TRANSIT</span><small>BYB250618001234</small></div><div className="shipment-route"><div><i /><small>FROM</small><strong>Chennai</strong></div><span /><div><i /><small>TO</small><strong>Bengaluru</strong></div></div><div className="shipment-meta"><span><Icon name="bus" size={17} /> Starlink Travels</span><span><Icon name="clock" size={17} /> ETA 6:30 AM</span></div><Button onClick={onTrack}>Track shipment</Button></section>}
    {tab === "Delivered" && <><section className="past-shipment tab-result"><span><Icon name="check" /></span><div><strong>Hyderabad → Chennai</strong><small>Delivered on 12 Jun · BYB25061208</small></div><Icon name="chevron" /></section><section className="past-shipment"><span><Icon name="check" /></span><div><strong>Madurai → Bengaluru</strong><small>Delivered on 28 May · BYB25052814</small></div><Icon name="chevron" /></section></>}
    {tab === "Cancelled" && <div className="empty-state"><span><Icon name="package" size={28} /></span><h3>No cancelled shipments</h3><p>Your cancelled shipments will appear here.</p></div>}
    {tab === "Active" && <><div className="previous-title"><h3>Previous shipments</h3><button onClick={() => setTab("Delivered")}>View all</button></div><button className="past-shipment full-button" onClick={() => notify("Shipment details opened")}><span><Icon name="check" /></span><div><strong>Hyderabad → Chennai</strong><small>Delivered on 12 Jun · BYB25061208</small></div><Icon name="chevron" /></button></>}
  </main></div>;
}

function SimplePage({ type, onOperator }: { type: "support" | "profile"; onOperator: () => void }) {
  const support = type === "support";
  return <div className="page basic-page"><Header title={support ? "Help & support" : "Your profile"} /><main>
    <section className={support ? "support-hero" : "profile-hero"}>
      {support ? <><span><Icon name="headset" size={30} /></span><h2>How can we help?</h2><p>We’re here around the clock for every journey.</p><Button onClick={() => notify("Support conversation started")}>Start a conversation</Button></> : <><span className="big-avatar">AS</span><h2>Arjun Sharma</h2><p>+91 98765 43210 · Chennai</p></>}
    </section>
    <div className="menu-list">
      {(support ? [["phone", "Call customer care"], ["package", "Shipment issue"], ["wallet", "Payments & refunds"], ["shield", "Safety & restricted items"]] : [["profile", "Personal information"], ["location", "Saved addresses"], ["wallet", "Payment methods"], ["shield", "Privacy & security"]]).map(([icon, label]) => <button key={label} onClick={() => notify(`${label} opened`)}><span><Icon name={icon as IconName} /></span><strong>{label}</strong><Icon name="chevron" /></button>)}
      {!support && <button onClick={onOperator}><span><Icon name="bus" /></span><strong>Operator workspace</strong><Icon name="chevron" /></button>}
    </div>
  </main></div>;
}

function Confirmation({ onTrack, onHome }: { onTrack: () => void; onHome: () => void }) {
  const copy = async () => {
    try { await navigator.clipboard.writeText("BYB250618001234"); } catch { /* Clipboard may be unavailable in preview. */ }
    notify("Booking ID copied");
  };
  return <div className="confirmation page"><div className="success-burst"><span><Icon name="check" size={35} /></span></div><small>BOOKING CONFIRMED</small><h1>Your parcel is ready<br />for the journey.</h1><p>We’ve sent the booking details to your phone.</p><div className="ticket"><div className="ticket-top"><small>BOOKING ID</small><strong>BYB250618001234</strong><button onClick={copy}>Copy</button></div><div className="ticket-route"><div><small>FROM</small><strong>Chennai</strong><span>10:30 PM</span></div><div><Icon name="bus" /><i /></div><div><small>TO</small><strong>Bengaluru</strong><span>6:30 AM</span></div></div><div className="ticket-foot"><span>Starlink Travels</span><strong>₹470 paid</strong></div></div><div className="confirmation-note"><Icon name="box" /><p>Hand over your parcel at <strong>Koyambedu Bus Terminus</strong> by 9:45 PM.</p></div><Button onClick={onTrack}>Track your parcel <span>→</span></Button><button className="link-button" onClick={onHome}>Back to home</button></div>;
}

function Welcome({ onStart, onLogin, onOperator }: { onStart: () => void; onLogin: () => void; onOperator: () => void }) {
  return <div className="welcome-screen page">
    <div className="welcome-brand"><Logo light /><button onClick={onOperator}>Operator login</button></div>
    <div className="welcome-art">
      <div className="moon" /><div className="road road-one" /><div className="road road-two" />
      <span className="welcome-bus"><Icon name="bus" size={45} /></span>
      <span className="city-dot city-dot-one" /><span className="city-dot city-dot-two" />
    </div>
    <div className="welcome-copy"><small>LOGISTICS POWERED BY BUSES</small><h1>Send & receive parcels across cities <em>overnight.</em></h1><p>Fast, secure delivery on routes that already connect your city every night.</p></div>
    <div className="welcome-features"><span><Icon name="clock" />Fast</span><span><Icon name="shield" />Secure</span><span><Icon name="location" />Trackable</span></div>
    <div className="welcome-actions"><Button onClick={onStart}>Get started <span>→</span></Button><button onClick={onLogin}>Already have an account? <strong>Log in</strong></button></div>
  </div>;
}

function Auth({ operator = false, onBack, onComplete }: { operator?: boolean; onBack: () => void; onComplete: () => void }) {
  const [sent, setSent] = useState(operator);
  const [mobile, setMobile] = useState(operator ? "OP-2048" : "");
  const [otp, setOtp] = useState("");
  const submit = () => {
    if (!sent) {
      if (mobile.replace(/\D/g, "").length < 10) return notify("Enter a valid 10-digit mobile number");
      setSent(true);
      notify("OTP sent successfully");
      return;
    }
    if (!operator && otp.length < 4) return notify("Enter the 4-digit OTP");
    onComplete();
  };
  return <div className="auth-screen page">
    <Header title={operator ? "Operator access" : "Welcome back"} onBack={onBack} />
    <main>
      <div className="auth-symbol"><Icon name={operator ? "bus" : "phone"} size={34} /></div>
      <small>{operator ? "STAFF WORKSPACE" : sent ? "VERIFY YOUR NUMBER" : "SECURE LOGIN"}</small>
      <h1>{operator ? "Start your assigned trip." : sent ? "Enter the code we sent." : "Your deliveries, one tap away."}</h1>
      <p>{operator ? "Sign in with your employee ID and access code." : sent ? `A 4-digit OTP was sent to +91 ${mobile}.` : "We’ll send a one-time password to verify your mobile number."}</p>
      <label className="auth-input"><small>{operator ? "EMPLOYEE ID" : "MOBILE NUMBER"}</small><div>{!operator && <span>+91</span>}<input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder={operator ? "OP-2048" : "98765 43210"} inputMode={operator ? "text" : "tel"} /></div></label>
      {sent && <label className="auth-input"><small>{operator ? "ACCESS CODE" : "ONE-TIME PASSWORD"}</small><div><input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={operator ? "••••••" : "4-digit OTP"} inputMode="numeric" type={operator ? "password" : "text"} /></div></label>}
      <Button onClick={submit}>{operator ? "Sign in securely" : sent ? "Verify & continue" : "Send OTP"} <span>→</span></Button>
      {sent && !operator && <button className="auth-link" onClick={() => notify("A new OTP has been sent")}>Didn’t receive it? <strong>Resend OTP</strong></button>}
      <div className="auth-safe"><Icon name="shield" size={17} /> Your details are encrypted and secure</div>
    </main>
  </div>;
}

type OperatorPage = "dashboard" | "scan" | "parcel" | "received" | "trip" | "delivery" | "exception";

function OperatorApp({ onExit }: { onExit: () => void }) {
  const [page, setPage] = useState<OperatorPage>("dashboard");
  const [status, setStatus] = useState("Received");
  if (page === "scan") return <OperatorScan onBack={() => setPage("dashboard")} onFound={() => setPage("parcel")} />;
  if (page === "parcel") return <OperatorParcel onBack={() => setPage("scan")} onConfirm={() => setPage("received")} />;
  if (page === "received") return <OperatorReceived onDone={() => { setStatus("Loaded"); setPage("dashboard"); }} />;
  if (page === "trip") return <OperatorTrip status={status} onBack={() => setPage("dashboard")} onStatus={() => { setStatus(status === "Loaded" ? "In Transit" : "Loaded"); notify(`Parcel marked ${status === "Loaded" ? "in transit" : "loaded"}`); }} />;
  if (page === "delivery") return <OperatorDelivery onBack={() => setPage("dashboard")} onComplete={() => { notify("Parcel delivered successfully"); setPage("dashboard"); }} />;
  if (page === "exception") return <OperatorException onBack={() => setPage("dashboard")} onComplete={() => { notify("Exception reported to dispatch"); setPage("dashboard"); }} />;
  return <div className="operator page">
    <div className="operator-top"><div><Logo light /><small>OPERATOR</small></div><button onClick={onExit}><Icon name="profile" />Exit</button></div>
    <main>
      <div className="operator-greeting"><div><small>GOOD EVENING</small><h1>Rajesh</h1></div><span>ON DUTY</span></div>
      <section className="trip-hero"><div className="trip-head"><span><Icon name="bus" /></span><div><small>TODAY’S ASSIGNED BUS</small><strong>Starlink · SL 102</strong></div><i>10:30 PM</i></div><div className="trip-route"><strong>Chennai</strong><span><Icon name="arrow" size={15} /> 345 km</span><strong>Bengaluru</strong></div><button onClick={() => setPage("trip")}>View trip & parcel list <Icon name="chevron" /></button></section>
      <div className="operator-kpis"><div><strong>24</strong><small>Total</small></div><div><strong>18</strong><small>Received</small></div><div><strong>16</strong><small>Loaded</small></div><div><strong>6</strong><small>To receive</small></div></div>
      <Button onClick={() => setPage("scan")}><Icon name="package" /> Scan parcel QR</Button>
      <button className="operator-secondary" onClick={() => setPage("scan")}><Icon name="package" /> Search booking ID</button>
      <h3 className="operator-section-title">Quick actions</h3>
      <div className="quick-actions"><button onClick={() => setPage("delivery")}><span><Icon name="check" /></span><strong>Confirm<br />handover</strong></button><button onClick={() => setPage("trip")}><span><Icon name="location" /></span><strong>Trip<br />progress</strong></button><button onClick={() => setPage("exception")}><span><Icon name="shield" /></span><strong>Report<br />issue</strong></button></div>
      <div className="operator-alert"><span><Icon name="clock" /></span><div><strong>Departure in 48 minutes</strong><small>Complete parcel loading by 10:15 PM</small></div></div>
    </main>
  </div>;
}

function OperatorScan({ onBack, onFound }: { onBack: () => void; onFound: () => void }) {
  const [manual, setManual] = useState(false);
  const [id, setId] = useState("");
  return <div className="operator operator-sub page"><Header title="Scan parcel" onBack={onBack} /><main><div className="scan-tabs"><button className={!manual ? "active" : ""} onClick={() => setManual(false)}>Scan QR</button><button className={manual ? "active" : ""} onClick={() => setManual(true)}>Enter booking ID</button></div>
    {!manual ? <><div className="scanner"><span /><span /><span /><span /><div><Icon name="package" size={35} /><i /></div></div><h2>Place QR inside the frame</h2><p>The parcel details will appear automatically.</p><Button onClick={onFound}>Simulate QR scan</Button></> : <><div className="manual-search"><Icon name="package" /><input value={id} onChange={(e) => setId(e.target.value)} placeholder="BYB250618001234" /></div><Button disabled={id.length < 5} onClick={onFound}>Find parcel</Button></>}
    <div className="scan-note"><Icon name="shield" /> Verify the parcel label matches the booking before accepting it.</div>
  </main></div>;
}

function OperatorParcel({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  return <div className="operator operator-sub page"><Header title="Verify parcel" onBack={onBack} /><main><div className="verified-badge"><Icon name="check" /> Booking found</div><div className="operator-booking"><small>BOOKING ID</small><h2>BYB250618001234</h2><span>AWAITING HANDOVER</span></div><div className="detail-list"><div><small>ROUTE</small><strong>Chennai → Bengaluru</strong></div><div><small>PARCEL</small><strong>Box · 5 kg</strong></div><div><small>SENDER</small><strong>Arjun Sharma · 98765 43210</strong></div><div><small>RECEIVER</small><strong>Priya Nair · 91234 56789</strong></div><div><small>BUS / DEPARTURE</small><strong>SL 102 · 10:30 PM</strong></div></div><label className="condition-check"><input type="checkbox" defaultChecked /><span><strong>Parcel condition verified</strong><small>Label is intact and package has no visible damage</small></span></label><Button onClick={onConfirm}>Confirm parcel received</Button><button className="danger-link" onClick={() => notify("Issue flagged for dispatch")}>Report an issue instead</button></main></div>;
}

function OperatorReceived({ onDone }: { onDone: () => void }) {
  return <div className="operator received-screen page"><div className="received-icon"><Icon name="check" size={34} /></div><small>PARCEL RECEIVED</small><h1>Ready to load.</h1><p>The customer has been notified and the parcel is now assigned to your trip.</p><div className="received-card"><span>BYB250618001234</span><h3>Chennai → Bengaluru</h3><div><small>PARCEL</small><strong>Box · 5 kg</strong></div><div><small>BUS</small><strong>Starlink SL 102</strong></div><b>RECEIVED</b></div><Button onClick={onDone}>Mark as loaded & continue</Button></div>;
}

function OperatorTrip({ status, onBack, onStatus }: { status: string; onBack: () => void; onStatus: () => void }) {
  return <div className="operator operator-sub page"><Header title="Today’s trip" onBack={onBack} /><main><section className="operator-route-map"><div><i className="done"><Icon name="check" /></i><span><strong>Chennai</strong><small>Collection · 10:30 PM</small></span></div><div><i /><span><strong>Salem</strong><small>Stop · 2:10 AM</small></span></div><div><i /><span><strong>Bengaluru</strong><small>Arrival · 6:30 AM</small></span></div></section><div className="capacity"><span>Parcel capacity</span><strong>68 / 90 kg</strong><i><b /></i></div><div className="parcel-table"><div><span>BOOKING</span><span>DESTINATION</span><span>STATUS</span></div>{[["BYB001", "Bengaluru", status], ["BYB002", "Salem", "Loaded"], ["BYB003", "Bengaluru", "Received"]].map((row) => <button key={row[0]} onClick={() => notify(`${row[0]} details opened`)}><strong>{row[0]}</strong><span>{row[1]}</span><i>{row[2]}</i></button>)}</div><Button onClick={onStatus}>Mark selected parcel {status === "Loaded" ? "in transit" : "loaded"}</Button></main></div>;
}

function OperatorDelivery({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [otp, setOtp] = useState("");
  return <div className="operator operator-sub page"><Header title="Confirm handover" onBack={onBack} /><main><div className="delivery-symbol"><Icon name="package" size={34} /></div><div className="operator-booking"><small>READY FOR DELIVERY</small><h2>BYB250618001234</h2></div><div className="receiver-detail"><small>RECEIVER</small><strong>Priya Nair</strong><span>+91 91234 56789</span><button onClick={() => notify("Calling receiver…")}><Icon name="phone" /> Call</button></div><label className="auth-input"><small>RECEIVER OTP</small><div><input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 4-digit OTP" inputMode="numeric" /></div></label><Button disabled={otp.length < 4} onClick={onComplete}>Verify OTP & complete delivery</Button><button className="auth-link" onClick={() => notify("Delivery QR scanner opened")}>Use delivery QR instead</button></main></div>;
}

function OperatorException({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [type, setType] = useState("Bus delayed");
  const [note, setNote] = useState("");
  return <div className="operator operator-sub page"><Header title="Report exception" onBack={onBack} /><main><div className="warning-banner"><Icon name="shield" /><div><strong>Dispatch will be notified</strong><small>Add accurate details to help resolve this quickly.</small></div></div><label className="select-field"><small>EXCEPTION TYPE</small><select value={type} onChange={(e) => setType(e.target.value)}>{["Customer unavailable", "Wrong destination", "Damaged parcel", "Parcel missing", "Bus delayed", "Bus cancelled", "Route changed", "Payment issue", "Other"].map((item) => <option key={item}>{item}</option>)}</select></label><label className="select-field"><small>DESCRIPTION</small><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe what happened…" /></label><button className="evidence-button" onClick={() => notify("Camera opened for evidence")}><Icon name="package" /><span><strong>Add photo or evidence</strong><small>Optional · JPG or PNG</small></span><Icon name="chevron" /></button><div className="location-readout"><Icon name="location" /><span><small>CURRENT LOCATION</small><strong>Salem Bus Terminal · just now</strong></span></div><Button disabled={note.length < 5} onClick={onComplete}>Report exception</Button></main></div>;
}

export default function App() {
  const [entry, setEntry] = useState<"welcome" | "login" | "operator-login" | "app" | "operator">("welcome");
  const [page, setPage] = useState<Page>("home");
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const track = () => { setBooking(false); setConfirmed(false); setPage("tracking"); };
  if (entry === "welcome") return <AppFrame><Welcome onStart={() => setEntry("login")} onLogin={() => setEntry("login")} onOperator={() => setEntry("operator-login")} /></AppFrame>;
  if (entry === "login") return <AppFrame><Auth onBack={() => setEntry("welcome")} onComplete={() => setEntry("app")} /></AppFrame>;
  if (entry === "operator-login") return <AppFrame><Auth operator onBack={() => setEntry("welcome")} onComplete={() => setEntry("operator")} /></AppFrame>;
  if (entry === "operator") return <AppFrame><OperatorApp onExit={() => setEntry("welcome")} /></AppFrame>;
  if (booking) return <AppFrame><BookingFlow close={() => setBooking(false)} complete={() => { setBooking(false); setConfirmed(true); }} /></AppFrame>;
  if (confirmed) return <AppFrame><Confirmation onTrack={track} onHome={() => { setConfirmed(false); setPage("home"); }} /></AppFrame>;
  if (page === "tracking") return <AppFrame><Tracking onBack={() => setPage("shipments")} /></AppFrame>;
  return (
    <AppFrame>
      {page === "home" && <Home onBook={() => setBooking(true)} onTrack={track} />}
      {page === "shipments" && <Shipments onTrack={track} />}
      {page === "support" && <SimplePage type="support" onOperator={() => setEntry("operator-login")} />}
      {page === "profile" && <SimplePage type="profile" onOperator={() => setEntry("operator-login")} />}
      <BottomNav page={page} setPage={setPage} />
    </AppFrame>
  );
}

function AppFrame({ children }: { children: ReactNode }) {
  return <div className="app-stage"><aside><Logo light /><div><small>LOGISTICS, REIMAGINED</small><h2>Send farther.<br />Sleep easier.</h2><p>Trusted overnight parcel delivery, powered by India’s intercity bus network.</p></div><div className="aside-stat"><strong>18,000+</strong><span>parcels delivered this week</span></div></aside><div className="phone-shell">{children}<ToastHub /></div></div>;
}
