export default function BoxFrame({
  children,
  className = "",
  style,
  dashed = false,
  accent = false,
}) {
  const color = accent ? "var(--rm-accent)" : "var(--rm-border)";
  return (
    <div
      className={"relative " + className}
      style={{
        border: `${dashed || accent ? "1px dashed" : "1px solid"} ${color}`,
        ...style,
      }}
    >
      {children}
      <Handle className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" color={color} />
      <Handle className="right-0 top-0 translate-x-1/2 -translate-y-1/2" color={color} />
      <Handle className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" color={color} />
      <Handle className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" color={color} />
    </div>
  );
}

function Handle({ className, color }) {
  return (
    <span
      aria-hidden="true"
      className={"pointer-events-none absolute h-2 w-2 bg-rm-bg " + className}
      style={{ border: `1px solid ${color}` }}
    />
  );
}
