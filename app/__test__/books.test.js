const BookProvider = require("../providers/mocks/books.provider");
const UseCaseBooks = require("../use-cases/books.use-case");

const provider = new BookProvider(process.env.API_LIBRARY);
const UseCase = new UseCaseBooks(provider);

test("Retrieve Data Book", async () => {
  try {
    const retrieveBooks = await UseCase.findAll({ subject: "book.json" });
    expect(retrieveBooks).toBeTruthy();
  } catch (e) {
    expect(e).toMatch("error");
  }
});

test("Retrieve Data Book - With Wrong Params", async () => {
  try {
    await UseCase.findAll({ sewy: "book.json" });
  } catch (e) {
    expect(e.details[0].message).toMatch('"subject" is required');
  }
});

test("Retrieve Information Book By Admin", async () => {
  try {
    const retrieveBooks = await UseCase.retrieveBookInformationByAdmin({
      subject: "book.json",
    });
    expect(retrieveBooks).toBeTruthy();
  } catch (e) {
    expect(e).toMatch("error");
  }
});

test("Retrieve Information Book By Admin - With Wrong Params", async () => {
  try {
    await UseCase.retrieveBookInformationByAdmin({ sewy: "book.json" });
  } catch (e) {
    expect(e.details[0].message).toMatch('"subject" is required');
  }
});

test("Pick Schedule User", async () => {
  try {
    const retrieveBooks = await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "OL26445784M",
      subject: "book",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
    expect(retrieveBooks).toBeTruthy();
  } catch (e) {
    expect(e).toMatch("error");
  }
});

test("Pick Schedule User - With Empty Title", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "",
      author: "Jonathan Swift",
      edition_number: "OL26445784M",
      subject: "book",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.details[0].message).toMatch('"title" is not allowed to be empty');
  }
});

test("Pick Schedule User - With  Empty String Author", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "",
      edition_number: "OL26445784M",
      subject: "book",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.details[0].message).toMatch('"author" is not allowed to be empty');
  }
});

test("Pick Schedule User - With Empty String Edition Number", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "",
      subject: "book",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.details[0].message).toMatch(
      '"edition_number" is not allowed to be empty'
    );
  }
});

test("Pick Schedule User - With Empty String Subject", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "asdsd",
      subject: "",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.details[0].message).toMatch(
      '"subject" is not allowed to be empty'
    );
  }
});

test("Pick Schedule User - With Empty String Name", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "asdsd",
      subject: "asd",
      name: "",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.details[0].message).toMatch('"name" is not allowed to be empty');
  }
});

test("Pick Schedule User - With Empty String Pickup Schedule", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "asdsd",
      subject: "asd",
      name: "asd",
      pickup_schedule: "",
    });
  } catch (e) {
    expect(e.details[0].message).toMatch(
      '"pickup_schedule" must be in ISO 8601 date format'
    );
  }
});

test("Pick Schedule User - With Empty Subject", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "OL26445784M",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
    expect(retrieveBooks).toBeTruthy();
  } catch (e) {
    expect(e.details[0].message).toMatch('"subject" is required');
  }
});

test("Pick Schedule User - With Empty Name", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "OL26445784M",
      subject: "book",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.details[0].message).toMatch('"name" is required');
  }
});

test("Pick Schedule User - With Empty Pickup Schedule", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "OL26445784M",
      subject: "book",
      name: "Ade",
    });
  } catch (e) {
    expect(e.details[0].message).toMatch('"pickup_schedule" is required');
  }
});

test("Pick Schedule User - With Empty Object", async () => {
  try {
    await UseCase.userBorrowBook({});
  } catch (e) {
    expect(e.details[0].message).toMatch('"title" is required');
  }
});

test("Pick Schedule User - But Subject Not Found", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "OL26445784M",
      subject: "ade",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.message).toMatch(
      "Subject Not Found. Please Contact Administrator"
    );
  }
});

test("Pick Schedule User - But Books Not Found (title)", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "hehe",
      author: "Jonathan Swift",
      edition_number: "OL26445784M",
      subject: "book",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.message).toMatch("Book Not Found. Please Contact Administrator");
  }
});

test("Pick Schedule User - But Books Not Found (edition number)", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "Jonathan Swift",
      edition_number: "asd",
      subject: "book",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
  } catch (e) {
    expect(e.message).toMatch("Book Not Found. Please Contact Administrator");
  }
});

test("Pick Schedule User - But Books Not Found (author)", async () => {
  try {
    await UseCase.userBorrowBook({
      title: "Gulliver's Travels",
      author: "ade",
      edition_number: "OL26445784M",
      subject: "book",
      name: "Ade",
      pickup_schedule: "2022-10-20",
    });
    
  } catch (e) {
    expect(e.message).toMatch("Book Not Found. Please Contact Administrator");
  }
});
