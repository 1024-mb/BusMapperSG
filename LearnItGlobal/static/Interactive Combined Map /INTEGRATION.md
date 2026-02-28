# Django Integration Guide for Subway Maps

This guide shows you how to integrate multiple subway maps into different elements on your Django website.

## Quick Start

### Method 1: Using Data Attributes (Recommended - Auto-Load)

Simply add a `div` with the `data-subway-map` attribute in your Django template:

```html
<!-- Purple Line (North-East Line) -->
<div data-subway-map="purple"></div>

<!-- Red Line -->
<div data-subway-map="red"></div>

<!-- Green Line (Circle Line) -->
<div data-subway-map="green"></div>

<!-- Blue Line (Downtown Line) -->
<div data-subway-map="blue"></div>
```

The maps will automatically mount when the page loads!

### Method 2: Using Function Calls (Recommended - Full Control)

For more control, place empty divs and use JavaScript functions to load maps:

```html
<div id="header-map"></div>
<div id="content-map"></div>
<div id="sidebar-map"></div>

<button onclick="SubwayMapController.showMap('header-map', 'purple')">
    Load Purple Line
</button>

<script>
window.addEventListener('load', function() {
    // Load maps on page load
    SubwayMapController.showMap('header-map', 'purple');
    SubwayMapController.showMap('content-map', 'red');
});
</script>
```

### Method 3: Using Specific Container IDs (Legacy)

You can also use the default container ID:

```html
<div id="subway-map-container"></div>
```

This will automatically load the purple line by default.

## Full Django Template Example

```django
{% load static %}
<!DOCTYPE html>
<html>
<head>
    <title>Subway Maps</title>
    <!-- Include the built CSS -->
    <link rel="stylesheet" href="{% static 'subway-maps/index.css' %}">
</head>
<body>
    <div class="container">
        <h1>City Transit System</h1>
        
        <!-- Purple Line Section -->
        <section class="map-section">
            <div data-subway-map="purple"></div>
        </section>
        
        <!-- Red Line Section -->
        <section class="map-section">
            <div data-subway-map="red"></div>
        </section>
        
        <!-- Green Line Section -->
        <section class="map-section">
            <div data-subway-map="green"></div>
        </section>
        
        <!-- Blue Line Section -->
        <section class="map-section">
            <div data-subway-map="blue"></div>
        </section>
    </div>
    
    <!-- Include the built JavaScript -->
    <script type="module" src="{% static 'subway-maps/index.js' %}"></script>
</body>
</html>
```

## Available Map Types

| Map Type | Line Name | Color | Code |
|----------|-----------|-------|------|
| `purple` | North-East Line | #9900aa (Purple) | NE |
| `red` | Red Line | #DD2222 (Red) | RL |
| `green` | Circle Line | #FF9900 (Orange) | CC |
| `blue` | Downtown Line | #0066CC (Blue) | DT |

## Building the Files

1. Run the build command:
```bash
npm run build
# or
pnpm build
```

2. The built files will be in the `/dist` directory:
   - `dist/index.html` (preview file)
   - `dist/index.js` (main JavaScript)
   - `dist/index.css` (styles)
   - `dist/assets/` (any additional assets)

3. Copy these files to your Django static files directory:
```bash
# Example:
cp -r dist/* your-django-project/static/subway-maps/
```

## Django Settings

Make sure your Django `settings.py` includes:

```python
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
```

Then run:
```bash
python manage.py collectstatic
```

## Multiple Maps on One Page

You can have as many maps as you want on a single page:

```html
<div class="row">
    <div class="col-md-6">
        <h2>Purple Line</h2>
        <div data-subway-map="purple"></div>
    </div>
    <div class="col-md-6">
        <h2>Red Line</h2>
        <div data-subway-map="red"></div>
    </div>
</div>
```

## Customizing Station Data

To customize station data, edit `/src/app/mapConfigs.ts`:

```typescript
export const purpleLineConfig: SubwayMapConfig = {
  lineName: 'Your Line Name',
  lineColor: '#9900aa',
  lineCode: 'YL',
  stations: [
    { 
      id: 1, 
      name: 'Station Name', 
      code: 'YL1', 
      position: { x: 100, y: 850 }, 
      connections: ['Next Station'],
      transferLines: ['#FF0000', '#00FF00'] // Optional: for transfer stations
    },
    // ... more stations
  ],
  viewBox: '0 0 1000 900',
  lineStartX: 100,
  lineStartY: 850,
  lineEndX: 925,
  lineEndY: 25,
};
```

Then rebuild the project.

## Styling

The maps are fully responsive. You can add custom CSS to control the size:

```css
[data-subway-map] {
    width: 100%;
    height: 800px;
    margin: 20px 0;
}

/* Smaller maps */
.small-map {
    height: 400px;
}
```

## Troubleshooting

### Maps not showing up?

1. Check browser console for errors
2. Verify the JavaScript file is loaded: `<script type="module" src="..."></script>`
3. Make sure the CSS file is included
4. Check that the container div exists before the script runs

### Different maps showing same data?

Each map instance maintains its own state, but make sure you're using different `data-subway-map` values for each container.

## Advanced: Manual Mounting

If you need more control, you can manually mount maps using JavaScript:

```html
<div id="my-custom-map"></div>

<script type="module">
    import { mountSubwayMap } from './static/subway-maps/index.js';
    
    // Mount a specific map type
    mountSubwayMap('my-custom-map', 'red');
</script>
```

## Function-Based Control

For maximum flexibility, use the `SubwayMapController` functions to programmatically control maps:

### Available Functions

```javascript
// Show a map in a container
SubwayMapController.showMap('container-id', 'purple');

// Hide a map (keeps it in memory)
SubwayMapController.hideMap('container-id');

// Clear/remove a map (unmounts it)
SubwayMapController.clearMap('container-id');

// Switch to a different map
SubwayMapController.switchMap('container-id', 'red');

// Show multiple maps at once
SubwayMapController.showMultipleMaps({
    'map-1': 'purple',
    'map-2': 'red',
    'map-3': 'blue'
});

// Hide multiple maps
SubwayMapController.hideAllMaps(['map-1', 'map-2']);
```

### Django Example with Function Control

```django
{% load static %}
<link rel="stylesheet" href="{% static 'subway-maps/index.css' %}">
<script type="module" src="{% static 'subway-maps/index.js' %}"></script>

<!-- Different map positions -->
<div id="header-map"></div>
<div id="main-content-map"></div>
<div id="sidebar-map"></div>

<!-- Buttons to control maps -->
<button onclick="SubwayMapController.showMap('header-map', 'purple')">
    Show Purple Line
</button>

<button onclick="SubwayMapController.switchMap('main-content-map', 'red')">
    Switch to Red Line
</button>

<script>
    // Load maps on page load
    window.addEventListener('load', function() {
        SubwayMapController.showMap('header-map', 'purple');
        
        {% if user.preferred_line %}
        SubwayMapController.showMap('main-content-map', '{{ user.preferred_line }}');
        {% endif %}
    });
    
    // Custom function
    function loadUserRoute(userId) {
        fetch(`/api/user/${userId}/route/`)
            .then(response => response.json())
            .then(data => {
                SubwayMapController.showMap('sidebar-map', data.line_type);
            });
    }
</script>
```

For complete function reference, see `/FUNCTION_CONTROL_GUIDE.md`.