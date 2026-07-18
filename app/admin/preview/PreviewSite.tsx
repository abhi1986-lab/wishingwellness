"use client";

import { useEffect, useState } from "react";
import { WishingWellnessSite } from "../../WishingWellnessSite";
import { defaultSiteContent, mergeSiteContent, SiteContent } from "../../site-content";

export function PreviewSite() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("wishing-wellness-preview-content");
    if (!stored) {
      setContent(defaultSiteContent);
      return;
    }

    try {
      setContent(mergeSiteContent(JSON.parse(stored)));
    } catch {
      setContent(defaultSiteContent);
    }
  }, []);

  if (!content) {
    return <p className="admin-empty">Loading preview...</p>;
  }

  return (
    <>
      <div className="preview-frame-banner">
        <strong>Preview only</strong>
        <span>These changes are not live until you publish from the admin editor.</span>
        <a className="button secondary small" href="/admin">
          Back to admin
        </a>
      </div>
      <WishingWellnessSite content={content} />
    </>
  );
}
