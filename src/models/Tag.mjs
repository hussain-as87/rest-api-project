import { DataTypes } from "sequelize";
import { sequelize } from "../middlewares/connection.mjs";

export class Tag {
  constructor() {
    this.Tag = sequelize.define(
      "Tag",
      {
        name: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
      },
      {
        tableName: "tags",
        timestamps: false,
      }
    );
  }

  async index() {
    try {
      return await this.Tag.findAll();
    } catch (err) {
      console.log(err);
    }
  }

  async show(id) {
    const tag = await this.Tag.findByPk(id);
    if (!tag) {
      return "not found !!";
    }
    const posts = sequelize.query(`select * from posts where tag = ${id}`);
    return await posts;
  }

  async create(tag) {
    const new_tag = this.Tag.build(tag);
    await new_tag.save();

    return new_tag;
  }

  async update(id, tag) {
    const updated_tag = await this.Tag.findByPk(id);
    console.log(updated_tag);
    Object.keys(tag).forEach((k) => {
      updated_tag[k] = tag[k];
    });

    await updated_tag.save();

    return updated_tag;
  }

  async destroy(id) {
    await this.Tag.destroy({
      where: {
        id: id,
      },
    });
  }
}
