# Shipment Payload Builder

A lightweight, browser-based tool designed to help developers construct and validate API payloads for the **Shiptheory Shipment API**.

## 🚀 Overview

The **Shipment Payload Builder** provides a user-friendly interface to quickly generate the JSON structure required for creating shipments in Shiptheory. It handles complex fields like sender/recipient addresses, product details, and per-item Dangerous Goods (DG) specifications, providing a real-time preview of the resulting payload.

## ✨ Features

-   **Order References**: Automatically generates timestamped references with options to append country codes.
-   **Address Management**: Easily edit Sender and Recipient information using JSON templates.
-   **Dynamic Product List**: Add, remove, and update multiple products within the shipment.
-   **Dangerous Goods (DG) Support**: Specify detailed IATA-compliant DG information on a per-product basis.
-   **Automatic Synchronization**: Sync total shipment weight and value directly from the product list.
-   **Live JSON Preview**: Watch the API payload build in real-time as you interact with the UI.
-   **One-Click Copy**: Quickly copy the generated JSON to your clipboard for testing in Postman or your code.
-   **API Integration**: Direct links to Shiptheory's developer documentation.

## 🛠️ Technology Stack

-   **Frontend**: HTML5, Vanilla JavaScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide Icons](https://lucide.dev/)
-   **Typography**: [Inter Font](https://fonts.google.com/specimen/Inter)

## 🖥️ Getting Started

Since this is a client-side tool, there is no installation or backend required.

1.  Clone the repository:
    ```bash
    git clone https://github.com/aisimon/shipment-tool.git
    ```
2.  Open `index.html` in any modern web browser.

## 📖 Usage

1.  **References**: Modify the Order Reference or click the refresh icon to generate a new one.
2.  **Addresses**: Update the JSON in the Sender and Recipient boxes.
3.  **Products**: Add products and fill in their details. If a product contains hazardous material, toggle the **Dangerous Goods** switch to add specifics.
4.  **Sync**: Use the "Sync from Products" button to automatically calculate the total weight and value for the shipment.
5.  **Copy**: Click "Copy Payload" on the right-hand panel to get the final JSON.

