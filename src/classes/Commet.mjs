import { DataTypes } from "sequelize";
import { sequelize } from "../connection.mjs";

export class Comment {
  constructor() {
    this.Commemt = sequelize.define(
      "Commemt",
      {
        user_id: DataTypes.INTEGER,
        commet: DataTypes.INTEGER,
      },
      {
        tableName: "commets",
        timestamps: false,
      }
    );
  }

  async index() {
    try {
      return await this.Commemt.findAll();
    } catch (err) {
      console.log(err);
    }
  }

  async show(id) {
    return await this.Commemt.findByPk(id);
  }

  async create(commet) {
    const new_commet = this.Commemt.build(commet);
    await new_commet.save();

    return new_commet;
  }

  async update(id, commet) {
    const update_commet = await this.Commemt.findByPk(id);
    Object.keys(commet).forEach((k) => {
      update_commet[k] = commet[k];
    });

    await update_commet.save();

    return update_commet;
  }

  async destroy(id) {
    await this.Commemt.destroy({
      where: {
        id: id,
      },
    });
  }
}
