"use client"

import React from 'react'
import Mermaid from '@/components/mermaid'

const uiTree = `graph TD
  A[\`src/app/page.tsx\` (Home)] --> B[\`src/components/header.tsx\`]
  A --> C[\`src/components/hero.tsx\`]
  A --> D[\`src/components/store-card.tsx\`]
  A --> E[\`src/components/menu-item-card.tsx\`]
  A --> F[\`src/components/footer.tsx\`]

  subgraph UI Primitives
    G[\`src/components/ui/button.tsx\`]
    H[\`src/components/ui/card.tsx\`]
    I[\`src/components/ui/badge.tsx\`]
  end

  D --> H
  E --> H
  E --> G
  E --> I`

const apiRoutes = `graph LR
  subgraph API
    A[/api/pos/menu/]:::get
    B[/api/pos/stream/]:::get
    C[/api/pos/webhook/]:::post

    D[/api/order/create/]:::post
    E[/api/order/status/[orderId]/]:::get

    F[/api/loyalty/enroll/]:::post
    G[/api/loyalty/[customerId]/]:::get

    H[/api/giftcard/purchase/]:::post
    I[/api/giftcard/redeem/]:::post
  end

  classDef get fill:#e3f2fd,stroke:#64b5f6,color:#0d47a1;
  classDef post fill:#e8f5e9,stroke:#81c784,color:#1b5e20;`

const dataFlow = `flowchart LR
  UI[Pages & Components] -->|fetch| API[Next.js Route Handlers]
  API -->|calls| Provider[POS Provider Layer]
  Provider -->|implementation| Mock[Mock Provider (\`src/lib/pos/mock-provider.ts\`)]
  Provider --> Base[\`src/lib/pos/base-provider.ts\`]
  Provider --> Index[\`src/lib/pos/index.ts\`]
  API --> Types[\`src/lib/types.ts\`]
  API --> Utils[\`src/lib/utils.ts\`]`

export default function SystemMapPage() {
  return (
    <div className="pt-24 container mx-auto px-4 lg:px-8 space-y-10">
      <div>
        <h1 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-2">System Map</h1>
        <p className="text-kona-espresso/70">Visual overview of the UI tree, API routes, and data flow.</p>
      </div>

      <section>
        <h2 className="font-league-spartan text-2xl font-semibold text-kona-espresso mb-3">UI / Component Tree</h2>
        <div className="bg-white rounded-kona p-4 shadow-kona-soft overflow-auto">
          <Mermaid chart={uiTree} />
        </div>
      </section>

      <section>
        <h2 className="font-league-spartan text-2xl font-semibold text-kona-espresso mb-3">API Routes</h2>
        <div className="bg-white rounded-kona p-4 shadow-kona-soft overflow-auto">
          <Mermaid chart={apiRoutes} />
        </div>
      </section>

      <section>
        <h2 className="font-league-spartan text-2xl font-semibold text-kona-espresso mb-3">Data Flow</h2>
        <div className="bg-white rounded-kona p-4 shadow-kona-soft overflow-auto">
          <Mermaid chart={dataFlow} />
        </div>
      </section>
    </div>
  )
}




