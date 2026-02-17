# Google Earth Engine Workflow Guide

This guide explains how to use the provided script to analyze forest cover changes.

## Prerequisites
-   A **Google Account**.
-   Access to [Google Earth Engine](https://signup.earthengine.google.com/) (Sign up if you haven't already).

## Step-by-Step Instructions

### 1. Open the Code Editor
Navigate to [https://code.earthengine.google.com/](https://code.earthengine.google.com/) in your browser.

### 2. Load the Script
1.  Open the file `src/gee/forest_change_detection.js` from this project.
2.  Select all text (`Ctrl+A`) and copy it (`Ctrl+C`).
3.  In the GEE Code Editor, paste the code into the center script panel.

### 3. Define Your Area of Interest (AOI)
By default, the script focuses on **Saranda Forest**. To analyze a different area:
1.  Use the **Polygon Tool** (shape icon in the top-left of the map) to draw a shape around your forest.
2.  Rename the created geometry import (top of the script) to `geometry`.
3.  **OR**: Upload a shapefile via the **Assets** tab (left panel) -> **New** -> **Shapefile**, then import it into the script.

### 4. Adjust Dates (Optional)
Look for this section in the code to change the years:
```javascript
var startYearHist = 2000;
var endYearHist = 2005;
var startYearRec = 2020;
var endYearRec = 2024;
```
*Note: We use a 5-year range to ensure we get a "median" image that is free of clouds.*

### 5. Run the Analysis
Click the **Run** button above the code editor.

### 6. View Results
See the **[Results Interpretation Guide](Results_Interpretation_Guide.md)** for detailed instructions on:
- Where to find your maps in the GEE interface
- How to read the NDVI difference map
- How to interpret the AI-classified zones
- How to convert area statistics to square kilometers

## Interpreting Results

### Layers (Right Panel "Layers" tab)
1.  **NDVI 2000**: Vegetation in the historical period.
2.  **NDVI 2023**: Vegetation in the recent period.
3.  **AI-Assisted NDVI Difference**:
    *   **Red/Orange**: Potential **Deforestation** or **Degradation**.
    *   **Green**: Potential **Vegetation Regeneration** or Gain.
    *   **Yellow**: Stable or insignificant change.
4.  **Forest Cover Zones (Classified)**: The AI (K-Means) has segmented the area into 4 classes. You must cross-reference this with the Difference map to label them (e.g., Class 0 = Deforestation, Class 3 = Stable).

### Statistics (Right Panel "Console" tab)
The script calculates the area for each of the change classes.
*   Use these values to quantify the extent of **degradation** vs **regeneration**.
*   (Divide sq meters by 1,000,000 to get sq km).

## Exporting Data
1.  Go to the **Tasks** tab (Right panel).
2.  You will see unsubmitted tasks: `NDVI_Difference_Map` and `AI_Classified_Change_Map`.
3.  Click **Run** next to a task to save the GeoTIFF to your Google Drive.
