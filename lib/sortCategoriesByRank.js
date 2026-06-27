/**
 * 依 Medusa product_category.rank 排序（數字越小越前面）
 */
export function sortCategoriesByRank(categories = []) {
  return [...categories].sort((a, b) => {
    const rankA = a.rank ?? 9999;
    const rankB = b.rank ?? 9999;
    if (rankA !== rankB) return rankA - rankB;
    return (a.name || "").localeCompare(b.name || "", "zh-TW");
  });
}
