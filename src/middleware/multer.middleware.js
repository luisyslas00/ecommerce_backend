const multer = require('multer');
const { dirname,join } = require('node:path');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let uploadPath;
        switch (file.fieldname) {
            case 'profile':
                uploadPath = join(dirname(__dirname), '/public/uploads/profiles');
                break;
            case 'product':
                uploadPath = join(dirname(__dirname), '/public/uploads/products');
                break;
            case 'document':
                uploadPath = join(dirname(__dirname), '/public/uploads/documents');
                break;
            default:
                uploadPath = join(dirname(__dirname), '/public/uploads');
        }
        // Verificar si la carpeta existe, si no, crearla
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                return callback(err);
            } else {
                callback(null, uploadPath);
            }
        });
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({
    storage
});


module.exports = {
    uploader
};