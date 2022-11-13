import { Application } from "express";

export default class Index {
  app: Application;
  fileName: string;

  constructor(app: Application, fileName: string) {
    this.app = app;
    this.fileName = fileName;
  }

  async execute(): Promise<void> {
    this.app.get(`/`, (req, res) => {
      res.render(this.fileName, {
        title: `Burcham Designs: Cultivate your Website!`,
      });
    });
  }
}
