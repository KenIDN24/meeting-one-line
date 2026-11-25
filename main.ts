// The Meeting That Should Have Been One Line
// Entry: one sentence that could have replaced an entire pointless meeting.
// Line (95 chars, verified with python len()):
// "The answer is 'no,' but I've booked us 45 minutes so each of you can arrive at it individually."
// Guard: entry must be 1-200 chars, exactly one sentence, single line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The answer is 'no,' but I've booked us 45 minutes so each of you can arrive at it individually.";

function fail(msg: string): never {
  console.error(`entry rejected: ${msg}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const trimmed = LINE.trim();
if (trimmed.length === 0) fail("entry is empty or only whitespace");
if (trimmed.length > 200) fail(`entry must be 1-200 characters, got ${trimmed.length}`);
if (trimmed.includes("\n") || trimmed.includes("\r")) fail("entry must be a single line");
// Exactly one sentence: exactly one sentence-terminating period, at the end.
const terminators = (trimmed.match(/[.!?]/g) ?? []).length;
if (terminators !== 1 || !trimmed.endsWith(".")) {
  fail("entry must be exactly one sentence");
}
// No hidden second sentence: no ". " followed by a capital letter inside.
if (/\. [A-Z]/.test(trimmed)) fail("entry contains a second sentence");
// Reject control characters (invisible bytes that would change the entry on disk).
if (/[\u0000-\u001F\u007F]/.test(trimmed)) fail("entry contains control characters");

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, trimmed + "\n", "utf8");
// Read-back check: what is on disk must be exactly the line plus newline.
if (readFileSync(target, "utf8") !== trimmed + "\n") {
  fail("read-back mismatch: file on disk differs from the entry");
}
console.log(`wrote entry.txt (${trimmed.length} chars)`);
