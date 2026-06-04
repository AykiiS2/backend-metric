module.exports = {
    ocr: {
        recognition: {
            charactersDictionary: "0123456789+-xX:/*=()".split("")
        },
        language: 'en',
        version: 'PP-OCRv5_mobile'
    },
    timeout: 30000,
    maxImageSize: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png']
};