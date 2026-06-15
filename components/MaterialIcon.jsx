/**
 * Google Material Symbols Outlined
 * @see https://fonts.google.com/icons
 */
export default function MaterialIcon({
  name,
  size = 24,
  filled = false,
  className = "",
  style,
  ...props
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: typeof size === "number" ? size : undefined,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        lineHeight: 1,
        ...style,
      }}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    >
      {name}
    </span>
  );
}
