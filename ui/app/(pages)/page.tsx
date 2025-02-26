import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <Card className="pt-6">
      <CardContent>
        <div className="space-y-3 p-4 m-auto justify-center">
          <h2 className="text-4xl font-semibold text-center">
            {process.env.PROJECT_NAME} admin
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
