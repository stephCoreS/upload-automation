const puppeteer = require("puppeteer");
const fs = require("fs").promises;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Read data from the JSON file
    const jsonData = await fs.readFile("dentaltownScrape.json");
    const courses = JSON.parse(jsonData);

    for (const course of courses) {
      await page.goto("https://usdentalcecourses.com/submit-course/");
      await page.waitForSelector(".pf-body");

      await page.type("input#job_title", course.title);
      await page.type("input#author", course.speaker);

      // Switch to the iframe for job description
      await page.waitForSelector("iframe#job_description_ifr");
      const jobDescriptionIframeElement = await page.$(
        "iframe#job_description_ifr"
      );
      const jobDescriptionIframe =
        await jobDescriptionIframeElement.contentFrame();
      await jobDescriptionIframe.type("body", course.description);

      await page.type("input#credit-hours", course.CE_Credits.toString());
      await page.type("input#job_website", course.urllink);

      await page.type("input.select2-search__field", course.Category);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await page.keyboard.press("Enter");

      await page.select("select#format", course.format);
      await page.type("input#cost", course.Cost);

      // Switch to the iframe for learning objectives
      await page.waitForSelector("iframe#learning-objectives_ifr");
      const learningObjectivesIframeElement = await page.$(
        "iframe#learning-objectives_ifr"
      );
      const learningObjectivesIframe =
        await learningObjectivesIframeElement.contentFrame();
      await learningObjectivesIframe.type("body", course.educationalObjectives);

      await page.type("input#source", course.Source);

      // Click the submit button
      await page.click("button[type=submit]");

      await page.waitForNavigation();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
})();
