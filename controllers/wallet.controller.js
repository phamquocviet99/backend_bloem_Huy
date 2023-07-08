import walletModel from "../models/wallet.model.js";

export const getWallet = async (req, res) => {
  try {
    const check = await walletModel.findById({ _id: req.params.id });
    if (check) {
      return res.status(200).send({
        success: true,
        code: 0,
        message: "Thành công",
        data: check,
      });
    } else {
      const newWallet = new walletModel({
        _id: req.params.id,
      });
      await newWallet
        .save()
        .then((result) => {
          res.status(200).send({
            success: true,
            code: 0,
            message: "Thành công",
            data: result,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
            message: "Không thành công",
            success: false,
          });
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: "Không thành công", success: false });
  }
};

export const deposit = async (req, res) => {
  await transaction(
    req.params.id,
    req.body.amount,
    req.body.content,
    "deposit",
    res
  );
};
export const withDraw = async (req, res) => {
  await transaction(
    req.params.id,
    req.body.amount,
    req.body.content,
    "withDraw",
    res
  );
};

export async function transaction(id, amount, content, type, res) {
  try {
    const typeTransaction = type === "deposit" ? true : false;
    //True là vào false là ra
    const wallet = await walletModel.findById({
      _id: id,
    });

    if (!wallet) {
      return res
        .status(500)
        .json({ error: err, message: "Không thành công", success: false });
    }

    var his = wallet.history;

    const trans = {
      type: type,
      content: content,
      amount: parseInt(amount),
    };
    his.push(trans);
    await walletModel
      .findByIdAndUpdate(
        { _id: id },
        {
          sumWithDraw: typeTransaction
            ? wallet.sumWithDraw
            : wallet.sumWithDraw + amount,
          sumDeposit: !typeTransaction
            ? wallet.sumDeposit
            : wallet.sumDeposit + amount,
          sum: typeTransaction
            ? wallet.sum + amount
            : wallet.sum - amount <= 0
            ? 0
            : wallet.sum - amount,
          history: his,
        },
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
      .catch((err) => {
        return res
          .status(500)
          .json({ error: err, message: "Không thành công", success: false });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ error: err, message: "Không thành công", success: false });
  }
}

export async function paymentPayout(id, amount, content, type) {
  try {
    const typeTransaction = type === "payout" ? true : false;
  
    const wallet = await walletModel.findById({
      _id: id,
    });

    if (!wallet) {
      return false;
    }

    var his = wallet.history;

    const trans = {
      type: type,
      content: content,
      amount: parseInt(amount),
    };
    his.push(trans);
    await walletModel
      .findByIdAndUpdate(
        { _id: id },
        {
          sumWithDraw: typeTransaction
            ? wallet.sumWithDraw
            : wallet.sumWithDraw + amount,
          sumDeposit: !typeTransaction
            ? wallet.sumDeposit
            : wallet.sumDeposit + amount,
          sum: typeTransaction
            ? wallet.sum + amount
            : wallet.sum - amount <= 0
            ? 0
            : wallet.sum - amount,
          history: his,
        },
        { new: true }
      )
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  } catch (error) {
    return false;
  }
}
