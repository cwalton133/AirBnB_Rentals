// Step 9: Create a NavBar component
// src/components/NavBar.tsx

import React from 'react'

interface NavLink {
  text: string;
  href: string;
  active?: boolean;
}

interface NavBarProps {
  brand: string;
  links: NavLink[];
}