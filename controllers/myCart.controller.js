import myCardModel from "../models/myCart.model.js";
import demandModel from "../models/demand.model.js";
export const post = async (req, res) => {
  try {
    if (!req.body.idVendor || !req.body.idDemand) {
      res.status(200).send({
        success: false,
        code: -1,
        message: "Thiếu trường dữ liệu !",
      });
      return;
    }
    await demandModel
      .findById({ _id: req.body.idDemand })
      .then((result) => {
        const newCart = new myCardModel(req.body);
        newCart
          .save()
          .then((results) => {
            res.status(200).send({
              success: true,
              code: 0,
              message: "Thêm vào giỏ hàng thành công !",
              data: results,
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
              message: "Không thành công",
              success: false,
            });
          });
      })
      .catch((error) => {
        return res.status(200).send({
          error: error.message,
          message: "Không tìm thấy đối tượng Id demand",
          success: false,
        });
      });
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: "Không thành công", success: false });
  }
};

export const getByIdVendor = async (req, res) => {
  try {
    if (req.params.id) {
      var listCart = [];
      const listCardOfVendor = await myCardModel.find({
        idVendor: req.params.id,
      });
      for (var i in listCardOfVendor) {
        await demandModel
          .findById({ _id: listCardOfVendor[i].idDemand })
          .then((results) => {
            var n = results;
            n.quantity = listCardOfVendor[i].quantity;
            listCart.push(n);
          })
          .catch((error) => {
            return res.status(500).send({
              success: true,
              code: 0,
              message: "Có lỗi trong quá trình lấy dữ liệu",
              error: error.message,
            });
          });
      }
      return res.status(200).send({
        success: true,
        code: 0,
        message: "Thành công",
        data: listCart,
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
      await myCardModel
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
