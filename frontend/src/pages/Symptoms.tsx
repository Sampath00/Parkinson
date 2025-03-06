import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import symptomsImage from '../assets/SymptomsImage.webp';

export const Symptoms = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-xl border border-gray-300 bg-white rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Symptoms of Parkinson’s Disease
          </CardTitle>
          <p className="text-gray-600 text-sm">Recognizing early signs to seek timely care</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Section */}
          <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
            <img
              src={symptomsImage}
              alt="Parkinson's Disease Symptoms"
              className="w-full h-full"
            />
          </AspectRatio>

          {/* Description */}
          <p className="text-lg text-gray-700 leading-relaxed">
            Parkinson’s disease affects <strong>movement and cognitive functions</strong> due to the loss of dopamine-producing neurons in the brain. Symptoms gradually worsen over time.
          </p>

          <Separator />

          {/* Symptoms List */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-red-600 bg-red-100">🦵 Tremors</Badge>
              <p className="text-gray-700">Involuntary shaking, often in hands or fingers, noticeable at rest.</p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-blue-600 bg-blue-100">🐢 Slowed Movement</Badge>
              <p className="text-gray-700"><strong>Bradykinesia</strong> causes sluggish movements, making daily tasks harder.</p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-yellow-600 bg-yellow-100">⚖️ Muscle Rigidity</Badge>
              <p className="text-gray-700">Stiff muscles limit movement and may cause discomfort or pain.</p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-purple-600 bg-purple-100">⚖️ Postural Instability</Badge>
              <p className="text-gray-700">Impaired balance and coordination increase the risk of falls.</p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-green-600 bg-green-100">😐 Facial Masking</Badge>
              <p className="text-gray-700">Reduced facial expressions lead to a blank or emotionless look.</p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-indigo-600 bg-indigo-100">💬 Speech Changes</Badge>
              <p className="text-gray-700">Softer, slurred, or hesitant speech patterns make communication difficult.</p>
            </div>
          </div>

          {/* Learn More Button */}
          <div className="flex justify-center mt-6">
            <a
              href="https://www.parkinson.org/Understanding-Parkinsons/Symptoms"
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
