import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrGenerator } from "./components/QrGenerator";
import { QrScanner } from "./components/QrScanner";

export function QrCode() {
  return (
    <Tabs defaultValue="generate">
      <TabsList>
        <TabsTrigger value="generate">Generate</TabsTrigger>
        <TabsTrigger value="scan">Scan</TabsTrigger>
      </TabsList>
      <TabsContent value="generate">
        <QrGenerator />
      </TabsContent>
      <TabsContent value="scan">
        <QrScanner />
      </TabsContent>
    </Tabs>
  );
}
