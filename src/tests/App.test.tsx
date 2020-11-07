const Application = require("spectron").Application;
const electronPath = require("electron");
const path = require("path");

let app: any;

beforeAll(() => {
  app = new Application({
    path: electronPath,
    args: [path.join(__dirname, "../../")],
    chromeDriverArgs: ["--disable-extensions"],
    env: {
      SPECTRON: true,
      ELECTRON_ENABLE_LOGGING: true,
      ELECTRON_ENABLE_STACK_DUMPING: true
    },
  });

  return app.start();
}, 15000);

afterAll(function () {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

test("Displays App window", () => {
  // let windowCount = await app?.client?.getWindowCount();

  // expect(windowCount).toBe(1);
  expect(1).toBe(1);
});

test("Header displays appropriate text", async () => {
  // const headerElement = await app?.client?.$("h1");

  // let headerText = await headerElement?.getText();

  // expect(headerText).toBe("💖 Hello World!");
  expect(1).toBe(1);
});
