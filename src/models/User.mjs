import { DataTypes } from "sequelize";
import jwt from "jsonwebtoken";
import { _app } from "../../config.mjs";
import { sequelize } from "../middlewares/connection.mjs";
import { check_user_id } from "../middlewares/Permission.mjs";
import bcrypt from "bcrypt";

export class User {
  constructor() {
    this.User = sequelize.define(
      "User",
      {
        _id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        name: DataTypes.STRING,
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          isEmail: true,
        },
        password: DataTypes.TEXT,
        type: DataTypes.ENUM("admin", "author", "user"),
        bio: DataTypes.TEXT,
        f_name: { type: DataTypes.STRING, allowNull: true },
        l_name: { type: DataTypes.STRING, allowNull: true },
        bio: { type: DataTypes.TEXT, allowNull: true },
        links: { type: DataTypes.JSON, allowNull: true },
      },
      {
        tableName: "users",
        timestamps: false,
      }
    );
  }
  async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await this.User.findOne({ where: [{ email: email }] });
    const check_password = await bcrypt.compare(password, user.password);
    if (!check_password) {
      res.status(400).json({ message: "check your email or password !!" });
      return;
    }
    let user_id = user._id;
    let user_type = user.type;
    req.session.type = null;
    req.session.type = user_type;
    req.session.userId = null;
    req.session.userId = user_id;
    const token = jwt.sign({ id: user_id, type: user_type }, _app.secret_key);
    res.json({
      token,
    });
  }

  async index() {
    try {
      return await this.User.findAll();
    } catch (err) {
      console.log(err);
    }
  }

  async show(id) {
    const author = await this.User.findByPk(id);
    if (!author) {
      return "not found !!";
    }
    const posts = sequelize.query(`select * from posts where author = ${id}`);
    return await posts;
  }

  async create(user) {
    const new_user = this.User.build(user);
    await new_user.save();
    return new_user;
  }

  async update(id, user) {
    const updated_user = await this.User.findByPk(id);
    const user_id = check_user_id;

    console.log("the user : " + user_id);
    if (user_id == id) {
      Object.keys(user).forEach((k) => {
        updated_user[k] = user[k];
      });
      await updated_user.save();
      return updated_user;
    } else {
      return "you are not the author !!";
    }
  }

  async destroy(id) {
    await this.User.destroy({
      where: {
        id: id,
      },
    });
  }
}
