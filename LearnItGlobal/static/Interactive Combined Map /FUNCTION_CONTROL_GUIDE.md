# Function-Controlled Maps Guide

## Available Functions

All functions are available via the global `SubwayMapController` object:

### 1. `showMap(containerId, mapType)`

Show a map in a specific container.

```javascript
SubwayMapController.showMap('my-container', 'purple');
```

**Parameters:**
- `containerId` (string): The ID of the HTML element
- `mapType` (string): 'purple', 'red', 'green', or 'blue'

**HTML:**
```html
<div id="my-container"></div>
<button onclick="SubwayMapController.showMap('my-container', 'purple')">
    Show Purple Line
</button>
```

---

### 2. `hideMap(containerId)`

Hide a map container (doesn't remove the map, just hides it).

```javascript
SubwayMapController.hideMap('my-container');
```

**HTML:**
```html
<button onclick="SubwayMapController.hideMap('my-container')">
    Hide Map
</button>
```

---

### 3. `clearMap(containerId)`

Completely remove/unmount a map from the container.

```javascript
SubwayMapController.clearMap('my-container');
```

**HTML:**
```html
<button onclick="SubwayMapController.clearMap('my-container')">
    Clear Map
</button>
```

---

### 4. `switchMap(containerId, mapType)`

Switch to a different map in the same container (clears the old map first).

```javascript
SubwayMapController.switchMap('my-container', 'red');
```

**HTML:**
```html
<button onclick="SubwayMapController.switchMap('my-container', 'purple')">Purple</button>
<button onclick="SubwayMapController.switchMap('my-container', 'red')">Red</button>
<button onclick="SubwayMapController.switchMap('my-container', 'green')">Green</button>
<button onclick="SubwayMapController.switchMap('my-container', 'blue')">Blue</button>
```

---

### 5. `showMultipleMaps(containerMap)`

Show multiple maps at once.

```javascript
SubwayMapController.showMultipleMaps({
    'container-1': 'purple',
    'container-2': 'red',
    'container-3': 'green'
});
```

**HTML:**
```html
<div id="container-1"></div>
<div id="container-2"></div>
<div id="container-3"></div>

<button onclick="SubwayMapController.showMultipleMaps({
    'container-1': 'purple',
    'container-2': 'red',
    'container-3': 'green'
})">Show All Maps</button>
```

---

### 6. `hideAllMaps(containerIds)`

Hide multiple map containers at once.

```javascript
SubwayMapController.hideAllMaps(['container-1', 'container-2', 'container-3']);
```

**HTML:**
```html
<button onclick="SubwayMapController.hideAllMaps(['container-1', 'container-2'])">
    Hide All Maps
</button>
```

---

## Common Patterns

### Pattern 1: Tab Navigation

```html
<div class="tabs">
    <button onclick="switchTab('purple')">Purple Line</button>
    <button onclick="switchTab('red')">Red Line</button>
    <button onclick="switchTab('green')">Circle Line</button>
    <button onclick="switchTab('blue')">Downtown Line</button>
</div>

<div id="map-display"></div>

<script>
function switchTab(mapType) {
    SubwayMapController.switchMap('map-display', mapType);
}
</script>
```

---

### Pattern 2: Dropdown Selection

```html
<select id="line-selector" onchange="handleLineChange()">
    <option value="">-- Select a line --</option>
    <option value="purple">Purple Line</option>
    <option value="red">Red Line</option>
    <option value="green">Circle Line</option>
    <option value="blue">Downtown Line</option>
</select>

<div id="map-display"></div>

<script>
function handleLineChange() {
    const selector = document.getElementById('line-selector');
    const mapType = selector.value;
    
    if (mapType) {
        SubwayMapController.showMap('map-display', mapType);
    } else {
        SubwayMapController.clearMap('map-display');
    }
}
</script>
```

---

### Pattern 3: Toggle Visibility

```html
<div id="map-container">
    <div id="my-map"></div>
</div>

<button onclick="toggleMap()">Toggle Map</button>

<script>
let isMapVisible = false;

function toggleMap() {
    if (isMapVisible) {
        SubwayMapController.hideMap('my-map');
    } else {
        SubwayMapController.showMap('my-map', 'purple');
    }
    isMapVisible = !isMapVisible;
}
</script>
```

---

### Pattern 4: Side-by-Side Comparison

```html
<div class="container">
    <div class="row">
        <div class="col">
            <h3>Route A</h3>
            <div id="map-a"></div>
        </div>
        <div class="col">
            <h3>Route B</h3>
            <div id="map-b"></div>
        </div>
    </div>
</div>

<button onclick="compareRoutes('purple', 'red')">Compare Purple vs Red</button>
<button onclick="compareRoutes('green', 'blue')">Compare Circle vs Downtown</button>

<script>
function compareRoutes(mapA, mapB) {
    SubwayMapController.showMultipleMaps({
        'map-a': mapA,
        'map-b': mapB
    });
}
</script>
```

---

### Pattern 5: Load on Button Click

```html
<div id="header-map" style="display: none;"></div>
<div id="footer-map" style="display: none;"></div>

<button onclick="loadHeaderMap()">Show Header Map</button>
<button onclick="loadFooterMap()">Show Footer Map</button>

<script>
function loadHeaderMap() {
    document.getElementById('header-map').style.display = 'block';
    SubwayMapController.showMap('header-map', 'purple');
}

function loadFooterMap() {
    document.getElementById('footer-map').style.display = 'block';
    SubwayMapController.showMap('footer-map', 'blue');
}
</script>
```

---

### Pattern 6: AJAX/Dynamic Loading (Django)

```html
<div id="dynamic-map"></div>

<script>
// Load map based on AJAX response
fetch('/api/get-route-info/')
    .then(response => response.json())
    .then(data => {
        SubwayMapController.showMap('dynamic-map', data.map_type);
    });

// Or with user interaction
function loadUserRoute(userId) {
    fetch(`/api/users/${userId}/preferred-route/`)
        .then(response => response.json())
        .then(data => {
            SubwayMapController.showMap('dynamic-map', data.line_color);
        });
}
</script>
```

---

## Django Integration

### In your Django template:

```django
{% load static %}

<!-- Include the scripts -->
<link rel="stylesheet" href="{% static 'subway-maps/index.css' %}">
<script type="module" src="{% static 'subway-maps/index.js' %}"></script>

<!-- Multiple containers at different positions -->
<div id="header-map"></div>

<div class="content">
    <div id="main-map"></div>
</div>

<div id="sidebar-map"></div>

<script>
    window.addEventListener('load', function() {
        // Position 1: Header
        SubwayMapController.showMap('header-map', 'purple');
        
        // Position 2: Main content (controlled by Django variable)
        {% if user.preferred_line %}
        SubwayMapController.showMap('main-map', '{{ user.preferred_line }}');
        {% endif %}
        
        // Position 3: Sidebar (on button click)
        // Will be loaded by user interaction
    });
    
    function loadSidebarMap() {
        SubwayMapController.showMap('sidebar-map', 'red');
    }
</script>
```

---

## Complete Django Example

```django
{% load static %}
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="{% static 'subway-maps/index.css' %}">
    <style>
        .map-section { 
            margin: 20px 0; 
            padding: 20px; 
            background: white; 
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <!-- Section 1: Always visible -->
    <div class="map-section">
        <h2>Main Transit Line</h2>
        <div id="main-transit-map"></div>
    </div>

    <!-- Section 2: Loaded on demand -->
    <div class="map-section">
        <h2>Alternative Routes</h2>
        <button onclick="loadAlternative()">Show Alternative Routes</button>
        <div id="alternative-map"></div>
    </div>

    <!-- Section 3: User selection -->
    <div class="map-section">
        <h2>Your Route</h2>
        <select id="user-route" onchange="loadUserRoute()">
            <option value="">Select your route</option>
            {% for route in available_routes %}
            <option value="{{ route.map_type }}">{{ route.name }}</option>
            {% endfor %}
        </select>
        <div id="user-route-map"></div>
    </div>

    <script type="module" src="{% static 'subway-maps/index.js' %}"></script>
    <script>
        // Load main map on page load
        window.addEventListener('load', () => {
            SubwayMapController.showMap('main-transit-map', 'purple');
        });

        function loadAlternative() {
            SubwayMapController.showMap('alternative-map', 'red');
        }

        function loadUserRoute() {
            const select = document.getElementById('user-route');
            const mapType = select.value;
            if (mapType) {
                SubwayMapController.showMap('user-route-map', mapType);
            }
        }
    </script>
</body>
</html>
```

---

## Tips

1. **Container IDs must be unique** - Each container needs a unique ID
2. **Wait for page load** - Use `window.addEventListener('load', ...)` to ensure the DOM is ready
3. **Display control** - You can use CSS `display: none` to hide containers initially
4. **Performance** - Use `switchMap()` instead of `showMap()` when changing maps in the same container
5. **Cleanup** - Use `clearMap()` to properly unmount maps and free memory
