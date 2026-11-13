import { describe, expect, it } from "vitest";
import { groupPost, teamAdMessage, type TeamAdLabels } from "./share-text";

describe("groupPost", () => {
  const lines = ["Fotoğraflar ve satıcıya WhatsApp:", "Photos and WhatsApp the seller:", "الصور ومراسلة البائع على واتساب:"];

  it("puts the title, the price and city, one line per language, then one link", () => {
    expect(
      groupPost({ title: "Study desk, like new", price: "₺1,500", city: "Famagusta", lines, url: "https://x.test/l/abc" }),
    ).toBe(
      [
        "Study desk, like new",
        "₺1,500 · Famagusta",
        "",
        "Fotoğraflar ve satıcıya WhatsApp:",
        "Photos and WhatsApp the seller:",
        "الصور ومراسلة البائع على واتساب:",
        "https://x.test/l/abc",
      ].join("\n"),
    );
  });

  it("leaves the price out when there is none", () => {
    const text = groupPost({ title: "Desk", price: null, city: "Nicosia", lines: ["See:"], url: "u" });
    expect(text).toBe("Desk\nNicosia\n\nSee:\nu");
  });

  it("drops the facts line when there is neither price nor city", () => {
    const text = groupPost({ title: "Desk", price: null, city: "", lines: ["See:"], url: "u" });
    expect(text).toBe("Desk\n\nSee:\nu");
  });
});

describe("teamAdMessage", () => {
  const labels: TeamAdLabels = {
    intro: "New ad for Island Market",
    kind: "Type",
    kindValue: "I am selling",
    title: "Title",
    price: "Price",
    category: "Category",
    city: "City",
    description: "Description",
    photos: "I will send the photos in this chat.",
  };

  it("lists every field the team needs, in the seller's words", () => {
    expect(
      teamAdMessage(
        { title: " Desk ", price: "₺500", category: "Furniture", city: "Famagusta", description: "Clean.\nPick up only.", hasPhotos: true },
        labels,
      ),
    ).toBe(
      [
        "New ad for Island Market",
        "",
        "Type: I am selling",
        "Title: Desk",
        "Price: ₺500",
        "Category: Furniture",
        "City: Famagusta",
        "",
        "Description:",
        "Clean.\nPick up only.",
        "",
        "I will send the photos in this chat.",
      ].join("\n"),
    );
  });

  it("leaves out what was not filled in", () => {
    expect(
      teamAdMessage({ title: "Desk", price: null, category: "", city: "Nicosia", description: "  ", hasPhotos: false }, labels),
    ).toBe(["New ad for Island Market", "", "Type: I am selling", "Title: Desk", "City: Nicosia"].join("\n"));
  });
});
