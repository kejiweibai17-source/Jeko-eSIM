export function parsePartnerType(description) {
  if (!description) return "—";
  const match = description.match(/【合作類型】(.*?)(?:\n|$)/);
  return match ? match[1].trim() : "—";
}

export function parseDescriptionField(description, key) {
  if (!description) return null;
  const re = new RegExp(`【${key}】(.*?)(?:\\n|$)`);
  const match = description.match(re);
  return match ? match[1].trim() : null;
}
