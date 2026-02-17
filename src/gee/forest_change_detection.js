/**
 * @name Project P5: AI-Enabled Forest Cover Change Detection
 * @description
 * Project Code: P5
 * Title: AI-Enabled Forest Cover Change Detection using Multi-temporal NDVI and Machine Learning
 * Objective: To detect, quantify, and analyze changes in forest cover over time using 
 * multi-temporal NDVI and AI/ML techniques.
 * 
 * Study Area Examples: Saranda Forest, Sundarbans, Aravalli Hills.
 * Data Used: Landsat 5/7 (Historical) and Landsat 8 (Recent).
 * Note: Collection 2 Surface Reflectance uses SR_B prefix (SR_B3, SR_B4, SR_B5).
 */

// ============================================================================================
// 1. AREA OF INTEREST (AOI) SETUP
// ============================================================================================
// OPTION 1: Saranda Forest, Jharkhand (Default)
var sarandaForest = ee.Geometry.Point([85.15, 22.10]).buffer(15000).bounds();

// OPTION 2: Sundarbans, West Bengal
var sundarbans = ee.Geometry.Point([88.80, 21.95]).buffer(20000).bounds();

// OPTION 3: Aravalli Hills, Rajasthan
var aravalliHills = ee.Geometry.Point([73.70, 25.50]).buffer(20000).bounds();

// SELECT YOUR STUDY AREA (uncomment one):
var selectedAOI = sarandaForest;        // Default: Saranda Forest
// var selectedAOI = sundarbans;        // Uncomment for Sundarbans
// var selectedAOI = aravalliHills;     // Uncomment for Aravalli Hills

// Use custom geometry if drawn, otherwise use selected area
var aoi = typeof geometry !== 'undefined' ? geometry : selectedAOI;
Map.centerObject(aoi, 10);
Map.addLayer(aoi, {color: 'yellow'}, 'Study Area Boundary', true);

// ============================================================================================
// 2. PARAMETERS & CONFIGURATION
// ============================================================================================
// Matching guidelines: Historical (~2000) vs Recent (~2023)
// Using multi-year ranges to ensure sufficient cloud-free images
var startYearHist = 1999;
var endYearHist = 2002; 
var startYearRec = 2022;
var endYearRec = 2024;

// Note: We use Landsat Collection 2 (C02) as Collection 1 (C01) is decommissioned.
var cloudThreshold = 20; 

// Visualization parameters
var ndviVis = {min: -0.2, max: 0.8, palette: ['blue', 'white', 'green', 'darkgreen']};
var changeVis = {min: -0.5, max: 0.5, palette: ['red', 'orange', 'yellow', 'green', 'darkgreen']};

// ============================================================================================
// 3. FUNCTIONS: CLOUD MASKING & NDVI
// ============================================================================================

// Cloud masking for Landsat 5/7 (C02)
function maskL57sr(image) {
  var qa = image.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1 << 3).eq(0)  // Cloud
             .and(qa.bitwiseAnd(1 << 4).eq(0)); // Cloud Shadow
  return image.updateMask(mask).clip(aoi);
}

// Cloud masking for Landsat 8 (C02)
function maskL8sr(image) {
  var qa = image.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1 << 3).eq(0)
             .and(qa.bitwiseAnd(1 << 4).eq(0));
  return image.updateMask(mask).clip(aoi);
}

// NDVI for Landsat 5/7: Band 4 (NIR), Band 3 (Red)
function addNDVI_L57(image) {
  var ndvi = image.normalizedDifference(['SR_B4', 'SR_B3']).rename('NDVI');
  return image.addBands(ndvi);
}

// NDVI for Landsat 8: Band 5 (NIR), Band 4 (Red)
function addNDVI_L8(image) {
  var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// ============================================================================================
// 4. DATA PROCESSING (Step 2 & 3)
// ============================================================================================

// --- Historical (Landsat 5) ---
var colHist = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
    .filterBounds(aoi)
    .filterDate(startYearHist + '-01-01', endYearHist + '-12-31')
    .filter(ee.Filter.lt('CLOUD_COVER', cloudThreshold))
    .map(maskL57sr)
    .map(addNDVI_L57);

var image2000 = colHist.median();
var ndvi2000 = image2000.select('NDVI');

// Debug: Check if we have images
print('Historical Collection Size:', colHist.size());
print('Historical Date Range:', startYearHist, '-', endYearHist);

// --- Recent (Landsat 8) ---
var colRec = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(aoi)
    .filterDate(startYearRec + '-01-01', endYearRec + '-12-31')
    .filter(ee.Filter.lt('CLOUD_COVER', cloudThreshold))
    .map(maskL8sr)
    .map(addNDVI_L8);

var image2023 = colRec.median();
var ndvi2023 = image2023.select('NDVI');

// Debug: Check if we have images
print('Recent Collection Size:', colRec.size());
print('Recent Date Range:', startYearRec, '-', endYearRec);

// ============================================================================================
// 5. CHANGE DETECTION (Step 4 & 5)
// ============================================================================================

// Calculate NDVI Difference (Step 4)
var ndvi_diff = ndvi2023.subtract(ndvi2000).rename('NDVI_Change');

// AI-Based Classification (Step 5)
// Using K-Means Clustering to categorize vegetation change zones.
var training = ndvi_diff.sample({
  region: aoi,
  scale: 30,
  numPixels: 5000
});

// Train Clusterer (4 classes: e.g., Loss, Stable, Gain, etc.)
var clusterer = ee.Clusterer.wekaKMeans(4).train(training);
var classified = ndvi_diff.cluster(clusterer).rename('Change_Class');

// ============================================================================================
// 6. VISUALIZATION (Step 6)
// ============================================================================================

Map.addLayer(ndvi2000, ndviVis, 'NDVI 2000', false);
Map.addLayer(ndvi2023, ndviVis, 'NDVI 2023', false);
Map.addLayer(ndvi_diff, changeVis, 'AI-Assisted NDVI Difference', true);
Map.addLayer(classified.randomVisualizer(), {}, 'Forest Cover Zones (Classified)', true);

// ============================================================================================
// 7. STATISTICS & EXPORT (Step 7)
// ============================================================================================

// Area Statistics
var areaImage = ee.Image.pixelArea().addBands(classified);
var stats = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'class_index',
  }),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
});

print('Area Statistics (sq meters) per Class:', stats);

// Exports
Export.image.toDrive({
  image: ndvi_diff,
  description: 'P5_NDVI_Difference_Map',
  scale: 30,
  region: aoi,
  fileFormat: 'GeoTIFF'
});

Export.image.toDrive({
  image: classified,
  description: 'P5_Forest_Change_Zones',
  scale: 30,
  region: aoi,
  fileFormat: 'GeoTIFF'
});
