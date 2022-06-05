import { DataTypes } from "sequelize";
import { sequelize } from "../connection.mjs";
import jwt from "jsonwebtoken";
import { _app } from "../../config.mjs";

export class User {
  constructor() {
    this.User = sequelize.define(
      "User",
      {
        name: DataTypes.STRING,
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          isEmail: true,
        },
        password: DataTypes.TEXT,
        type: DataTypes.ENUM("admin", "auther", "user"),
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
    const user = await this.User.findOne({
      attributes: ["name", "email", "type"],
      where: [{ email: email }, { password: password }],
    });

    if (!user) {
      res.status(400).json({ message: "user undefined !!" });
      return;
    }
    let user_id = user.id;
    let user_type = user.type;
    req.session.type = null;
    req.session.type = user_type;
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
    return await this.User.findByPk(id);
  }

  async create(user) {
    const new_user = this.User.build(user);
    await new_user.save();

    return new_user;
  }

  async update(id, user) {
    const updated_user = await this.User.findByPk(id);
    console.log(updated_user);
    Object.keys(user).forEach((k) => {
      updated_user[k] = user[k];
    });

    await updated_user.save();

    return updated_user;
  }

  async destroy(id) {
    await this.User.destroy({
      where: {
        id: id,
      },
    });
  }
}
