import React from "react";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

import ReviewForm from "./ReviewForm";

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("ReviewForm", () => {
  test("skickar recension när formuläret submitas", async () => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        username: "Helen",
      })
    );

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              id: 1,
            },
          }),
      })
    );

    render(<ReviewForm listingId={72} />);

    const form = screen.getAllByText("Skriv recension")[0].closest("form");
    const textarea = within(form).getByPlaceholderText("Skriv din kommentar...");
    const button = within(form).getByRole("button", {
      name: /skicka recension/i,
    });

    await userEvent.type(textarea, "Jättebra produkt!");
    await userEvent.click(button);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:1337/api/reviews",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  test("visar alert om användaren inte är inloggad", async () => {
    window.alert = vi.fn();
    global.fetch = vi.fn();

    render(<ReviewForm listingId={72} />);

    const form = screen.getAllByText("Skriv recension")[0].closest("form");
    const textarea = within(form).getByPlaceholderText("Skriv din kommentar...");
    const button = within(form).getByRole("button", {
      name: /skicka recension/i,
    });

    await userEvent.type(textarea, "Test recension");
    await userEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith(
      "Du måste vara inloggad för att skriva en recension"
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});