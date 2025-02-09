
import { Calendar } from "@/components/calendar/Calendar";
import { ApiKeyForm } from "@/components/ApiKeyForm";

const Index = () => {
  return (
    <div className="space-y-8">
      <ApiKeyForm />
      <Calendar />
    </div>
  );
};

export default Index;
