import { describe, expect, it } from "vitest";
import { depositLetter } from "./DepositTool";

describe("depositLetter", () => {
  it("writes the same facts in Turkish and English", () => {
    const text = depositLetter({ tenant: "Ahmad K.", landlord: "Mehmet Bey", address: "Karakol B4", amount: "£450", left: "2027-06-10" });
    expect(text).toContain("Sayın Mehmet Bey,");
    expect(text).toContain("Dear Mehmet Bey,");
    expect(text.match(/£450/g)).toHaveLength(2);
    expect(text.match(/2027-06-10/g)).toHaveLength(2);
    expect(text.trim().endsWith("Ahmad K.")).toBe(true);
  });

  it("leaves a visible gap for anything not filled in, never 'undefined'", () => {
    const text = depositLetter({ tenant: "", landlord: "", address: "", amount: "", left: "" });
    expect(text).not.toContain("undefined");
    expect(text).toContain("Dear …,");
  });
});
