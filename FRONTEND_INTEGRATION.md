# KALEIDO Frontend Integration Guide

## Auth Architecture
The frontend uses a centralized `AuthContext` to manage the "Drift" state of the traveler.

### State Persistence
- Tokens are stored in `localStorage` under `kaleido_session`.
- Session restoration happens on app mount via `GET /api/auth/me`.

### Visual Triggers
1. **Crystal Shift**: On login, `AuthContext` updates `--user-crystal-color` CSS variable globally.
2. **Lock Fill**: The `LoginPortal` Three.js scene listens to the password input length to visually "fill" the wireframe lock.
3. **Threshold Expansion**: `LoginPortal` uses Framer Motion to expand the UI from the cursor's entry position.

### Navigation Protection
Use the `ProtectedRoute` component in `App.jsx` to guard sensitive areas like the `Locker` or `Workshop`.

```jsx
<Route path="/locker" element={
  <ProtectedRoute>
    <AnchorLocker />
  </ProtectedRoute>
} />
```

### Hook Usage
```jsx
const { user, login, logout, isGuest } = useAuth();
```

## Low-Power Fallback
The `LoginPortal` detects WebGL support. If missing, it swaps the Three.js Canvas for a CSS-based ribbon animation to maintain the "Digital Dream" aesthetic on all devices.
