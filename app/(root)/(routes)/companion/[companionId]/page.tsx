import prisma from "@/lib/prismadb";
import CompanionForm from "./components/companion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return auth().redirectToSignIn({
      returnBackUrl: "/",
    });
  }
  // TODO Check Subscription

  const companion = await prisma.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });

  const categories = await prisma.category.findMany();
  console.log("UserId found!");

  return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
