import { requireChatGPTUser } from "../../chatgpt-auth";
import { PreviewSite } from "./PreviewSite";

export const dynamic = "force-dynamic";

export default async function AdminPreviewPage() {
  await requireChatGPTUser("/admin/preview");

  return <PreviewSite />;
}
