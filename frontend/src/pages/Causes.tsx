import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CauseImage from '../assets/CausesImg.webp';
import { Button } from "@/components/ui/button";

export const Causes = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-xl border border-gray-300 bg-white rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Causes of Parkinson’s Disease
          </CardTitle>
          <p className="text-gray-600 text-sm">Understanding the factors behind Parkinson’s</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image with Aspect Ratio */}
          <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
              <img
                src={CauseImage}
                alt="Brain health"
                className="w-full h-full"
              />
          </AspectRatio>

          {/* Description */}
          <p className="text-lg text-gray-700 leading-relaxed">
            Parkinson’s disease is caused by the progressive loss of <strong>dopamine-producing neurons</strong> in the brain.
            While the exact cause remains unknown, various <strong>genetic and environmental factors</strong> contribute.
          </p>

          <Separator />

          {/* List of Causes */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-blue-600 bg-blue-100">🧬 Genetic Mutations</Badge>
              <p className="text-gray-700">
                Some <strong>inherited genetic mutations</strong> may contribute, though most cases are <strong>sporadic</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-green-600 bg-green-100">🌍 Environmental Factors</Badge>
              <p className="text-gray-700">
                Exposure to <strong>toxins, pesticides, or heavy metals</strong> may increase the risk.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-purple-600 bg-purple-100">🧠 Dopamine Loss</Badge>
              <p className="text-gray-700">
                Damage to <strong>dopamine-producing cells</strong> in the brain plays a central role.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-yellow-600 bg-yellow-100">⏳ Aging</Badge>
              <p className="text-gray-700">
                A significant risk factor, as <strong>neuron degeneration naturally</strong> occurs over time.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-red-600 bg-red-100">🔥 Oxidative Stress</Badge>
              <p className="text-gray-700">
                <strong>Mitochondrial dysfunction</strong> and oxidative stress contribute to neuronal damage.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-gray-600 bg-gray-100">🩹 Head Injuries</Badge>
              <p className="text-gray-700">
                Trauma or repeated <strong>head injuries</strong> may increase the risk of Parkinson’s.
              </p>
            </div>
          </div>
          {/* Learn More Button */}
          <div className="flex justify-center mt-6">
            <a
              href="https://www.parkinson.org/Understanding-Parkinsons/Causes"
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
}
