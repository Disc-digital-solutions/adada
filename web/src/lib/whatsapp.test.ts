import { describe, expect, test } from "vitest";
import { contactMessage, whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  test("builds a wa.me link with the message", () => {
    expect(whatsappLink("905331112233", "Hi")).toBe("https://wa.me/905331112233?text=Hi");
  });

  test("strips the plus sign and spaces from the number", () => {
    expect(whatsappLink("+90 533 111 22 33", "Hi")).toBe("https://wa.me/905331112233?text=Hi");
  });

  test("strips a leading 00", () => {
    expect(whatsappLink("00905331112233", "Hi")).toBe("https://wa.me/905331112233?text=Hi");
  });

  test("encodes characters that would break the link", () => {
    expect(whatsappLink("905331112233", "Desk & chair #2?")).toBe(
      "https://wa.me/905331112233?text=Desk%20%26%20chair%20%232%3F",
    );
  });

  test("encodes Arabic text", () => {
    const link = whatsappLink("905331112233", "مرحبا");
    expect(new URL(link).searchParams.get("text")).toBe("مرحبا");
  });
});

describe("contactMessage", () => {
  test("fills the title, the site name and the link into the template", () => {
    expect(
      contactMessage('Hi, I saw "{title}" on {site}: {url}', {
        title: "Study desk",
        site: "Island Market",
        url: "https://example.com/en/l/abc",
      }),
    ).toBe('Hi, I saw "Study desk" on Island Market: https://example.com/en/l/abc');
  });

  test("does not treat braces inside the title as placeholders", () => {
    expect(
      contactMessage("{title} / {site} / {url}", { title: "{url}", site: "S", url: "U" }),
    ).toBe("{url} / S / U");
  });
});
