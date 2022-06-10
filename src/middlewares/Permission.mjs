export let check_user;
export let check_user_id;
export const user_permission = (per) => {
  return (req, res, next) => {
     check_user = req.session.type;
     check_user_id = req.session.userId;
    if (per.includes(check_user)) {
      next();
    } else {
      return res.status(400).json({ message: "you dont have permission !!" });
    }
  };
};
