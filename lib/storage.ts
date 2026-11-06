import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { sanitizeFileName } from "./utils";

const uploadsDir = path.join(process.cwd(), "data", "uploads", "applications");
const ALLOWED = new Map<string, string[]>([
  ["application/pdf", [".pdf"]],
  ["application/msword", [".doc"]],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    [".docx"],
  ],
]);
const ALLOWED_EXT = [".pdf", ".doc", ".docx"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function saveCv(file: File, id: string) {
  if (!file || file.size === 0) return { ok: true as const, stored: null, original: null };
  if (file.size > MAX_SIZE) return { ok: false as const, error: "size" };

  const ext = path.extname(file.name).toLowerCase();
  const typeAllowed = ALLOWED.get(file.type)?.includes(ext) ?? false;
  if (!ALLOWED_EXT.includes(ext) || (file.type && !typeAllowed)) {
    return { ok: false as const, error: "type" };
  }

  await fs.mkdir(uploadsDir, { recursive: true });
  const safe = sanitizeFileName(path.basename(file.name, ext)) || "cv";
  const stored = `${id}-${safe}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, stored), buffer);
  return { ok: true as const, stored, original: file.name };
}

export async function readCv(stored: string) {
  const safe = path.basename(stored);
  const full = path.join(uploadsDir, safe);
  const buffer = await fs.readFile(full);
  return { buffer, full };
}

export async function deleteCv(stored: string | null) {
  if (!stored) return;
  try {
    await fs.unlink(path.join(uploadsDir, path.basename(stored)));
  } catch {
    // File may already be missing; nothing else to do.
  }
}

export const CV_MAX_SIZE = MAX_SIZE;
