import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("Not found", () => {
  it("returns JSON error for unknown route", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "route not found",
    });
  });
});
