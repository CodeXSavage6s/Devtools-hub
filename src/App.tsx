import { Routes, Route } from "react-router-dom";
import { Shell } from "@/components/layout/Shell";
import { Home } from "@/pages/Home";
import { JsonInspectorPage } from "@/pages/JsonInspectorPage";
import { JwtDecoderPage } from "@/pages/JwtDecoderPage";
import { UrlEncoderPage } from "@/pages/UrlEncoderPage";
import { UrlBuilderPage } from "@/pages/UrlBuilderPage";
import { UrlInspectorPage } from "@/pages/UrlInspectorPage";
import { NumberConverterPage } from "@/pages/NumberConverterPage";
import { QrCodePage } from "@/pages/QrCodePage";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="json-inspector" element={<JsonInspectorPage />} />
        <Route path="jwt-decoder" element={<JwtDecoderPage />} />
        <Route path="url-encoder" element={<UrlEncoderPage />} />
        <Route path="url-builder" element={<UrlBuilderPage />} />
        <Route path="url-inspector" element={<UrlInspectorPage />} />
        <Route path="number-converter" element={<NumberConverterPage />} />
        <Route path="qr-code" element={<QrCodePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
