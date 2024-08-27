// const checkFiles = (req, res, next) => {
//     const fileTypes = ['profile', 'product', 'document'];
//     const uploadedTypes = Object.keys(req.files || {});

//     const missingTypes = fileTypes.filter(type => !uploadedTypes.includes(type));

//     if (missingTypes.length > 0) {
//         return res.status(400).json({
//             status: 'failed',
//             message: `Missing files: ${missingTypes.join(', ')}`
//         });
//     }

//     next();
// };

// module.exports = {
//     checkFiles
// }