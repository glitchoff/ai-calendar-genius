
import { Calendar } from "@/components/calendar/Calendar";
import { ApiKeyModal } from "@/components/ApiKeyModal";

const Index = () => {
  return (
    <div className="space-y-8">
      <ApiKeyModal />
      <Calendar />
    </div>
  );
};

export default Index;
