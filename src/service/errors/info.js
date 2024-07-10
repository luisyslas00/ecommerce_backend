const generateProductError = (product) => {
    return `Hay propiedades del producto incompletas:
            *title: Debe ser de tipo String y recibe: ${product.title} -
            *description: Debe ser de tipo String y recibe: ${product.description} -
            *price: Debe ser de tipo Number y recibe: ${product.price} -
            *thumbnail: Debe ser de tipo String y recibe: ${product.thumnail} - 
            *category: Debe ser de tipo String y recibe ${product.category} -
            *code: Debe ser de tipo String y único, recibe: ${product.code} -
            *stock: Debe ser de tipo Number y recibe: ${product.stock} - 
            `
}

module.exports = generateProductError