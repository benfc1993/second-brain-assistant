import { readFileSync } from "fs";
import { createCalendarEvent } from "./createCalendarEvent";
import path from "path";

describe("create calendar event", () => {
  it("should create an event with a defined date", async () => {
    await createCalendarEvent("its Marks birthday on the 21st of August");
    const file = readFileSync(path.resolve(__dirname, "../out.ics")).toString();
    expect(
      file.includes(
        `DTSTART;TZID=Europe/London:${new Date().getFullYear()}0821T000000`,
      ),
    ).toBeTruthy();
  });
  it("should create an event with a defined start time", async () => {
    await createCalendarEvent(
      "the shopping is arriving on the 21st of August at 17:25",
    );
    const file = readFileSync(path.resolve(__dirname, "../out.ics")).toString();
    expect(
      file.includes(
        `DTSTART;TZID=Europe/London:${new Date().getFullYear()}0821T172500`,
      ),
    ).toBeTruthy();
  });

  it("should create an event with a defined end time", async () => {
    await createCalendarEvent(
      "The planning meeting will be on the 13th of March from 09:21 until 11:30",
    );
    const file = readFileSync(path.resolve(__dirname, "../out.ics")).toString();
    expect(
      file.includes(
        `DTSTART;TZID=Europe/London:${new Date().getFullYear()}0313T092100`,
      ),
    ).toBeTruthy();
    expect(
      file.includes(
        `DTEND;TZID=Europe/London:${new Date().getFullYear()}0313T113000`,
      ),
    ).toBeTruthy();
  });

  it("should create an event with a relative end time", async () => {
    await createCalendarEvent(
      "The planning meeting will be on the 13th of March from 09:21 for 2 hours",
    );
    const file = readFileSync(path.resolve(__dirname, "../out.ics")).toString();
    expect(
      file.includes(
        `DTSTART;TZID=Europe/London:${new Date().getFullYear()}0313T092100`,
      ),
    ).toBeTruthy();
    expect(
      file.includes(
        `DTEND;TZID=Europe/London:${new Date().getFullYear()}0313T112100`,
      ),
    ).toBeTruthy();
  });
});
