declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    TEAM_LOGIN_ALIASES?: string;
  }
}
