import { describe, expect, it } from "vitest";
import { MemoryAuthenticationService } from "./authenticationService.server";

describe('MemoryAuthenticationService', () => {
  const service = new MemoryAuthenticationService()

  it("return true when username and password is correct", async () => {
    const result = await service.verifyPassword("admin", "admin")
    expect(result).toBe(true)
  })

  it("return false when username or password is incorrect", async () => {
    const wrongUsername = await service.verifyPassword("admin_", "admin")
    expect(wrongUsername).toBe(false)
    const wrongPassword = await service.verifyPassword("admin", "admin_")
    expect(wrongPassword).toBe(false)
    const bothWrong = await service.verifyPassword("admin_", "admin_")
    expect(bothWrong).toBe(false)
  })
})
