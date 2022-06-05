import { DataTypes, where } from "sequelize";
import { sequelize } from "../connection.mjs";
import { check_user, user_permission } from "../Permission.mjs";

export class Post {
  constructor() {
    this.Post = sequelize.define(
      "Post",
      {
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        image: DataTypes.TEXT,
        status: DataTypes.ENUM("draft", "published"),
        publish_date: new Date().getDate(),
        auther: DataTypes.INTEGER,
      },
      {
        tableName: "posts",
        timestamps: false,
      }
    );
  }

  async index() {
    try {
        if (check_user == "admin") {
          return await this.Post.findAll();
        } else {
          return await this.Post.findAll({
            where: [{ status: "draft" }],
          });
        }
    } catch (err) {
      console.log(err);
    }
  }

  async show(id) {
    return await this.Post.findByPk(id);
  }

  async create(post) {
    const new_post = this.Post.build(post);
    await new_post.save();

    return new_post;
  }

  async update(id, post) {
    const update_post = await this.Post.findByPk(id);
    Object.keys(post).forEach((k) => {
      update_post[k] = post[k];
    });

    await update_post.save();

    return update_post;
  }

  async destroy(id) {
    await this.Post.destroy({
      where: {
        id: id,
      },
    });
  }
}
