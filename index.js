function myDocument(docs) {
    return {
        async create(doc) {
            const newDoc = { ...doc, _id: new Date().toISOString() };
            docs.push(newDoc);
            return newDoc;
        },
        async find() {
            return docs;
        },
        async findOne(query) {
            return docs.find((doc) => {
                return Object.keys(query).every((key) => {
                    return doc[key] === query[key];
                });
            });
        },
        async findById(id) {
            return docs.find((doc) => doc._id === id);
        },
        async deleteOne(query) {
            const index = docs.findIndex((doc) => {
                return Object.keys(query).every((key) => {
                    return doc[key] === query[key];
                });
            });
            docs.splice(index, 1);
        },
        async deleteById(id) {
            const index = docs.findIndex((doc) => doc._id === id);
            docs.splice(index, 1);
        },
        async updateOne(query, doc) {
            const index = docs.findIndex((doc) => {
                return Object.keys(query).every((key) => {
                    return doc[key] === query[key];
                });
            });
            docs[index] = { ...doc, _id: docs[index]._id };
            return docs[index];
        },
    };
}
const data = [
    {
        _id: "1",
        productName: "Product 1",
        price: 100,
        category: {
            categoryName: "Category 1",
        },
    },
    {
        _id: "2",
        productName: "Product 2",
        price: 200,
        category: {
            categoryName: "Category 2",
        },
    },
];
const products = myDocument(data);
const newProductOne = products.create({
    productName: "Product 3",
    price: 300,
    category: {
        categoryName: "Category 3",
    },
});
console.log(products.find());
console.log(data);
