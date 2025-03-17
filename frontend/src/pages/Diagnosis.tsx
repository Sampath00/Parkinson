import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import diagnosisImage from "../assets/DiagnosisImage.webp";

export const Diagnosis = () => {
  return (
    <>
      <Card className="w-full shadow-lg border border-gray-200 bg-white rounded-lg p-6 space-y-8 mt-24 flex flex-row items-center gap-5">
        <Card className="w-1/2 mb-0 shadow-xl border border-gray-300 bg-gradient-to-r from-blue-500 to-gray-700 text-white text-center p-[51px] rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Diagnosis of Parkinson’s Disease
            </CardTitle>
            <p className="text-lg mt-0">
              Understanding how Parkinson’s is identified
            </p>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
              <img
                src={diagnosisImage}
                alt="AI Diagnosis"
                className="w-full h-full object-fit"
              />
            </AspectRatio>
          </CardContent>
        </Card>
        <div className="w-1/2">
          <p className="text-lg text-gray-700 leading-relaxed">
            Diagnosing <strong>Parkinson’s disease</strong> is challenging as
            there is no single test. It is based on clinical evaluation, medical history, and symptom analysis
          </p>
          <div className="space-y-4 mt-4">
            <p className="text-blue-600 font-semibold">
              Neurological Exam:{" "}
              <span className="text-gray-700 font-normal">
                A doctor evaluates movement, coordination, and reflexes.
              </span>
            </p>

            <p className="text-green-600 font-semibold">
              Medical History:{" "}
              <span className="text-gray-700 font-normal">
                Reviewing family history and past symptoms helps assess risk.
              </span>
            </p>

            <p className="text-yellow-600 font-semibold">
              Dopamine Imaging:{" "}
              <span className="text-gray-700 font-normal">
                DaTscan detects dopamine deficiency in the brain.
              </span>
            </p>

            <p className="text-red-600 font-semibold">
              Response to Medication:{" "}
              <span className="text-gray-700 font-normal">
                Doctors prescribe Levodopa and monitor symptom changes.
              </span>
            </p>

            <p className="text-purple-600 font-semibold">
              MRI & CT Scans:{" "}
              <span className="text-gray-700 font-normal">
                Used to rule out other neurological conditions.
              </span>
            </p>

            <p className="text-indigo-600 font-semibold">
              Lab Tests:{" "}
              <span className="text-gray-700 font-normal">
                Blood tests help exclude other possible causes of movement
                disorders.
              </span>
            </p>
            <p className="text-teal-600 font-semibold">
              Genetic Testing:{" "}
              <span className="text-gray-700 font-normal">
                Identifies inherited mutations linked to Parkinson’s.
              </span>
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};
