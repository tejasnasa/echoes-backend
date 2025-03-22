/* eslint-disable */

import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().notNull().primaryKey().unique(),
  serialId: serial("serial_id").notNull().unique(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 64 }).notNull(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  fullname: varchar("fullname", { length: 64 }).notNull(),
  profile_pic: text("profile_pic"),
  cover_pic: text("cover_pic"),
  bio: text("bio"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const post: any = pgTable("post", {
  id: uuid("id").defaultRandom().notNull().primaryKey().unique(),
  serialId: serial("serial_id").notNull().unique(),
  userId: uuid("userid") 
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text"),
  images: text("images").array(),
  postAboveId: uuid("post_above_id").references(() => post.id, {
    onDelete: "cascade",
  }),
  postAboveSerId: integer("post_above_ser_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const like = pgTable("likes", {
  id: uuid("id").defaultRandom().notNull().primaryKey().unique(),
  userId: uuid("userid")
    .references(() => user.id)
    .notNull(),
  postId: uuid("postid")
    .references(() => post.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmark = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().notNull().primaryKey().unique(),
  userId: uuid("userid")
    .references(() => user.id)
    .notNull(),
  postId: uuid("postid")
    .references(() => post.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const repost = pgTable("reposts", {
  id: uuid("id").defaultRandom().notNull().primaryKey().unique(),
  userId: uuid("userid")
    .references(() => user.id)
    .notNull(),
  postId: uuid("postid")
    .references(() => post.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follow = pgTable("follows", {
  id: uuid("id").defaultRandom().notNull().primaryKey().unique(),
  followerId: uuid("followerid")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  followingId: uuid("followingid")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
