interface MyDocument<T> {
  create(doc: T): Promise<T & { _id: string }>;
  find(): Promise<Array<T & { _id: string }>>;
  findOne(query: Partial<T & { _id: string }>): Promise<T & { _id: string }>;
  findById(id: string): Promise<T & { _id: string }>;
  deleteOne(query: Partial<T & { _id: string }>): void;
  deleteById(id: string): void;
  updateOne(
    query: Partial<T & { _id: string }>,
    doc: T
  ): Promise<T & { _id: string }>;
}

interface Product {
  productName: string;
  price: number;
  category: Category;
}

interface Category {
  categoryName: string;
}

function myDocument<T>(docs: Array<T & { _id: string }>): MyDocument<T> {
  return {
    async create(doc: T): Promise<T & { _id: string }> {
      const newDoc = { ...doc, _id: new Date().toISOString() };
      docs.push(newDoc);
      return newDoc;
    },
    async find(): Promise<Array<T & { _id: string }>> {
      return docs;
    },
    async findOne(
      query: Partial<T & { _id: string }>
    ): Promise<T & { _id: string }> {
      return docs.find((doc) => {
        return Object.keys(query).every((key) => {
          return doc[key] === query[key];
        });
      }) as T & { _id: string };
    },
    async findById(id: string): Promise<T & { _id: string }> {
      return docs.find((doc) => doc._id === id) as T & { _id: string };
    },
    async deleteOne(query: Partial<T & { _id: string }>): Promise<void> {
      const index = docs.findIndex((doc) => {
        return Object.keys(query).every((key) => {
          return doc[key] === query[key];
        });
      });
      docs.splice(index, 1);
    },
    async deleteById(id: string): Promise<void> {
      const index = docs.findIndex((doc) => doc._id === id);
      docs.splice(index, 1);
    },
    async updateOne(
      query: Partial<T & { _id: string }>,
      doc: T
    ): Promise<T & { _id: string }> {
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

const products = myDocument<Product>(data);

const newProductOne = products.create({
  productName: "Product 3",
  price: 300,
  category: {
    categoryName: "Category 3",
  },
});
