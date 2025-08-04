export const initialUsers = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    address: "123 Street",
    role: "user",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    address: "456 Lane",
    role: "admin",
  },
];

export const initialStores = [
  {
    id: 1,
    name: "Coffee Time",
    email: "store1@coffee.com",
    address: "789 Coffee St",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Book World",
    email: "store2@books.com",
    address: "321 Read Rd",
    rating: 4.2,
  },
];

export const initialRatings = [
  { storeId: 1, userId: 1, rating: 4 },
  { storeId: 2, userId: 2, rating: 5 },
];
