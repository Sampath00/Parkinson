import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import lifeStyleImage from '../assets/LifeStyleImage.webp';

export const Lifestyle = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-xl border border-gray-300 bg-white rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Healthy Lifestyle for Parkinson’s
          </CardTitle>
          <p className="text-gray-600 text-sm">Adopting positive habits to improve well-being</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image with Aspect Ratio */}
          <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
          <img
                src={lifeStyleImage}
                alt="Brain health"
                className="w-full h-full object-cover"
              />
          </AspectRatio>

          {/* Description */}
          <p className="text-lg text-gray-700 leading-relaxed">
            While Parkinson’s disease cannot be cured, adopting a <strong>healthy lifestyle</strong> can <strong>improve symptoms and enhance quality of life</strong>.
          </p>

          <Separator />

          {/* Lifestyle Tips */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-green-600 bg-green-100">🥦 Balanced Diet</Badge>
              <p className="text-gray-700">
                A <strong>nutrient-rich diet</strong> with <strong>fruits, vegetables, and lean proteins</strong> can help maintain overall health.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-blue-600 bg-blue-100">🏃‍♂️ Regular Exercise</Badge>
              <p className="text-gray-700">
                Engaging in <strong>low-impact exercises</strong> like <strong>yoga, walking, and stretching</strong> improves mobility and reduces stiffness.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-yellow-600 bg-yellow-100">💤 Quality Sleep</Badge>
              <p className="text-gray-700">
                <strong>Good sleep hygiene</strong> is crucial for <strong>managing fatigue</strong> and improving brain function.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-purple-600 bg-purple-100">🧘 Stress Management</Badge>
              <p className="text-gray-700">
                <strong>Meditation, deep breathing, and social support</strong> help <strong>reduce stress and anxiety</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-red-600 bg-red-100">🚫 Avoiding Toxins</Badge>
              <p className="text-gray-700">
                Limiting <strong>exposure to pesticides, heavy metals, and chemicals</strong> may lower the risk of disease progression.
              </p>
            </div>
          </div>

          {/* Learn More Button */}
          <div className="flex justify-center mt-6">
            <a
              href="https://www.parkinson.org/Understanding-Parkinsons/Treatment/Wellness"
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
