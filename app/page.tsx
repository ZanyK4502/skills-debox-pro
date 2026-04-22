import { HomePageContent } from "@/components/home-page-content";
import { categories } from "@/data/categories";
import { getCategoryDisplayStatuses } from "@/lib/display-skills";

export default async function Home() {
  const categoryStatuses = await getCategoryDisplayStatuses(
    categories.map((category) => category.slug),
  );

  return <HomePageContent categoryStatuses={categoryStatuses} />;
}
