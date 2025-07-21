
const pagination = async ({ model, page = 1, limit = 8, sort = {},query={} }) => {
  try {
    const skip = (page - 1) * limit;
    const data = await model.find(query)
                        .limit(limit)
                        .skip(skip)
                        .sort(sort);
    const total = await model.countDocuments(query);

    return {
      status: 'OK',
      message: 'Thành công',
      data,
      totalPage: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Lỗi', error);
  }
};

module.exports = pagination;
