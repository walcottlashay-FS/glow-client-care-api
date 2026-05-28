jest.mock("../app/models/clientModel", () => ({
  find: jest.fn(),
  countDocuments: jest.fn()
}));

jest.mock("../app/models/treatmentPlanModel", () => ({
  find: jest.fn(),
  countDocuments: jest.fn()
}));

const Client = require("../app/models/clientModel");
const TreatmentPlan = require("../app/models/treatmentPlanModel");

const { getAllClients } = require("../app/controller/clientController");
const { getAllTreatmentPlans } = require("../app/controller/treatmentPlanController");

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

const createMockQuery = (mockData) => {
  return {
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(mockData)
  };
};

describe("Client query operator tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns limited client data using query string and select", async () => {
    const mockClients = [
      {
        _id: "client123",
        firstName: "Shay",
        age: 34,
        skinConcerns: ["acne"]
      }
    ];

    const mockQuery = createMockQuery(mockClients);

    Client.find.mockReturnValue(mockQuery);
    Client.countDocuments.mockResolvedValue(1);

    const req = {
      query: {
        minAge: "18",
        maxAge: "45",
        skinConcern: "acne",
        exclude: "email",
        page: "1",
        limit: "5"
      }
    };

    const res = mockResponse();

    await getAllClients(req, res);

    expect(Client.find).toHaveBeenCalledWith({
      age: {
        $gte: 18,
        $lte: 45
      },
      skinConcerns: {
        $in: ["acne"]
      }
    });

    expect(mockQuery.select).toHaveBeenCalledWith("-email");
    expect(mockQuery.limit).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data).toEqual(mockClients);
  });

  test("returns client pagination using skip and limit", async () => {
    const mockClients = [
      {
        _id: "client456",
        firstName: "Mia",
        age: 25
      }
    ];

    const mockQuery = createMockQuery(mockClients);

    Client.find.mockReturnValue(mockQuery);
    Client.countDocuments.mockResolvedValue(10);

    const req = {
      query: {
        page: "2",
        limit: "5"
      }
    };

    const res = mockResponse();

    await getAllClients(req, res);

    expect(mockQuery.skip).toHaveBeenCalledWith(5);
    expect(mockQuery.limit).toHaveBeenCalledWith(5);
    expect(res.json.mock.calls[0][0].page).toBe(2);
    expect(res.json.mock.calls[0][0].pages).toBe(2);
  });

  test("returns clients sorted in both directions", async () => {
    const mockClients = [
      {
        _id: "client789",
        firstName: "Aaliyah",
        age: 22
      }
    ];

    let mockQuery = createMockQuery(mockClients);

    Client.find.mockReturnValue(mockQuery);
    Client.countDocuments.mockResolvedValue(1);

    let req = {
      query: {
        sort: "age"
      }
    };

    let res = mockResponse();

    await getAllClients(req, res);

    expect(mockQuery.sort).toHaveBeenCalledWith("age");

    mockQuery = createMockQuery(mockClients);

    Client.find.mockReturnValue(mockQuery);
    Client.countDocuments.mockResolvedValue(1);

    req = {
      query: {
        sort: "-age"
      }
    };

    res = mockResponse();

    await getAllClients(req, res);

    expect(mockQuery.sort).toHaveBeenCalledWith("-age");
  });
});

describe("Treatment plan query operator tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns limited treatment plan data using query string and select", async () => {
    const mockTreatmentPlans = [
      {
        _id: "plan123",
        serviceName: "Chemical Peel",
        sessions: 3,
        price: 450
      }
    ];

    const mockQuery = createMockQuery(mockTreatmentPlans);

    TreatmentPlan.find.mockReturnValue(mockQuery);
    TreatmentPlan.countDocuments.mockResolvedValue(1);

    const req = {
      query: {
        minPrice: "100",
        maxPrice: "500",
        minSessions: "2",
        maxSessions: "6",
        exclude: "createdAt",
        page: "1",
        limit: "5"
      }
    };

    const res = mockResponse();

    await getAllTreatmentPlans(req, res);

    expect(TreatmentPlan.find).toHaveBeenCalledWith({
      sessions: {
        $gte: 2,
        $lte: 6
      },
      price: {
        $gte: 100,
        $lte: 500
      }
    });

    expect(mockQuery.select).toHaveBeenCalledWith("-createdAt");
    expect(mockQuery.limit).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data).toEqual(mockTreatmentPlans);
  });

  test("returns treatment plan pagination using skip and limit", async () => {
    const mockTreatmentPlans = [
      {
        _id: "plan456",
        serviceName: "Custom Facial",
        sessions: 6,
        price: 600
      }
    ];

    const mockQuery = createMockQuery(mockTreatmentPlans);

    TreatmentPlan.find.mockReturnValue(mockQuery);
    TreatmentPlan.countDocuments.mockResolvedValue(12);

    const req = {
      query: {
        page: "3",
        limit: "5"
      }
    };

    const res = mockResponse();

    await getAllTreatmentPlans(req, res);

    expect(mockQuery.skip).toHaveBeenCalledWith(10);
    expect(mockQuery.limit).toHaveBeenCalledWith(5);
    expect(res.json.mock.calls[0][0].page).toBe(3);
    expect(res.json.mock.calls[0][0].pages).toBe(3);
  });

  test("returns treatment plans sorted in both directions", async () => {
    const mockTreatmentPlans = [
      {
        _id: "plan789",
        serviceName: "Chemical Peel",
        sessions: 3,
        price: 450
      }
    ];

    let mockQuery = createMockQuery(mockTreatmentPlans);

    TreatmentPlan.find.mockReturnValue(mockQuery);
    TreatmentPlan.countDocuments.mockResolvedValue(1);

    let req = {
      query: {
        sort: "price"
      }
    };

    let res = mockResponse();

    await getAllTreatmentPlans(req, res);

    expect(mockQuery.sort).toHaveBeenCalledWith("price");

    mockQuery = createMockQuery(mockTreatmentPlans);

    TreatmentPlan.find.mockReturnValue(mockQuery);
    TreatmentPlan.countDocuments.mockResolvedValue(1);

    req = {
      query: {
        sort: "-price"
      }
    };

    res = mockResponse();

    await getAllTreatmentPlans(req, res);

    expect(mockQuery.sort).toHaveBeenCalledWith("-price");
  });
});