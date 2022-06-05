export let check_user = null ;
export const user_permission = (per) => {
  return (req, res, next) => {
     check_user = req.session.type;
    if (per.includes(check_user)) {
      next();
    } else {
      return res.status(400).json({ message: "you dont have permission !!" });
    }
  };
};
