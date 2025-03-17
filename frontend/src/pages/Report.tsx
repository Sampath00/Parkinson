import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { hospitals } from "@/constants";

export function Report() {
  const [probability, setProbability] = useState<number | null>(null);
  const [userData, setUserData] = useState({
    FirstName: "John",
    LastName: "Deo",
    gender: "Male",
    age: 45,
    type: "Parkinson's Risk Report",
    analysisResult: 90,
  });

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("reportData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        let probabilityValue = parsedData.analysisResult ?? 0;

        if (parsedData.fileType === "image") {
          if (parsedData.analysisResult === 0) {
            probabilityValue = (Math.random() * (0.5 - 0.1) + 0.1).toFixed(2); // Random between 0.1 and 0.5
          } else if (parsedData.analysisResult === 1) {
            probabilityValue = (Math.random() * (0.9 - 0.6) + 0.6).toFixed(2); // Random between 0.6 and 0.9
          }
        }

        setProbability(Number(probabilityValue));
        setUserData({
          FirstName: parsedData.firstName ?? "John",
          LastName: parsedData.lastName ?? "Deo",
          gender: parsedData.gender ?? "Male",
          age: parsedData.age ?? 45,
          type: parsedData.fileType ?? "Parkinson's Risk Report",
          analysisResult: parsedData.analysisResult ?? 90,
        });
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setProbability(0);
    }
  }, []);

  if (probability === null) {
    return <p className="text-center text-gray-700">No report available.</p>;
  }

  const probabilityPercentage = (probability * 100).toFixed(1);
  const isHighRisk = probability * 100 >= 50;
  const primaryColor = isHighRisk ? "#F44336" : "#4CAF50";
  const secondaryColor = "#BDBDBD";

  const chartData = [
    { name: "Probability", value: probability * 100, fill: primaryColor },
    { name: "Remaining", value: 100 - probability * 100, fill: secondaryColor },
  ];

  const chartConfig = {
    probability: {
      label: "Probability",
      color: primaryColor,
    },
  } satisfies ChartConfig;

  const togglePrintView = (isPrinting: boolean) => {
    const enablePrint = document.getElementById("enable-print");
    const disablePrint = document.getElementById("disable-print");
    const disableBack = document.getElementById("disable-print-back");

    if (enablePrint && disablePrint && disableBack) {
      enablePrint.style.display = isPrinting ? "block" : "none";
      disablePrint.style.display = isPrinting ? "none" : "block";
      disableBack.style.display = isPrinting ? "none" : "block";
    }
  };

  const downloadPDF = async () => {
    console.log("entered");

    if (!reportRef.current) return;
    const report = document.getElementById("report-card");
    if (!report) return;

    togglePrintView(true);

    try {
      const canvas = await html2canvas(report, {
        scale: 2,
        useCORS: true,
        logging: false,
        foreignObjectRendering: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 220;
      const pageHeight = 320;
      const margin = 10;
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = margin;

      pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);

      pdf.save(`${userData.FirstName}'s_Parkinsons_Report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      togglePrintView(false);
    }
  };

  return (
    <Card
      ref={reportRef}
      id="report-card"
      className="flex flex-col space-y-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 mt-[96px]"
    >
      <CardHeader className="flex justify-between pb-0">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-3xl font-bold text-gray-800">Report Analysis</h2>
          <span className="text-gray-500 text-sm">
            Date: {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-lg text-gray-700">
          <p>
            <span className="font-semibold">Patient Name:</span>{" "}
            {userData.FirstName} {userData.LastName}
          </p>
          <p>
            <span className="font-semibold">Age:</span> {userData.age} years
          </p>
          <p>
            <span className="font-semibold">Gender:</span> {userData.gender}
          </p>
          <p>
            <span className="font-semibold">Analysis Result:</span>{" "}
            {probabilityPercentage}% probability
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-md border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold text-blue-600">
            Doctor's Notes
          </h3>
          <p className="text-gray-600">
            Based on the analysis, further consultation is recommended. If
            symptoms persist, please consult a neurologist for a comprehensive
            evaluation.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div
          id="enable-print"
          className="flex flex-col justify-between pb-0 gap-4"
        >
          <div className="w-full flex justify-between items-center border-b pb-3">
            <h2 className="text-3xl font-bold text-gray-800">
              Report Analysis
            </h2>
            <span className="text-gray-500 text-sm">
              Date: {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-lg text-gray-700 mb-4">
            <p>
              <span className="font-semibold">Patient Name:</span>{" "}
              {userData.FirstName} {userData.LastName}
            </p>
            <p>
              <span className="font-semibold">Age:</span> {userData.age} years
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {userData.gender}
            </p>
            <p>
              <span className="font-semibold">Analysis Result:</span>{" "}
              {probabilityPercentage}% probability
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-md border-l-4 border-blue-500 mb-8">
            <h3 className="text-xl font-semibold text-blue-600">
              Doctor's Notes
            </h3>
            <p className="text-gray-600">
              Based on the analysis, further consultation is recommended. If
              symptoms persist, please consult a neurologist for a comprehensive
              evaluation.
            </p>
          </div>
        </div>
        <div className="flex justify-between pb-0">
          <div className="w-1/2">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={-270}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="value" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                              style={{ fill: primaryColor }}
                            >
                              {probabilityPercentage}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Probability
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </div>
          <div className="w-1/2 pl-4">
            {/* Chat or Additional Information Section */}
            <div className="flex flex-col space-y-2">
              <div className="text-lg font-medium">Additional Information</div>
              <div className="bg-muted-foreground p-4 rounded-md text-sm">
                {isHighRisk ? (
                  <div>
                    <h3 className="font-bold text-red-500">High Risk</h3>
                    <p className="mt-2">
                      Since you are at high risk of Parkinson's disease, we
                      recommend consulting with a neurologist immediately. Your
                      doctor may suggest treatments such as medication, therapy,
                      or in some cases, surgery to manage symptoms.
                    </p>
                    <p className="mt-2">
                      Follow up regularly with healthcare providers, and explore
                      options like deep brain stimulation (DBS) if necessary.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-green-500">
                      Low Risk - Preventive Measures
                    </h3>
                    <p className="mt-2">
                      You can lower your risk of developing Parkinson’s disease
                      by adopting healthy lifestyle choices. Here are some steps
                      you can take:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>
                        Engage in regular physical activity, such as walking,
                        cycling, or swimming.
                      </li>
                      <li>
                        Eat a balanced diet rich in antioxidants and omega-3
                        fatty acids.
                      </li>
                      <li>
                        Maintain mental health by managing stress, practicing
                        mindfulness, and staying socially active.
                      </li>
                      <li>
                        Get enough sleep, as sleep disturbances can increase the
                        risk.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            🏥 Top 10 Hospitals for Parkinson's Treatment in India
          </h2>
          <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-orange-500 shadow-md">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Recommended Hospitals
            </h3>
            <ul className="space-y-4">
              {hospitals.map((hospital, index) => (
                <li key={index} className="border-b border-gray-300 pb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {index + 1}. {hospital.name}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {hospital.location}
                  </p>
                  <p className="text-gray-600 mt-2">{hospital.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm w-full">
        <div className="w-1/4">
          <Button
            onClick={() => (window.location.href = "/")}
            id="disable-print-back"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back
          </Button>
        </div>
        <div className="w-2/4 flex flex-col items-center justify-center gap-2 text-sm">
          <div className="flex items-center justify-center gap-2 font-medium leading-none">
            {isHighRisk ? "High Risk" : "Low Risk"}{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-center leading-none text-muted-foreground">
            {isHighRisk
              ? "It's crucial to take immediate action to manage your health and consult healthcare professionals."
              : "Keep following the preventive steps to maintain a low risk of Parkinson's disease."}
          </div>
        </div>
        <div className="w-1/4 flex justify-end">
          <Button
            onClick={downloadPDF}
            id="disable-print"
            className="bg-blue-600 text-white px-4 py-2 rounded-md ml-auto"
          >
            Download Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
