const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Simple multer configuration for CSV uploads
const upload = multer({
  dest: path.join(__dirname, '../uploads/temp'),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  }
});

// Simple security key validation
const validateSecurityKey = (req, res, next) => {
  const securityKey = req.headers['x-security-key'] || req.body.securityKey;
  const validKey = process.env.CSV_UPLOAD_SECURITY_KEY || 'campus-plus-2024';
  
  if (!securityKey || securityKey !== validKey) {
    return res.status(401).json({
      error: 'Invalid or missing security key'
    });
  }
  
  next();
};

// Simple CSV upload endpoint - stores in backend and serves via API
exports.uploadCSV = [
  validateSecurityKey,
  upload.single('csvFile'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No CSV file uploaded'
        });
      }

      const { targetFile } = req.body; // 'courses' or 'datesheet'
      
      if (!targetFile || !['courses', 'datesheet'].includes(targetFile)) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: 'Invalid target file. Must be "courses" or "datesheet"'
        });
      }

      // Store CSV in backend's data directory
      const backendDataPath = path.join(__dirname, '../data');
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(backendDataPath)) {
        fs.mkdirSync(backendDataPath, { recursive: true });
      }

      const targetPath = path.join(backendDataPath, `${targetFile}.csv`);

      // Create backup if file exists
      if (fs.existsSync(targetPath)) {
        const backupPath = path.join(backendDataPath, `${targetFile}_backup_${Date.now()}.csv`);
        fs.copyFileSync(targetPath, backupPath);
        console.log(`Backup created: ${backupPath}`);
      }

      // Copy uploaded file to backend data location
      fs.copyFileSync(req.file.path, targetPath);
      
      // Clean up temp file
      fs.unlinkSync(req.file.path);

      console.log(`CSV updated: ${targetFile}.csv in backend`);

      res.status(200).json({
        success: true,
        message: `${targetFile}.csv updated successfully in backend`,
        file: targetFile,
        note: 'Frontend should fetch data from /api/csv/data/' + targetFile
      });

    } catch (error) {
      console.error('CSV upload error:', error);
      
      // Clean up temp file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        error: 'Upload failed',
        message: error.message
      });
    }
  }
];

// Serve CSV data to frontend
exports.getCSVData = async (req, res) => {
  try {
    const { fileType } = req.params; // 'courses' or 'datesheet'
    
    if (!['courses', 'datesheet'].includes(fileType)) {
      return res.status(400).json({
        error: 'Invalid file type. Must be "courses" or "datesheet"'
      });
    }

    const filePath = path.join(__dirname, '../data', `${fileType}.csv`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'CSV file not found',
        message: `${fileType}.csv not found on server`
      });
    }

    // Read and send CSV file
    const csvData = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileType}.csv"`);
    res.send(csvData);

  } catch (error) {
    console.error('CSV serve error:', error);
    res.status(500).json({
      error: 'Failed to serve CSV data',
      message: error.message
    });
  }
};

module.exports = {
  upload,
  validateSecurityKey,
  uploadCSV: exports.uploadCSV,
  getCSVData: exports.getCSVData
};