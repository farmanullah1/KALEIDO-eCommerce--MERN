# KALEIDO Design System: Anisotropic 3D Experience

This document outlines the visual identity and interaction logic for the KALEIDO project, focusing on its unique "Anisotropic 3D" aesthetic.

## 🎨 Color Palette

The KALEIDO palette is anchored in a deep, cosmic void, punctuated by vibrant, luminous accents that simulate light refraction and heat.

### Core Colors
| Token | Hex | Description |
| :--- | :--- | :--- |
| **Deep Ink Black** | `#0E131F` | The foundation of the experience. Provides an infinite void for luminosity. |
| **Coral Ember** | `#F5A97F` | The primary heat source. Used for critical CTAs and brand identifiers. |
| **Cyber Cyan** | `#00ECFB` | Used for secondary interactions and status indicators. |
| **Neon Violet** | `#C8BFFF` | Often paired with Cyber Cyan as gradients to simulate light refraction. |
| **Hot Magenta** | `#FF00FF` | A high-alert accent used sparingly for notifications or rare product tiers. |

### Surface Strategy
- **Frosted Glass:** Use semi-transparent overlays of neutral tones with high backdrop blur.
- **Light catching:** Surfaces maintain high saturation of the colors beneath when blurred.

## 🧊 3D & Anisotropic Logic

The "Anisotropic 3D" philosophy treats the UI as a physical yet ethereal environment where surfaces react non-uniformly to light and perspective.

### 1. Volumetric Lighting & Glows
- **Underglows:** High-priority elements cast a soft, colored "underglow" (15% opacity, 100px blur) using the primary color.
- **Rim Lights:** Surfaces feature a 1px inner border (stroke) using semi-transparent Cyber Cyan or Coral Ember to simulate light catching the edge of a glass pane.

### 2. Z-Axis & Elevation
- **Floating Planes:** UI elements are treated as translucent "machined glass plates" suspended in a 3D void.
- **Interactive Lift:** On hover, elements physically lift (`translateY`) and increase their backdrop blur intensity, suggesting movement toward the user.
- **Pedestals:** Products are displayed on "floating pedestals"—translucent planes that cast real-time shadows onto the Deep Ink Black background.

### 3. Glassmorphism
- **Backdrop Blur:** Ranges from **30px to 60px** depending on the elevation layer.
- **Gradient Strokes:** Use Cyber Cyan to Neon Violet gradients on strokes to simulate anisotropic light refraction across edges.

## 📐 Shape & Structure
- **Soft-Industrial:** Precision-engineered feel with a base roundedness of **4px** for buttons/inputs.
- **Floating Containers:** Larger planes use **12px** rounded corners to soften the silhouette.
- **Architectural Typography:** Headlines use *Space Grotesk* with heavy weights and aggressive negative kerning to feel like structural elements.
