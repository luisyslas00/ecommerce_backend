const generateProductError = (product) => {
    return `Hay propiedades del producto incompletas:
            *title: Debe ser de tipo String y recibe: ${product.title}-
            *description: Debe ser de tipo String y recibe: ${product.description}-
            *price: Debe ser mayor a 0 y recibe: ${product.price} -
            *thumbnail: Debe ser de tipo String y recibe: ${product.thumbnail} - 
            *category: Debe ser de tipo String y recibe ${product.category} -
            *code: Debe ser de tipo String y único, recibe: ${product.code} -
            *stock: Debe ser mayor a 0 y recibe: ${product.stock} - 
            *category: Debe ser de tipo String y recibe: ${product.category} - `
}

module.exports = generateProductError