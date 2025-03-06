import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import diagnosisImage from '../assets/DiagnosisImage.webp';

export const Diagnosis = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-xl border border-gray-300 bg-white rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Diagnosis of Parkinson’s Disease
          </CardTitle>
          <p className="text-gray-600 text-sm">Understanding how Parkinson’s is identified</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Section */}
          <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
            <img
              src={diagnosisImage}
              alt="Parkinson's Disease Diagnosis"
              className="w-full h-full"
            />
          </AspectRatio>

          {/* Description */}
          <p className="text-lg text-gray-700 leading-relaxed">
            Diagnosing <strong>Parkinson’s disease</strong> is challenging as there is no single test. It is based on <strong>clinical evaluation, medical history, and symptom analysis</strong>.
          </p>

          <Separator />

          {/* Diagnosis Methods */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-blue-600 bg-blue-100">🩺 Neurological Exam</Badge>
              <p className="text-gray-700">
                A doctor assesses <strong>movement, coordination, and reflexes</strong> to identify symptoms.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-green-600 bg-green-100">📝 Medical History</Badge>
              <p className="text-gray-700">
                Reviewing <strong>family history and past symptoms</strong> helps in understanding risk factors.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-yellow-600 bg-yellow-100">🔬 Dopamine Imaging</Badge>
              <p className="text-gray-700">
                <strong>DaTscan</strong> can help detect <strong>dopamine deficiency</strong> in the brain.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-red-600 bg-red-100">⚕️ Response to Medication</Badge>
              <p className="text-gray-700">
                Doctors may prescribe <strong>Levodopa</strong> and monitor <strong>symptom improvement</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-purple-600 bg-purple-100">🧠 MRI & CT Scans</Badge>
              <p className="text-gray-700">
                Used to rule out <strong>other neurological conditions</strong> with similar symptoms.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-indigo-600 bg-indigo-100">🦠 Lab Tests</Badge>
              <p className="text-gray-700">
                Blood tests help <strong>exclude other possible causes</strong> of movement disorders.
              </p>
            </div>
          </div>

          {/* Learn More Button */}
          <div className="flex justify-center mt-6">
            <a
              href="https://www.parkinson.org/Understanding-Parkinsons/Diagnosis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="px-6 py-2 text-lg font-semibold">
                Learn More
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
