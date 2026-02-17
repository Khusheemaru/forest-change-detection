# Study Areas Configuration Guide

This document provides details about the three pre-configured study areas in the GEE script.

## Available Study Areas

### 1. Saranda Forest, Jharkhand (Default)
- **Location**: Eastern India
- **Coordinates**: 85.15°E, 22.10°N
- **Characteristics**: Dense Sal forests, tribal region
- **Known Changes**: Mining activities, deforestation
- **Buffer Size**: 15 km radius (~707 km²)

### 2. Sundarbans, West Bengal
- **Location**: Coastal West Bengal/Bangladesh border
- **Coordinates**: 88.80°E, 21.95°N
- **Characteristics**: Mangrove forests, UNESCO World Heritage Site
- **Known Changes**: Erosion, cyclone damage, sea-level rise impacts
- **Buffer Size**: 20 km radius (~1,257 km²)

### 3. Aravalli Hills, Rajasthan
- **Location**: Northwestern India
- **Coordinates**: 73.70°E, 25.50°N
- **Characteristics**: Ancient fold mountains, semi-arid forests
- **Known Changes**: Mining, urbanization, afforestation efforts
- **Buffer Size**: 20 km radius (~1,257 km²)

## How to Switch Between Study Areas

Open `src/gee/forest_change_detection.js` and find the **AOI SETUP** section (around lines 13-32).

**To analyze Saranda Forest** (Default):
```javascript
var selectedAOI = sarandaForest;        // Default: Saranda Forest
// var selectedAOI = sundarbans;        // Uncomment for Sundarbans
// var selectedAOI = aravalliHills;     // Uncomment for Aravalli Hills
```

**To analyze Sundarbans**:
```javascript
// var selectedAOI = sarandaForest;     // Default: Saranda Forest
var selectedAOI = sundarbans;           // Uncomment for Sundarbans
// var selectedAOI = aravalliHills;     // Uncomment for Aravalli Hills
```

**To analyze Aravalli Hills**:
```javascript
// var selectedAOI = sarandaForest;     // Default: Saranda Forest
// var selectedAOI = sundarbans;        // Uncomment for Sundarbans
var selectedAOI = aravalliHills;        // Uncomment for Aravalli Hills
```

## Using Your Own Shapefile

If you have a shapefile for any of these areas:
1. Upload it to GEE Assets
2. Import it as `geometry`
3. The script will automatically use your custom boundary instead of the default buffer

## Adjusting the Analysis Area

To expand or reduce the study area, modify the buffer size:
```javascript
var sarandaForest = ee.Geometry.Point([85.15, 22.10]).buffer(25000).bounds(); // 25km radius
```
