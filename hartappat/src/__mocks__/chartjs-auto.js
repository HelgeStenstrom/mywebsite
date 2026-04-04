const Chart = jest.fn().mockImplementation(() => ({
  destroy: jest.fn(),
  update: jest.fn(),
  data: {
    datasets: [{data: []}]
  }
}));

module.exports = Chart;
module.exports.default = Chart;
