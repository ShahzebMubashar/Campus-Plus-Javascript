import API_BASE_URL from '../config/api';

// Cache for CSV data with timestamps
const csvCache = {
  courses: { data: null, timestamp: null },
  datesheet: { data: null, timestamp: null }
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Check if cache is valid
const isCacheValid = (fileType) => {
  const cache = csvCache[fileType];
  if (!cache.data || !cache.timestamp) return false;
  
  const now = Date.now();
  return (now - cache.timestamp) < CACHE_DURATION;
};

// Fetch CSV data from backend with caching
export const fetchCSVData = async (fileType) => {
  // Return cached data if valid
  if (isCacheValid(fileType)) {
    console.log(`Using cached ${fileType} data`);
    return csvCache[fileType].data;
  }

  try {
    console.log(`Fetching ${fileType} data from backend`);
    const response = await fetch(`${API_BASE_URL}/api/csv/data/${fileType}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileType} data: ${response.status}`);
    }

    const csvText = await response.text();
    
    // Update cache
    csvCache[fileType] = {
      data: csvText,
      timestamp: Date.now()
    };

    return csvText;
  } catch (error) {
    console.error(`Error fetching ${fileType} data:`, error);
    
    // Return cached data even if expired as fallback
    if (csvCache[fileType].data) {
      console.log(`Using expired cache for ${fileType} as fallback`);
      return csvCache[fileType].data;
    }
    
    throw error;
  }
};

// Clear cache for a specific file type (useful after updates)
export const clearCSVCache = (fileType) => {
  if (fileType) {
    csvCache[fileType] = { data: null, timestamp: null };
    console.log(`Cleared cache for ${fileType}`);
  } else {
    // Clear all cache
    Object.keys(csvCache).forEach(key => {
      csvCache[key] = { data: null, timestamp: null };
    });
    console.log('Cleared all CSV cache');
  }
};

// Get cache info for debugging
export const getCacheInfo = () => {
  return Object.keys(csvCache).reduce((info, key) => {
    const cache = csvCache[key];
    info[key] = {
      hasData: !!cache.data,
      timestamp: cache.timestamp,
      isValid: isCacheValid(key),
      age: cache.timestamp ? Date.now() - cache.timestamp : null
    };
    return info;
  }, {});
};
