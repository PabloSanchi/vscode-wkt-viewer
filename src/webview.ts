export const getWebviewContent = () => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WKT Viewer</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: #1a1a1a;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #map { 
            width: 100%; 
            height: calc(100vh - 60px);
            background: #1a1a1a; 
        }
        #controls {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px 20px;
            background: #242424;
            display: flex;
            gap: 10px;
            align-items: center;
            height: 40px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
        }
        #wkt-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #404040;
            border-radius: 4px;
            background: #2a2a2a;
            color: #fff;
            font-size: 14px;
        }
        #wkt-input:focus {
            outline: none;
            border-color: #666;
        }
        #add-btn, #clear-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }
        #add-btn {
            background: #404040;
        }
        #add-btn:hover {
            background: #505050;
        }
        #clear-btn {
            background: #662222;
        }
        #clear-btn:hover {
            background: #883333;
        }
        .leaflet-control-attribution { 
            font-size: 8px; 
            background: rgba(0,0,0,0.6) !important;
            color: #666 !important;
        }
        .leaflet-bar a {
            background: #2a2a2a !important;
            color: #fff !important;
            border: 1px solid #404040 !important;
        }
        .leaflet-bar a:hover {
            background: #404040 !important;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="controls">
        <input type="text" id="wkt-input" placeholder="Enter WKT string...">
        <button id="add-btn">Add to Map</button>
        <button id="clear-btn">Clear All</button>
    </div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        const vscode = acquireVsCodeApi();
        const layers = new Map();
        let layerCount = 0;

        const map = L.map('map', {
            zoomControl: true,
            attributionControl: false
        }).setView([0, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap, © CARTO'
        }).addTo(map);

        function getRandomColor() {
            const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff8000', '#0080ff'];
            return colors[layerCount % colors.length];
        }

        function addWKTToMap(wktData, color = getRandomColor()) {
            const layerId = 'layer-' + layerCount++;
            
            const layer = L.geoJSON(wktData, {
                style: {
                    color: color,
                    weight: 3,
                    opacity: 0.8,
                    fillOpacity: 0.2,
                    fillColor: color
                },
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, {
                        radius: 6,
                        fillColor: color,
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                }
            }).addTo(map);

            layers.set(layerId, layer);

            if (layers.size === 1) {
                const bounds = layer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [20, 20] });
                }
            }

            return layerId;
        }

        document.getElementById('add-btn').addEventListener('click', () => {
            const input = document.getElementById('wkt-input');
            const wktString = input.value.trim();
            
            if (wktString) {
                vscode.postMessage({
                    type: 'parseWKT',
                    data: wktString
                });
                input.value = '';
            }
        });

        document.getElementById('wkt-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('add-btn').click();
            }
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            layers.forEach(layer => map.removeLayer(layer));
            layers.clear();
            layerCount = 0;
        });

        window.addEventListener('message', event => {
            const { type, data } = event.data;
            if (type === 'updateMap') {
                addWKTToMap(data);
            }
        });
    </script>
</body>
</html>`;