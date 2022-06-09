import { DataTypes } from "sequelize";
import { sequelize } from "../middlewares/connection.mjs";
import { check_user } from "../middlewares/Permission.mjs";
import { paginate } from "../middlewares/paginations.mjs";
export class Post {
  constructor() {
    this.Post = sequelize.define(
      "Post",
      {
        _id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        image: DataTypes.TEXT,
        status: DataTypes.ENUM("draft", "published"),
        publish_date: new Date().getDate(),
        author: DataTypes.STRING,
        tag: DataTypes.STRING,
      },
      {
        tableName: "posts",
        timestamps: false,
      }
    );
  }

  async index(limit, page, query, tag, excerpt) {
    try {
      let p;
      if (check_user == "admin") {
        if (query != undefined) {
          p = sequelize.query(
            `select * from posts where title like '%${query}%' or content like '%${query}%' `
          );
        } else if (tag) {
          p = this.Post.findAll({
            where: [{ tag: tag }],
          });
        } else {
          p = this.Post.findAll();
        }
        return page || limit ? await paginate(p, limit, page) : p;
      } else {
        if (query != undefined) {
          p = sequelize.query(
            `select * from posts where title like '%${query}%' or content like '%${query}%' and status = 'published'`
          );
        } else if (tag) {
          p = this.Post.findAll({
            where: [{ tag: tag }],
          });
        } else {
          p = this.Post.findAll({ where: [{ status: "published" }] });
        }
        return page || limit ? await paginate(p, limit, page) : p;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async show(id) {
    const post = this.Post.findByPk(id);
    return await post;
  }
  async showById(id) {
    const post = this.Post.findByPk(id);
    if (!post) {
      return { message: "not found !!" };
    }
    const comments = sequelize.query(
      `select * from comments where post_id = ${id}`
    );
    return await comments;
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
