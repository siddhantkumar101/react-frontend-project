import conf from "../conf.js";
import { Client, Databases, Storage } from "appwrite";

export class Service {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)         // Appwrite endpoint
      .setProject(conf.appwriteProjectId);   // Appwrite project ID

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  // ================= CREATE =================
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      const response = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug, // document ID (can also be 'unique()' for auto ID)
        {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId,
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  // ================= READ =================
  async getPost(slug) {
    try {
      const response = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return response;
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }

  async listPosts() {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
      return response.documents;
    } catch (error) {
      console.error("Error listing posts:", error);
    }
  }

  // ================= UPDATE =================
  async updatePost({ slug, title, content, featuredImage, status, userId }) {
    try {
      const response = await this.databases.updateDocument(
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
      return response;
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  // ================= DELETE =================
  async deletePost(slug) {
    try {
      const response = await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return response;
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  // ================= UPLOAD IMAGE =================
  async uploadImage(file) {
    try {
      const response = await this.storage.createFile(
        conf.appwriteBucketId,
        "unique()", // File ID will be auto-generated
        file
      );
      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
}
