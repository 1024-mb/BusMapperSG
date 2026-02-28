# Multi-Map Subway System - Usage Guide

## Overview

Your subway map system is now configurable and can display multiple different subway lines on the same page or different pages. Each map can have its own color scheme, stations, and transfer points.

## File Structure

```
/src/app/
  ├── components/
  │   └── SubwayMap.tsx         # Main reusable component
  ├── mapConfigs.ts              # All map line configurations
  └── App.tsx                    # Default app (uses purple line)

/src/main.tsx                    # Entry point with multi-map support
/INTEGRATION.md                  # Django integration guide
/public/examples.html            # Live examples of all maps
```

## How It Works

### 1. Component Structure

**SubwayMap.tsx** is now a reusable component that accepts a `config` prop:

```typescript
<SubwayMap config={purpleLineConfig} />
```

### 2. Map Configurations

All map data is stored in **mapConfigs.ts**. Currently includes:

- **Purple Line** (North-East Line) - #9900aa
- **Red Line** - #DD2222
- **Green Line** (Circle Line) - #FF9900
- **Blue Line** (Downtown Line) - #0066CC

### 3. Integration Methods

#### Method A: Data Attributes (Automatic)

The easiest way - just add divs with data attributes:

```html
<!-- Django Template -->
<div data-subway-map="purple"></div>
<div data-subway-map="red"></div>
<div data-subway-map="green"></div>
<div data-subway-map="blue"></div>
```

The script automatically detects these and mounts the correct map.

#### Method B: Manual Mounting

For more control, use JavaScript:

```javascript
import { mountSubwayMap } from './main';

// Mount specific maps
mountSubwayMap('container-id-1', 'purple');
mountSubwayMap('container-id-2', 'red');
```

## Adding a New Map Line

To add a new subway line (e.g., "Yellow Line"):

### Step 1: Add Configuration

Edit `/src/app/mapConfigs.ts`:

```typescript
export const yellowLineConfig: SubwayMapConfig = {
  lineName: 'Yellow Line',
  lineColor: '#FFD700',
  lineCode: 'YL',
  stations: [
    { 
      id: 1, 
      name: 'First Station', 
      code: 'YL1', 
      position: { x: 100, y: 850 }, 
      connections: ['Second Station'],
      transferLines: ['#9900aa'] // Optional: connects to purple line
    },
    { 
      id: 2, 
      name: 'Second Station', 
      code: 'YL2', 
      position: { x: 175, y: 775 }, 
      connections: ['First Station', 'Third Station']
    },
    // ... more stations (you need 12 total)
  ],
  viewBox: '0 0 1000 900',
  lineStartX: 100,
  lineStartY: 850,
  lineEndX: 925,
  lineEndY: 25,
};
```

### Step 2: Register in Main

Edit `/src/main.tsx`:

```typescript
import { yellowLineConfig } from './app/mapConfigs';

const mapConfigs = {
  purple: purpleLineConfig,
  red: redLineConfig,
  green: greenLineConfig,
  blue: blueLineConfig,
  yellow: yellowLineConfig,  // Add this
};
```

### Step 3: Use It

```html
<div data-subway-map="yellow"></div>
```

## Customization Options

### Station Properties

Each station can have:

- `id`: Unique identifier
- `name`: Display name
- `code`: Station code (e.g., "NE1", "RL5")
- `position`: { x, y } coordinates on the SVG
- `connections`: Array of connected station names
- `transferLines`: (Optional) Array of hex colors for transfer lines

### Map Properties

Each map configuration includes:

- `lineName`: Display name
- `lineColor`: Hex color code
- `lineCode`: Short code for the line
- `stations`: Array of 12 stations
- `viewBox`: SVG viewBox dimensions
- `lineStartX/Y`: Starting point of the line
- `lineEndX/Y`: Ending point of the line

### Visual Customization

To change the visual style, edit `SubwayMap.tsx`:

- Station circle size: `r={10}` (radius)
- Line thickness: `strokeWidth="10"`
- Colors: All use the `lineColor` from config
- Hover/selected states: Modify the circle radius conditionals

## Position Calculation

For a diagonal line from bottom-left to top-right with 12 evenly spaced stations:

```javascript
const spacing = 75; // pixels between stations
for (let i = 0; i < 12; i++) {
  const x = 100 + (i * spacing);
  const y = 850 - (i * spacing);
  // position: { x, y }
}
```

## Building for Production

### Development
```bash
npm run dev
# Visit: http://localhost:5173/public/examples.html
```

### Production Build
```bash
npm run build
```

Output in `/dist`:
- `index.html` - Preview file
- `index.js` - Bundled JavaScript
- `index.css` - Bundled styles
- `assets/` - Additional files

### Deploy to Django

1. Copy built files:
```bash
cp -r dist/* /path/to/django/static/subway-maps/
```

2. In Django template:
```django
{% load static %}
<link rel="stylesheet" href="{% static 'subway-maps/index.css' %}">
<script type="module" src="{% static 'subway-maps/index.js' %}"></script>
```

3. Run collectstatic:
```bash
python manage.py collectstatic
```

## Examples

### Single Map Page

```html
<div class="container">
  <h1>Purple Line Schedule</h1>
  <div data-subway-map="purple"></div>
</div>
```

### Multiple Maps Page

```html
<div class="container">
  <div class="row">
    <div class="col-6">
      <h2>Northbound</h2>
      <div data-subway-map="purple"></div>
    </div>
    <div class="col-6">
      <h2>Southbound</h2>
      <div data-subway-map="red"></div>
    </div>
  </div>
</div>
```

### Tabbed Interface

```html
<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" data-bs-toggle="tab" href="#purple">Purple Line</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" data-bs-toggle="tab" href="#red">Red Line</a>
  </li>
</ul>

<div class="tab-content">
  <div id="purple" class="tab-pane active">
    <div data-subway-map="purple"></div>
  </div>
  <div id="red" class="tab-pane">
    <div data-subway-map="red"></div>
  </div>
</div>
```

## Troubleshooting

**Maps not appearing?**
- Check browser console for errors
- Verify the script is type="module"
- Ensure CSS is loaded
- Check container IDs/data attributes

**Wrong map showing?**
- Verify the `data-subway-map` attribute value
- Check that the map type is registered in `mapConfigs`

**Transfer stations not showing colors?**
- Verify `transferLines` array has valid hex colors
- Check that colors are in format: `#RRGGBB`

## Support

For questions or issues:
1. Check the examples: `/public/examples.html`
2. Review integration guide: `/INTEGRATION.md`
3. Inspect the map configs: `/src/app/mapConfigs.ts`
