# AEM Content Fragment Models — Defense & Aerospace Product Explorer

## Overview

These models replicate the data structure of the Teradyne Defense & Aerospace Product Explorer, which was originally a React app powered by WordPress custom post types and ACF fields.

## AEM Content Package

A ready-to-install AEM content package is available at:

```
packages/4teradyne-content-models-1.0.0.zip
```

Install via AEM Package Manager. The package includes:
- 4 Content Fragment Model definitions under `/conf/4teradyne/settings/dam/cfm/models/`
- DAM folder structure under `/content/dam/4teradyne/`

**DAM Image Paths:**
- Product images: `/content/dam/4teradyne/products/`
- Popup detail images: `/content/dam/4teradyne/defense-aerospace/product-explorer/`

To rebuild the package after changes: `node packages/build-package.js`

## Models

### 1. `defense-product.cfm.json` — Main Product Model
The primary content fragment for each defense/aerospace product (71 products in source).

**Key fields:**
- `productModel` — Short model ID (e.g., "PXIe-25G", "Guardian")
- `productName` — Descriptive name
- `description` — Summary text
- `image` — Product photo (DAM reference)
- `category` — Fragment reference to Product Category
- `searchWeight` — Sort priority
- `brochureUrl` — Link to PDF or landing page
- **11 filter fields** — Multi-select enumerations for faceted filtering
- `supportedBusDetails` / `testApplicationDetails` — Fragment references to popup detail content

### 2. `product-category.cfm.json` — Category Model
The 6 product categories that organize the explorer tabs.

| Category | Product Count |
|----------|--------------|
| Analog Test | 35 |
| Serial Bus Test | 19 |
| Optical Test | 5 |
| Parallel Digital Test | 5 |
| Configurable Test Systems | 4 |
| Switching | 3 |

Each category defines which filter columns are visible when that tab is active.

### 3. `product-popup-detail.cfm.json` — Popup Detail Model
Rich popup content for supported bus and test application entries. Contains heading, description, related instruments, CTA button, and optional image.

### 4. `filter-configuration.cfm.json` — Filter Configuration
Defines filter column metadata (display label, UI type, options, sort order).

## Data Migration Path

```
WordPress (source)                    AEM (target)
─────────────────                     ───────────────
finderproducts CPT          →         Defense Product CF
product_finder_cat taxonomy →         Product Category CF
ACF supported_bus_table     →         Product Popup Detail CF (multi)
ACF test_applications_table →         Product Popup Detail CF (multi)
productFinderFilters JS var →         Filter Configuration CF
```

## API Endpoints (Source)

- Products: `GET /wp-json/wp/v2/finderproducts?per_page=100`
- Categories: `GET /wp-json/wp/v2/product_finder_cat`
- Single product: `GET /wp-json/wp/v2/finderproducts/{id}`

## GraphQL Queries (Target)

Once content fragments are created in AEM, the product explorer frontend can query them via AEM's GraphQL API:

```graphql
{
  defenseProductList(
    filter: {
      category: { slug: { _expressions: [{ value: "serial-bus-test" }] } }
      platformFilter: { _expressions: [{ values: ["PXIe"], _operator: CONTAINS }] }
    }
    _sort: [{ searchWeight: ASC }]
  ) {
    items {
      productModel
      productName
      description
      image { ... on ImageRef { _path } }
      brochureUrl
      platformFilter
      supportedBusFilter
      supportedBusDetails { heading details }
    }
  }
}
```
