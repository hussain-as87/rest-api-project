import { DataTypes } from "sequelize";
import { sequelize } from "../middlewares/connection.mjs";

export class Comment {
  constructor() {
    this.Comment = sequelize.define(
      "Comment",
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        comment: DataTypes.TEXT,
        post_id: DataTypes.INTEGER,
      },
      {
        tableName: "comments",
        timestamps: false,
      }
    );
  }

  async index() {
    try {
      return await this.Comment.findAll();
    } catch (err) {
      console.log(err);
    }
  }

  async show(id) {
    return await this.Comment.findByPk(id);
  }

  async create(commet) {
    const new_commet = this.Comment.build(commet);
    await new_commet.save();

    return new_commet;
  }
/* 
  async update(id, comment) {
    const update_commet = await this.Comment.findByPk(id);
    Object.keys(comment).forEach((k) => {
      update_commet[k] = comment[k];
    });

    await update_commet.save();

    return update_commet;
  }
 */
  async destroy(id) {
    if (!id) {
      return {message:"not found !!"}
    }
    await this.Comment.destroy({
      where: {
        id: id,
      },
    });
  }
}
