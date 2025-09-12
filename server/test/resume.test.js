const { handleResumeUpload } = require('../controller/resume.controller.js');

// 1. Mock pdf-parse
jest.mock('pdf-parse', () => jest.fn(() => Promise.resolve({ text: "mock resume text" })));

// 2. Mock redisClient
jest.mock('../config/redisClient.js', () => ({
  get: jest.fn(),
  setEx: jest.fn()
}));

// 3. Mock resumeModel (mongoose model)
jest.mock('../model/resume.model.js', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

// 4. Mock resumeQueue
jest.mock('../config/resumeQueue.js', () => ({
  add: jest.fn()
}));

const redisClient = require('../config/redisClient.js');
const resumeModel = require('../model/resume.model.js');
const resumeQueue = require('../config/resumeQueue.js');

describe("handleResumeUpload", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      file: { buffer: Buffer.from("fake pdf") },
      userId: "user123"
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it("should queue a new resume if not cached or in DB", async () => {
    redisClient.get.mockResolvedValue(null);
    resumeModel.findOne.mockResolvedValue(null);
    resumeModel.create.mockResolvedValue({});
    resumeQueue.add.mockResolvedValue();

    await handleResumeUpload(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(202);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'queued',
      message: expect.any(String),
      hash: expect.any(String)
    }));
    expect(resumeModel.create).toHaveBeenCalled();
    expect(resumeQueue.add).toHaveBeenCalled();
  });

  it("should return cached result from redis", async () => {
    const cached = { score: 90, strengths: ["X"], improvements: ["Y"] };
    redisClient.get.mockResolvedValue(JSON.stringify(cached));

    await handleResumeUpload(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'cached',
      feedback: cached,
      source: 'redis'
    }));
  });
});
