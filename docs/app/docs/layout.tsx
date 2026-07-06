import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = source.getPageTree();

  return (
    <DocsLayout
      tree={tree}
      tabs={[
        {
          title: "Documentation",
          description: "Guides and API reference for every component package",
          url: "/docs",
        },
        {
          title: "Changelog",
          description: "What changed in each package release",
          url: "/docs/changelog",
        },
      ]}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
