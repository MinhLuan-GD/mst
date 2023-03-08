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
  categoryId: string;
}

interface Category {
  categoryName: string;
}

function myDocument<T>(docs: Array<T & { _id: string }>): MyDocument<T> {
  return {
    async create(doc: T): Promise<T & { _id: string }> {
      const newDoc = { _id: makeId(), ...doc };
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

const makeId = () => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
  const products = myDocument<Product>(productData);
  const categories = myDocument<Category>(categoryData);

  const newProduct = await products.create({
    productName: "Product 3",
    price: 300,
    categoryId: "123",
  });

  console.log(await categories.find());
};

main();
