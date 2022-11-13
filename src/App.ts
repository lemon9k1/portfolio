import "dotenv/config";
import express, { Application } from "express";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";

export default class App {
  dev: boolean;
  app: Application;
  port: number;

  constructor() {
    this.dev = JSON.parse(process.env.DEV as string);
    this.app = express();
    this.port = JSON.parse(process.env.PORT as string);

    this.listeners();
    this.routes();
    this.views();
    this.static();
  }

  listeners(): void {
    this.app.listen(this.port, () => {
      console.log(`App successfully listening on port ${this.port}!`);
    });
  }

  async routes(): Promise<void> {
    const pathToFiles = `./src/routes`;
    const files = fs
      .readdirSync(path.resolve(pathToFiles))
      .filter((file) => file.endsWith(`.ts`));

    for (const file of files) {
      const fileName = file.replace(`.ts`, ``);

      const importedFile = await import(
        path.resolve(`${pathToFiles}/${fileName}`)
      );
      const importedClass = new importedFile.default(this.app, fileName);

      importedClass.execute();
    }
  }

  views(): void {
    this.app.engine("handlebars", engine());
    this.app.set("view engine", "handlebars");
    this.app.set("views", path.resolve(`./public/views`));
  }

  static(): void {
    this.app.use(express.static(path.resolve(`./public/assets`)));
  }
}

export const app = new App();
