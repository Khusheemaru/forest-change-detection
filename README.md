# Project 5: AI-Enabled Forest Cover Change Detection

**Project Code**: P5
**Title**: AI-Enabled Forest Cover Change Detection using Multi-temporal NDVI and Machine Learning

## Objective
To detect, quantify, and analyze changes in forest cover over time using multi-temporal Normalized Difference Vegetation Index (NDVI) integrated with Artificial Intelligence (AI) and Machine Learning (ML) techniques, enabling improved identification of forest degradation, deforestation, and vegetation regeneration patterns.

## Study Area
Select a forested region that has experienced noticeable vegetation change due to anthropogenic activities or natural processes.
*   **Examples**: Saranda Forest (Jharkhand), Sundarbans (West Bengal), Aravalli Hills (Rajasthan).
*   **Boundaries**: Download shapefiles from [GADM](https://gadm.org/) or [DIVA-GIS](https://www.diva-gis.org/gdata).

## Data Used
*   **Satellite Imagery**:
    *   Landsat-5 TM or Landsat-7 ETM+ (Historical: 2000–2011)
    *   Landsat-8 OLI (Recent: 2013–2024)
*   **Ancillary Data**:
    *   Area of Interest (AOI) shapefile.
    *   Google Earth imagery for reference/validation.

## Methodology (Google Earth Engine)
This project follows the **AI-Enabled Time-Series Change Analysis** workflow:
1.  **Define AOI**: Use GEE geometry tools or upload a shapefile.
2.  **Load Image Collections**: L5/L7 (Historical) and L8 (Recent) filtered by bounds and date.
3.  **Compute NDVI**:
    *   L5/L7: `(Band 4 - Band 3) / (Band 4 + Band 3)`
    *   L8: `(Band 5 - Band 4) / (Band 5 + Band 4)`
4.  **Calculate Difference**: `NDVI_Recent - NDVI_Historical`
5.  **AI Classification**: Apply K-Means Clustering (Machine Learning) to categorize change zones.
6.  **Visualization & Stats**: Generate maps for Loss, Gain, and Stable zones.

## Directory Structure
```
forest-change-detection/
├── docs/                 # Documentation and guides
│   ├── GEE_Workflow_Guide.md
│   ├── Results_Interpretation_Guide.md
│   └── Study_Areas_Guide.md
├── src/
│   └── gee/              # Source code
│       └── forest_change_detection.js
└── README.md             # This file
```

## Getting Started

1. **Read the Workflow**: See [GEE_Workflow_Guide.md](docs/GEE_Workflow_Guide.md) for setup instructions
2. **Run the Script**: Copy code from `src/gee/forest_change_detection.js` to GEE Code Editor
3. **Interpret Results**: See [Results_Interpretation_Guide.md](docs/Results_Interpretation_Guide.md) for detailed guidance on reading your maps

## Conclusion
AI-enabled NDVI differencing provides a robust and efficient method for detecting forest cover change across time. The integration of Machine Learning-based classification and spatial refinement improves the reliability of identifying deforestation, degradation, and regeneration patterns compared to conventional NDVI thresholding.
