import { isAdmin } from "@/lib/auth";
import { getApplications } from "@/lib/content";
import { readCv } from "@/lib/storage";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/admin/ung-tuyen/[id]/cv">,
) {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await ctx.params;
  const applications = await getApplications();
  const application = applications.find((item) => item.id === id);

  if (!application?.cvFile) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const { buffer } = await readCv(application.cvFile);
    const fallback = application.cvFile.replace(/^[^-]+-/, "");
    const name = (application.cvOriginalName || fallback).replace(/["\r\n]/g, "");
    const encoded = encodeURIComponent(name);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(buffer.length),
        "Content-Disposition": `attachment; filename="cv-${id}"; filename*=UTF-8''${encoded}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
