function myDocument(docs) {
    return {
        async create(doc) {
            const newDoc = { _id: makeId(), ...doc };
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
const makeId = () => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 5) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};
const productData = [
    {
        _id: makeId(),
        productName: "Product 1",
        price: 100,
        categoryId: "123",
    },
    {
        _id: makeId(),
        productName: "Product 2",
        price: 200,
        categoryId: "456",
    },
];
const categoryData = [
    {
        _id: "123",
        categoryName: "Category 1",
    },
    {
        _id: "456",
        categoryName: "Category 2",
    },
];
const main = async () => {
    const products = myDocument(productData);
    const categories = myDocument(categoryData);
    const newProduct = await products.create({
        productName: "Product 3",
        price: 300,
        categoryId: "123",
    });
    console.log(await categories.find());
};
main();
