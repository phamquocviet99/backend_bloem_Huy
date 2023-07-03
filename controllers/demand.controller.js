import demandModel from "../models/demand.model.js";

export const post = async (req, res) => {
  try {
    if (
      !req.body.nameVendor ||
      !req.body.description ||
      !req.body.category ||
      !req.body.subCategory ||
      !req.body.price ||
      !req.body.images.length < 0 ||
      !req.body.idVendor ||
      !req.body.name ||
      !req.body.description
    ) {
      res.status(200).send({
        success: false,
        code: -1,
        message: "Thiếu trường dữ liệu !",
      });
      return;
    }
    const demand = new demandModel(req.body);
    await demand
      .save()
      .then((result) => {
        res.status(200).send({
          success: true,
          code: 0,
          message: "Tạo tin đăng thành công !",
          data: result,
        });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ error: error, message: "Không thành công", success: false });
      });
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: "Không thành công", success: false });
  }
};

export const get = async (req, res) => {
  try {
    await demandModel
      .find()
      .then((result) => {
        for (var i in result) {
          result[i].rating = averageRating(result[i].rating);
        }
        return res.status(200).send({
          success: true,
          code: 0,
          message: "Thành công",
          data: result,
        });
      })
      .catch((error) => {
        return res
          .status(500)
          .send({ error: error, message: "Không thành công", success: false });
      });
  } catch (err) {
    res.status(500).json({ error: true });
  }
};

export const getById = async (req, res) => {
  try {
    if (req.params.id) {
      await demandModel
        .findById({ _id: req.params.id })
        .then((result) => {
          result.rating = averageRating(result.rating);
          return res.status(200).send({
            success: true,
            code: 0,
            message: "Thành công",
            data: result,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            error: error.message,
            message: "Không tìm thấy đối tượng Id",
            success: false,
          });
        });
    } else {
      res.status(200).send({
        success: false,
        code: -1,
        message: "URL không hợp lệ",
      });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteById = async (req, res) => {
  try {
    if (req.params.id) {
      await demandModel
        .findByIdAndDelete({ _id: req.params.id })
        .then((result) => {
          return res.status(200).send({
            success: true,
            code: 0,
            message: "Xoá thành công",
          });
        })
        .catch((error) => {
          return res.status(500).send({
            error: error.message,
            message: "Không tìm thấy đối tượng Id",
            success: false,
          });
        });
    } else {
      res.status(200).send({
        success: false,
        code: -1,
        message: "URL không hợp lệ",
      });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateRating = async (req, res) => {
  try {
    if (req.params.id) {
      const demand = await demandModel.findById({ _id: req.params.id });
      const rating = req.params.rating;
      var ratingResult = demand.rating;
      ratingResult.push(rating);
      await demandModel
        .findByIdAndUpdate(
          { _id: req.params.id },
          { rating: ratingResult },
          { new: true }
        )
        .then((result) => {
          result.rating = averageRating(result.rating);
          return res.status(200).send({
            success: true,
            code: 0,
            message: "Thành công",
            data: result,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            error: error.message,
            message: "Không tìm thấy đối tượng Id",
            success: false,
          });
        });
    } else {
      res.status(200).send({
        success: false,
        code: -1,
        message: "URL không hợp lệ",
      });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function averageRating(arr) {
  if (arr.length === 0) {
    return 0;
  }

  var tong = 0;
  for (var i in arr) {
    tong = tong + parseInt(arr[i]);
  }

  var trungBinh = tong / arr.length;
  return trungBinh;
}
