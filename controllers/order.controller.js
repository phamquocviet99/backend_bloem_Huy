import orderModel from "../models/order.model.js";
import demandModel from "../models/demand.model.js";
import { paymentPayout } from "./wallet.controller.js";

export const get = async (req, res) => {
  try {
    await orderModel
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
export const post = async (req, res) => {
  try {
    if (
      !req.body.shippingCost ||
      !req.body.idVendor ||
      !req.body.address ||
      !req.body.idCustomer
    ) {
      res.status(200).send({
        success: false,
        code: -1,
        message: "Thiếu trường dữ liệu !",
      });
      return;
    }
    if (req.body.idVendor === req.body.idCustomer)
      return res.status(200).json({
        error: err,
        message: "Người bán và người mua giống nhau",
        success: false,
      });
    const listDemands = await getDemandByListId(req.body.demands);
    if (!listDemands)
      return res.status(500).json({
        error: err,
        message: "Không tìm thấy ID Demand",
        success: false,
      });
    const oldNumber =
      (
        await orderModel.aggregate([
          {
            $group: {
              _id: null,
              maxNumber: { $max: "$number" }, // Thay 'fieldName' bằng tên trường chứa số trong bảng của bạn
            },
          },
        ])
      )[0] || 0;
    const totalPrice =
      (listDemands[1] + parseFloat(req.body.shippingCost)) *
      parseFloat(1 - parseFloat(req.body.couponPercent));

    const order = new orderModel({
      number: parseInt(oldNumber.maxNumber ? oldNumber.maxNumber : 0 + 1),
      shippingCost: req.body.shippingCost,
      idVendor: req.body.idVendor,
      address: req.body.address,
      idCustomer: req.body.idCustomer,
      couponPercent: req.body.couponPercent,
      demands: req.body.demands,
      totalPrice: totalPrice,
    });
    await order
      .save()
      .then((result) => {
        res.status(200).send({
          success: true,
          code: 0,
          message: "Tạo đơn hàng thành công !",
          data: {
            id: result.id,
            number: result.number,
            listDemands: listDemands[0],
            totalPrice: result.totalPrice,
            address: result.address,
            status: result.status,
            idVendor: result.idVendor,
            address: result.address,
            idCustomer: result.idCustomer,
          },
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

export const updateStatus = async (req, res) => {
  try {
    var order = null;
    if (
      (req.params.status === "processing" ||
        req.params.status === "shipping" ||
        req.params.status === "payment" ||
        req.params.status === "completed" ||
        req.params.status === "cancel") &&
      req.params.id
    ) {
      const listDemands = await getDemandByListId(req.body.demands);
      if (!listDemands)
        return res.status(500).json({
          error: err,
          message: "Không tìm thấy ID Demand",
          success: false,
        });

      await orderModel
        .findByIdAndUpdate(
          { _id: req.params.id },
          { status: req.params.status },
          { new: true }
        )
        .then((result) => {
          order = result;
          return res.status(200).send({
            success: true,
            code: 0,
            message: "Thành công",
            data: {
              id: result.id,
              number: result.number,
              listDemands: listDemands[0],
              totalPrice: result.totalPrice,
              address: result.address,
              status: result.status,
              idVendor: result.idVendor,
              address: result.address,
              idCustomer: result.idCustomer,
            },
          });
        })
        .catch((error) => {
          return res.status(500).send({
            error: error,
            message: "Không tìm thấy đối tượng Id",
            success: false,
          });
        });
      if (req.params.status === "completed") {
        await paymentPayout(
          order.idVendor,
          order.totalPrice,
          `Nhận tiền đơn hàng số ${order.number}`,
          "payout"
        );

        await paymentPayout(
          "vi-san-546",
          order.totalPrice * 0.9,
          `Phí dịch vụ đơn hàng số ${order.number}`,
          "payment"
        );
      }
      if (req.params.status === "payment") {
        await paymentPayout(
          order.idCustomer,
          order.totalPrice,
          `Thanh toán đơn hàng số ${order.number}`,
          "payment"
        );
        await paymentPayout(
          "vi-san-546",
          order.totalPrice,
          `Tiền hàng của đơn hàng số ${order.number}`,
          "payout"
        );
      }
      if (req.params.status === "processing") {
        try {
          for (var i in listDemands[0]) {
            const demand = await demandModel
              .findById({
                _id: listDemands[0][i]._id,
              })
              .catch((error) => {
                return res.status(500).send({
                  error: error,
                  message: "Không tìm thấy đối tượng Id",
                  success: false,
                });
              });
            await demandModel
              .findByIdAndUpdate(
                { _id: demand._id },
                {
                  quantity:
                    parseInt(demand.quantity - listDemands[0][i].quantity) < 0
                      ? 0
                      : parseInt(demand.quantity - listDemands[0][i].quantity),
                },
                { new: true }
              )
              .catch((error) => {
                return res.status(500).send({
                  error: error,
                  message: "Không thành công !",
                  success: false,
                });
              });
          }
        } catch (error) {}
      }
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
export const getById = async (req, res) => {
  try {
    if (req.params.id) {
      const listDemands = await getDemandByListId(req.body.demands);
      if (!listDemands)
        return res.status(500).json({
          error: err,
          message: "Không tìm thấy ID Demand",
          success: false,
        });
      await orderModel
        .findById({ _id: req.params.id })
        .then((result) => {
          return res.status(200).send({
            success: true,
            code: 0,
            message: "Thành công",
            data: {
              id: result.id,
              number: result.number,
              listDemands: listDemands[0],
              totalPrice: result.totalPrice,
              address: result.address,
              status: result.status,
              idVendor: result.idVendor,
              address: result.address,
              idCustomer: result.idCustomer,
              shippingCost: result.shippingCost,
              couponPercent: result.couponPercent,
            },
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

export const getByIdVendor = async (req, res) => {
  try {
    if (req.params.id) {
      var listOrder = await orderModel
        .find({
          idVendor: req.params.id,
        })
        .catch((error) => {
          return res.status(500).send({
            error: error.message,
            message: "Không tìm thấy đối tượng Id",
            success: false,
          });
        });
      var listResult = [];
      if (listOrder) {
        for (var i in listOrder) {
          var listDemands = await getDemandByListId(listOrder[i].demands);
          if (!listDemands) {
            return res.status(500).json({
              error: err,
              message: "Không tìm thấy ID Demand",
              success: false,
            });
          } else {
            const object = {
              id: listOrder[i].id,
              number: listOrder[i].number,
              listDemands: listDemands[0],
              totalPrice: listOrder[i].totalPrice,
              address: listOrder[i].address,
              status: listOrder[i].status,
              idVendor: listOrder[i].idVendor,
              address: listOrder[i].address,
              idCustomer: listOrder[i].idCustomer,
              shippingCost: listOrder[i].shippingCost,
              couponPercent: listOrder[i].couponPercent,
            };
            listResult.push(object);
          }
        }

        return res.status(200).send({
          success: true,
          code: 0,
          message: "Thành công",
          data: listResult,
        });
      } else {
        return res.status(500).send({
          error: error.message,
          message: "Có lỗi quá trình tìm kiếm !",
          success: false,
        });
      }
    } else {
      return res.status(200).send({
        success: false,
        code: -1,
        message: "URL không hợp lệ",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByIdCustomer = async (req, res) => {
  try {
    if (req.params.id) {
      var listOrder = await orderModel
        .find({
          idCustomer: req.params.id,
        })
        .catch((error) => {
          return res.status(500).send({
            error: error.message,
            message: "Không tìm thấy đối tượng Id",
            success: false,
          });
        });
      var listResult = [];
      if (listOrder) {
        for (var i in listOrder) {
          var listDemands = await getDemandByListId(listOrder[i].demands);
          if (!listDemands) {
            return res.status(500).json({
              error: err,
              message: "Không tìm thấy ID Demand",
              success: false,
            });
          } else {
            const object = {
              id: listOrder[i].id,
              number: listOrder[i].number,
              listDemands: listDemands[0],
              totalPrice: listOrder[i].totalPrice,
              address: listOrder[i].address,
              status: listOrder[i].status,
              idVendor: listOrder[i].idVendor,
              address: listOrder[i].address,
              idCustomer: listOrder[i].idCustomer,
              shippingCost: listOrder[i].shippingCost,
              couponPercent: listOrder[i].couponPercent,
            };
            listResult.push(object);
          }
        }

        return res.status(200).send({
          success: true,
          code: 0,
          message: "Thành công",
          data: listResult,
        });
      } else {
        return res.status(500).send({
          error: error.message,
          message: "Có lỗi quá trình tìm kiếm !",
          success: false,
        });
      }
    } else {
      return res.status(200).send({
        success: false,
        code: -1,
        message: "URL không hợp lệ",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
async function getDemandByListId(listDemands) {
  if (listDemands.length < 0) return null;
  var listDetailDemand = [];
  var totalPriceDemand = 0;
  for (var i in listDemands) {
    await demandModel
      .findById({ _id: listDemands[i].idDemand })
      .then((result) => {
        result.quantity = listDemands[i].quantity;
        result.total = listDemands[i].quantity * result.price;
        listDetailDemand.push(result);

        totalPriceDemand =
          totalPriceDemand + listDemands[i].quantity * result.price;
      })
      .catch((error) => {
        return error;
      });
  }
  return [listDetailDemand, totalPriceDemand];
}
