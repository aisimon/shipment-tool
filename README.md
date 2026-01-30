# Shipment Payload Builder

A browser-based tool to construct  **Shiptheory Shipment API** payload.

It is currently published at https://aisimon.github.io/shipment-tool/

![Shipment Payload Builder Screenshot](image/screenshot-2026-01-30.png)


## ✨ Features
- **Dynamic Payloads**: Live JSON preview as you edit
- **One-Click Copy**: Fast clipboard export for API testing.
- **Address Templates**: Preset sender/recipient JSON blocks.
- **Product Management**: Add multiple items with per-product **Dangerous Goods** (DG) support.
- **Smart Sync**: Calculate total weight and value from the product list automatically.

Addresses are random and no personal contact are shared, with some of them are McDonald's all over the world.

## Quick Start
Visit the published page https://aisimon.github.io/shipment-tool/, or hosted it locally:

1. Clone the repo: `git clone https://github.com/aisimon/shipment-tool.git`
2. Open `index.html` in your browser, or run `python3 -m http.server 8123` to serve it

## Tech
HTML5, Vanilla JS, [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/).

## Roadmap or todo
- Allow entering access token to directly POST to Shiptheory to create shipments. Never save access token.
- Add more sample addreses for different countries
- Add more realistic commodity data or product data
