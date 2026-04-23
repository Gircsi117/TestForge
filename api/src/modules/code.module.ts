class Code {
  private static SHARE_CODE_CHARS =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  static generateCode(length = 36) {
    return Array.from(
      { length: Math.abs(length) },
      () =>
        this.SHARE_CODE_CHARS[
          Math.floor(Math.random() * this.SHARE_CODE_CHARS.length)
        ],
    ).join("");
  }
}

export default Code;
