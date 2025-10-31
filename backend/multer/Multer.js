// import multer from "multer";
// import path from 'path';

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/Images');
//     },
//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + Date.now() + ext);
//     }
// });

// const fileFilter = function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".svg") {
//         cb(new Error("File type is not supported"), false);
//         return;
//     }
//     cb(null, true);
// };

// const upload = multer({ storage, fileFilter });

// export default upload;


import multer from "multer";
import path from 'path';
import fs from 'fs';

// Ensure the directory exists
const dir = 'upload/Images';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const fileFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".svg") {
        cb(new Error("File type is not supported"), false);
        return;
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;

