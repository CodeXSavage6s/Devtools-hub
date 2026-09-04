import { Routes, Route } from "react-router-dom";
import { Shell } from "@/components/layout/Shell";
import { Home } from "@/pages/Home";
import { JsonInspectorPage } from "@/pages/JsonInspectorPage";
import { JwtDecoderPage } from "@/pages/JwtDecoderPage";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="json-inspector" element={<JsonInspectorPage />} />
        <Route path="jwt-decoder" element={<JwtDecoderPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
