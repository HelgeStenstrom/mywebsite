const Chart = jest.fn().mockImplementation(() => ({
  destroy: jest.fn(),
}));

module.exports = Chart;
module.exports.default = Chart;
