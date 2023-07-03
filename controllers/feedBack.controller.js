import feedBackModel from "../models/feedBack.model.js";

export const post = async (req, res) => {
  try {
    if (!req.body.nameVendor || !req.body.description || !req.body.email) {
      res.status(200).send({
        success: false,
        code: -1,
        message: "Thiếu trường dữ liệu !",
      });
      return;
    }
    const feedBack = new feedBackModel({
      nameVendor: req.body.nameVendor,
      type: req.body.type,
      description: req.body.description,
      email: req.body.email,
      image: req.body.image,
    });
    await feedBack
      .save()
      .then((result) => {
        res.status(200).send({
          success: true,
          code: 0,
          message: "Tạo thành công góp ý !",
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
    await feedBackModel
      .find()
      .then((result) => {
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

export const updateStatus = async (req, res) => {
  try {
    if (
      (req.params.status === "processing" ||
        req.params.status === "success" ||
        req.params.status === "cancel") &&
      req.params.id
    ) {
      await feedBackModel
        .findByIdAndUpdate(
          { _id: req.params.id },
          { status: req.params.status },
          { new: true }
        )
        .then((result) => {
          return res.status(200).send({
            success: true,
            code: 0,
            message: "Thành công",
            data: result,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            error: error,
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
    res.status(500).json({ error: true });
  }
};
