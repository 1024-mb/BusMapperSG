# Quick Start: Function-Controlled Maps

## TL;DR - Three Simple Ways to Use Maps

### Method 1: Auto-Load with Data Attributes (Easiest)
```html
<div data-subway-map="purple"></div>
<div data-subway-map="red"></div>
```
Maps automatically load when page loads. No JavaScript needed!

---

### Method 2: Function Calls (Most Control)
```html
<div id="my-map"></div>
<button onclick="SubwayMapController.showMap('my-map', 'purple')">
    Show Map
</button>
```

---

### Method 3: JavaScript Control (Dynamic)
```html
<div id="dynamic-map"></div>

<script>
window.addEventListener('load', () => {
    SubwayMapController.showMap('dynamic-map', 'purple');
});
</script>
```

---

## All Available Functions

```javascript
// Show a map
SubwayMapController.showMap('container-id', 'purple');

// Hide a map (keeps it in memory)
SubwayMapController.hideMap('container-id');

// Clear/unmount a map (removes from memory)
SubwayMapController.clearMap('container-id');

// Switch to different map
SubwayMapController.switchMap('container-id', 'red');

// Show multiple maps at once
SubwayMapController.showMultipleMaps({
    'map-1': 'purple',
    'map-2': 'red',
    'map-3': 'blue'
});

// Hide multiple maps
SubwayMapController.hideAllMaps(['map-1', 'map-2', 'map-3']);
```

---

## Map Types Available

- `'purple'` - North-East Line (#9900aa)
- `'red'` - Red Line (#DD2222)
- `'green'` - Circle Line (#FF9900 / Orange)
- `'blue'` - Downtown Line (#0066CC)

---

## Common Examples

### Example 1: Button Triggered
```html
<div id="map1"></div>
<button onclick="SubwayMapController.showMap('map1', 'purple')">Load Map</button>
```

### Example 2: Dropdown Selection
```html
<select id="selector" onchange="handleChange()">
    <option value="purple">Purple Line</option>
    <option value="red">Red Line</option>
</select>
<div id="map2"></div>

<script>
function handleChange() {
    const type = document.getElementById('selector').value;
    SubwayMapController.showMap('map2', type);
}
</script>
```

### Example 3: Tab Navigation
```html
<button onclick="SubwayMapController.switchMap('map3', 'purple')">Purple</button>
<button onclick="SubwayMapController.switchMap('map3', 'red')">Red</button>
<div id="map3"></div>
```

### Example 4: Multiple Positions
```html
<!-- Header -->
<div id="header-map"></div>

<!-- Main Content -->
<div id="content-map"></div>

<!-- Sidebar -->
<div id="sidebar-map"></div>

<script>
window.addEventListener('load', () => {
    SubwayMapController.showMap('header-map', 'purple');
    SubwayMapController.showMap('content-map', 'red');
    SubwayMapController.showMap('sidebar-map', 'blue');
});
</script>
```

---

## Django Integration

### In your template:
```django
{% load static %}
<link rel="stylesheet" href="{% static 'subway-maps/index.css' %}">
<script type="module" src="{% static 'subway-maps/index.js' %}"></script>

<!-- Map containers at different positions -->
<div id="position-1"></div>
<div id="position-2"></div>
<div id="position-3"></div>

<script>
window.addEventListener('load', () => {
    // Load maps based on Django context
    {% if show_purple %}
    SubwayMapController.showMap('position-1', 'purple');
    {% endif %}
    
    {% if show_red %}
    SubwayMapController.showMap('position-2', 'red');
    {% endif %}
});

// Or load on user action
function loadUserMap(position, type) {
    SubwayMapController.showMap(position, type);
}
</script>
```

---

## Live Examples

Check out these example files:

1. **`/public/function-controlled.html`** - Complete demo with all controls
2. **`/public/positions-demo.html`** - Maps at different page positions
3. **`/public/django-example.html`** - Django template examples

---

## Build & Deploy

1. **Build:**
   ```bash
   npm run build
   ```

2. **Copy to Django:**
   ```bash
   cp -r dist/* /path/to/django/static/subway-maps/
   ```

3. **Collect Static:**
   ```bash
   python manage.py collectstatic
   ```

---

## Troubleshooting

**Maps not showing?**
- Check browser console for errors
- Ensure `SubwayMapController` is defined (should be available after page load)
- Verify container IDs are unique and exist in the DOM

**Wrong map showing?**
- Check the map type: 'purple', 'red', 'green', or 'blue' (lowercase)
- Use browser dev tools to inspect which map is loaded

**Multiple maps conflicting?**
- Make sure each container has a unique ID
- Use `switchMap()` instead of `showMap()` when changing maps in same container

---

## Need More Help?

- **Full function reference:** `/FUNCTION_CONTROL_GUIDE.md`
- **Django integration:** `/INTEGRATION.md`
- **Map customization:** `/USAGE_GUIDE.md`
