import { DataTypes } from "sequelize";
import { sequelize } from "../middlewares/connection.mjs";
import { check_user } from "../middlewares/Permission.mjs";

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
        author: DataTypes.INTEGER,
        tag: DataTypes.INTEGER,
      },
      {
        tableName: "posts",
        timestamps: false,
      }
    );
  }

  async index(limit, page, query) {
    try {
      let p;
      if (check_user == "admin") {
        if (query == undefined) {
          p = this.Post.findAll();
        } else {
          p = sequelize.query(
            `select * from posts where title like '%${query}%' or content like '%${query}%' `
          );
        }
        return page || limit ? await paginate(p, limit, page) : p;
      } else {
        if (query == undefined) {
          p = this.Post.findAll({ where: [{ status: "published" }] });
        } else {
          p = sequelize.query(
            `select * from posts where title like '%${query}%' or content like '%${query}%'`
          );
        }
        return page || limit ? await paginate(p, limit, page) : p;
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
  async tagPost(id) {
    await this.Post.destroy({
      where: {
        id: id,
      },
    });
  }
  async authorPosts(id) {
    await this.Post.destroy({
      where: {
        auther: id,
      },
    });
  }
}

//!pagination
async function paginate(array, page_limit, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return (await array).slice(
    (page_number - 1) * page_limit,
    page_number * page_limit
  );
}
