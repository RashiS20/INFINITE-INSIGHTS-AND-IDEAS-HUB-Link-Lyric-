import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from "../conf.js";

export class Service {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteurl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Bucket(this.client);
  }
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("Appwrite CreatePost error", error);
    }
  }

  async updateDocument(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Appwrite UpdateDocument error", error);
    }
  }

  async deletePost(slug) {
    try {
      return await this.databases.deletePost(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite DeleteDocument error", error);
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getPost(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite GetPost error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite GetPosts error", error);
      return false;
    }
  }

  //file upload
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBuckerId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite Upload error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBuckerId, fileId);
    } catch (error) {
      console.log("Appwrite Delete error", error);
      return false;
    }
  }
  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBuckerId, fileId);
  }
}
const service = new Service();
export default service;
