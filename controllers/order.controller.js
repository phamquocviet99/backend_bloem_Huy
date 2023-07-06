import orderModel from "../models/order.model.js";
import demandModel from "../models/demand.model.js";

export const post = async (req, res) => {
  try {
    if (
      !req.body.shippingCost ||
      !req.body.idVendor ||
      !req.body.address ||
      !req.body.idCustomer ||
      !req.body.couponPercent
    ) {
      res.status(200).send({
        success: false,
        code: -1,
        message: "Thiếu trường dữ liệu !",
      });
      return;
    }
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
      number: parseInt(oldNumber.maxNumber + 1),
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
