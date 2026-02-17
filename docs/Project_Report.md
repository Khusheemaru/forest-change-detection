# Project 5: AI-Enabled Forest Cover Change Detection

## 1. Objective
To detect, quantify, and analyze changes in forest cover over time using multi-temporal Normalized Difference Vegetation Index (NDVI) integrated with Artificial Intelligence (AI) and Machine Learning (ML) techniques. This project aims to identify patterns of **deforestation**, **forest degradation**, and **vegetation regeneration**.

## 2. Study Area
**Name**: Saranda Forest
**Location**: West Singhbhum District, Jharkhand, India (Coordinates: 85.15°E, 22.10°N)
**Select Area**: Approx. 700 km² buffer zone.

<img width="1158" height="516" alt="image" src="https://github.com/user-attachments/assets/7ff2db58-2795-47d4-b87b-048f9b51ffdf" />


## 3. Data Used

| Data Type | Satellite / Sensor | Date Range | Bands Used | Source |
| :--- | :--- | :--- | :--- | :--- |
| **Historical Imagery** | Landsat 5 TM | 1999 - 2002 | Band 4 (NIR), Band 3 (Red) | [USGS Earth Explorer](https://earthexplorer.usgs.gov/) / GEE |
| **Recent Imagery** | Landsat 8 OLI | 2022 - 2024 | Band 5 (NIR), Band 4 (Red) | [USGS Earth Explorer](https://earthexplorer.usgs.gov/) / GEE |

## 4. Methodology

This project utilizes a **Google Earth Engine (GEE)** cloud-based workflow for efficient processing of multi-temporal satellite data.

### Step 1: Data Acquisition & Preprocessing
- Loaded Landsat 5 (Historical) and Landsat 8 (Recent) Surface Reflectance collections.
- Filtered by:
  - **Date**: 1999-2002 (Hist) and 2022-2024 (Rec) to ensure cloud-free median composites.
  - **Cloud Cover**: < 20%.
- Applied Cloud Masking using `QA_PIXEL` band to remove clouds and shadows.
- Clipped imagery to the Saranda Forest AOI.

**Code Snippet (Filtering Logic):**
```javascript
// Example: Filtering Landsat 5 Collection
var l5Col = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
    .filterBounds(aoi)                           // 1. Filter by Location
    .filterDate('1999-01-01', '2002-12-31')      // 2. Filter by Date
    .filter(ee.Filter.lt('CLOUD_COVER', 20));    // 3. Filter by Cloud Cover
```


### Step 2: NDVI Calculation
Calculated the Normalized Difference Vegetation Index (NDVI) for both time periods to quantify vegetation health.
**Formula**:  
`NDVI = (NIR - Red) / (NIR + Red)`

### Step 3: Change Detection
Computed the difference between the recent and historical NDVI to identify change intensity.
**Formula**:  
`NDVI_Change = NDVI_Recent - NDVI_Historical`

```javascript
var ndvi_diff = ndvi2023.subtract(ndvi2000).rename('NDVI_Change');
```

### Step 4: AI-Based Classification
Applied **Unsupervised Machine Learning (K-Means Clustering)** to segment the `NDVI_Change` map into 4 distinct classes:
- **Deforestation** (Significant negative change)
- **Degradation** (Minor negative change)
- **Stable** (No significant change)
- **Regeneration** (Positive change)

## 5. Results

### Maps
1.  **NDVI Difference Map**:  

    - **Red Areas**: Indicate vegetation loss.
    - **Green Areas**: Indicate vegetation gain.
    - **Yellow Areas**: Indicate stable forest.

<img width="1362" height="773" alt="image" src="https://github.com/user-attachments/assets/c166dbbd-cb8c-438d-82e9-668f297b51d1" />

2.  **Classified Change Zones**:  
<img width="1343" height="762" alt="image" src="https://github.com/user-attachments/assets/fb7c1d5a-535f-481e-b717-af47926280f4" />


### Area Statistics
The AI analysis yielded the following area estimates for the change classes:

| Class ID | Interpretation | Area (sq km) | Percentage |
| :--- | :--- | :--- | :--- |
| **Class 0** | **Stable/Minor Change** | ~19.78 km² | 5.0% |
| **Class 1** | **Degradation/Loss** | ~177.20 km² | 44.7% |
| **Class 2** | **Stable/Dense Forest** | ~135.10 km² | 34.1% |
| **Class 3** | **Regeneration** | ~64.63 km² | 16.3% |

**Total Analyzed Area**: ~396.71 km²

*Note: Class interpretations may vary slightly based on specific clustering runs; always cross-verify with visual maps.*

## 6. Conclusion
The AI-enabled NDVI differencing method successfully identified significant changes in the Saranda Forest region over the two-decade period. 

**Effectiveness**:
- The **Machine Learning (K-Means)** approach was effective in automatically segregating complex change patterns that simple thresholding might miss.
- **Google Earth Engine** allowed for rapid processing of multi-year composites, significantly reducing the impact of cloud cover compared to single-image analysis.

**Observations**:
- A substantial portion of the area (~44%) showed signs of degradation or loss, likely attributed to mining activities known in the region.
- However, regeneration (~16%) was also observed, indicating potential recovery or afforestation efforts.

**Limitations**:
- The unsupervised classification requires manual interpretation of classes.
- Seasonal phenology differences (if image dates aren't perfectly matched) can introduce noise.
