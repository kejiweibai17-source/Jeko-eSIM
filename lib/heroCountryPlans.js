/** Hero 區塊：國家 eSIM 方案（假資料 + 後台 Medusa 合併） */

export const MOCK_COUNTRIES = [
  {
    id: "mock-japan",
    name: "日本",
    handle: "japan",
    plans: [
      {
        id: "mock-jp-1",
        name: "日本 5日 10GB",
        data: "10GB",
        days: "5日",
        price: 399,
        slug: "japan-5d-10gb",
        categoryHandle: "japan",
        href: "/product/japan",
      },
      {
        id: "mock-jp-2",
        name: "日本 7日 20GB",
        data: "20GB",
        days: "7日",
        price: 599,
        slug: "japan-7d-20gb",
        categoryHandle: "japan",
        href: "/product/japan",
      },
      {
        id: "mock-jp-3",
        name: "日本 15日 無限量",
        data: "無限量",
        days: "15日",
        price: 899,
        slug: "japan-15d-unlimited",
        categoryHandle: "japan",
        href: "/product/japan",
      },
    ],
  },
  {
    id: "mock-korea",
    name: "韓國",
    handle: "korea",
    plans: [
      {
        id: "mock-kr-1",
        name: "韓國 5日 8GB",
        data: "8GB",
        days: "5日",
        price: 349,
        slug: "korea-5d-8gb",
        categoryHandle: "korea",
        href: "/product/korea",
      },
      {
        id: "mock-kr-2",
        name: "韓國 10日 15GB",
        data: "15GB",
        days: "10日",
        price: 549,
        slug: "korea-10d-15gb",
        categoryHandle: "korea",
        href: "/product/korea",
      },
    ],
  },
  {
    id: "mock-thailand",
    name: "泰國",
    handle: "thailand",
    plans: [
      {
        id: "mock-th-1",
        name: "泰國 5日 10GB",
        data: "10GB",
        days: "5日",
        price: 299,
        slug: "thailand-5d-10gb",
        categoryHandle: "thailand",
        href: "/product/thailand",
      },
      {
        id: "mock-th-2",
        name: "泰國 8日 20GB",
        data: "20GB",
        days: "8日",
        price: 449,
        slug: "thailand-8d-20gb",
        categoryHandle: "thailand",
        href: "/product/thailand",
      },
    ],
  },
  {
    id: "mock-singapore",
    name: "新加坡",
    handle: "singapore",
    plans: [
      {
        id: "mock-sg-1",
        name: "新加坡 5日 10GB",
        data: "10GB",
        days: "5日",
        price: 329,
        slug: "singapore-5d-10gb",
        categoryHandle: "singapore",
        href: "/product/singapore",
      },
    ],
  },
  {
    id: "mock-usa",
    name: "美國",
    handle: "usa",
    plans: [
      {
        id: "mock-us-1",
        name: "美國 7日 10GB",
        data: "10GB",
        days: "7日",
        price: 499,
        slug: "usa-7d-10gb",
        categoryHandle: "usa",
        href: "/product/usa",
      },
      {
        id: "mock-us-2",
        name: "美國 15日 25GB",
        data: "25GB",
        days: "15日",
        price: 799,
        slug: "usa-15d-25gb",
        categoryHandle: "usa",
        href: "/product/usa",
      },
    ],
  },
];

function formatMedusaProduct(product, categoryHandle) {
  const variant = product.variants?.[0];
  let price = 0;
  if (variant?.calculated_price?.calculated_amount != null) {
    price = variant.calculated_price.calculated_amount;
  } else if (variant?.prices?.[0]?.amount != null) {
    price = variant.prices[0].amount;
  }

  const meta = product.metadata || {};
  const data =
    meta.data_amount || meta.data || product.subtitle || "eSIM 方案";
  const days = meta.valid_days || meta.days || "";

  return {
    id: product.id,
    name: product.title,
    data: String(data),
    days: days ? String(days) : "",
    price: Math.round(Number(price) || 0),
    slug: product.handle,
    categoryHandle,
    href: `/product/${categoryHandle}/${product.handle}`,
    isReal: true,
  };
}

function defaultPlansForCategory(name, handle) {
  return [
    {
      id: `default-${handle}-1`,
      name: `${name} 5日 10GB`,
      data: "10GB",
      days: "5日",
      price: 399,
      slug: `${handle}-5d`,
      categoryHandle: handle,
      href: `/product/${handle}`,
    },
    {
      id: `default-${handle}-2`,
      name: `${name} 7日 20GB`,
      data: "20GB",
      days: "7日",
      price: 599,
      slug: `${handle}-7d`,
      categoryHandle: handle,
      href: `/product/${handle}`,
    },
  ];
}

/**
 * 合併 Medusa 分類/商品與假資料
 * @param {Array} categories - Medusa product_categories
 * @param {Array} products - Medusa products
 */
export function buildHeroCountries(categories = [], products = []) {
  const mockByHandle = new Map(MOCK_COUNTRIES.map((c) => [c.handle, c]));
  const result = [];
  const seenHandles = new Set();

  const productsByCategoryId = new Map();
  products.forEach((product) => {
    (product.categories || []).forEach((cat) => {
      const list = productsByCategoryId.get(cat.id) || [];
      list.push(formatMedusaProduct(product, cat.handle || cat.id));
      productsByCategoryId.set(cat.id, list);
    });
  });

  categories.forEach((cat) => {
    const handle = cat.handle || cat.id;
    seenHandles.add(handle);
    const mock = mockByHandle.get(handle);
    const apiPlans = productsByCategoryId.get(cat.id) || [];

    result.push({
      id: cat.id,
      name: cat.name,
      handle,
      plans:
        apiPlans.length > 0
          ? apiPlans
          : mock?.plans || defaultPlansForCategory(cat.name, handle),
    });
  });

  MOCK_COUNTRIES.forEach((mock) => {
    if (seenHandles.has(mock.handle)) return;
    seenHandles.add(mock.handle);
    result.push(mock);
  });

  return result.sort((a, b) => a.name.localeCompare(b.name, "zh-TW"));
}
