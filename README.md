# CoffeeWallet Mock Web Showcase

A responsive, high-fidelity mock website for **CoffeeWallet** built using **React (Vite + TypeScript)** with custom CSS animations.

## Project Details
- **Mobile Viewport (< 768px)**: Renders a premium black-red themed branding page with the centered title **"CoffeeWallet"** in white.
- **Desktop Viewport (>= 768px)**: Displays a clean restriction page stating **"only supported in mobile"** along with a mockup QR code for mobile scanning.
- **Interactive Animations**:
  - **Morphing Coffee Blobs**: Two overlapping, organic liquid blobs that morph dynamically and rotate to resemble swirling coffee.
  - **Rising Steam Particles**: Translucent red particles floating from bottom to top to mimic steam rising from a hot drink.

## How to Run the App

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Verification**:
   - On desktop, you will see the **"only supported in mobile"** warning card.
   - Press `F12` to open developer tools, toggle the mobile emulation device mode, and refresh or resize the window to view the centered **CoffeeWallet** mobile screen.
