import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function HtmlJsViewer({ result }) {
  const [activeTab, setActiveTab] = useState("html");
  const [htmlContent, setHtmlContent] = useState("<p>Loading...</p>");
  const [jsContent, setJsContent] = useState("// Loading...");

  useEffect(() => {
    if (!result) return;
    try {
      const json = JSON.parse(result);
      let extractedHtml = "";
      let extractedJs = "";

      if (typeof json.html === 'string') {
        extractedHtml = json.html;
      } else {
        extractedHtml = JSON.stringify(json.html, null, 2);
      }

      if (typeof json.javascript === 'string') {
        extractedJs = json.javascript;
      } else {
        extractedJs = JSON.stringify(json.javascript, null, 2);
      }

      setHtmlContent(extractedHtml);
      setJsContent(extractedJs);
    } catch (e) {
      setHtmlContent("Invalid JSON format");
      setJsContent("Invalid JSON format");
    }
  }, [result]);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          <TabsContent value="html">
            <Label className="mb-2 block">HTML Preview:</Label>
            <div className="w-full border rounded h-64 overflow-auto p-4 bg-white text-sm" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </TabsContent>
          <TabsContent value="js">
            <Label className="mb-2 block">JavaScript:</Label>
            <Textarea
              className="w-full h-64 font-mono text-sm"
              value={jsContent}
              readOnly
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
